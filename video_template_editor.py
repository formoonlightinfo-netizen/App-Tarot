#!/usr/bin/env python3
"""
video_template_editor.py — Editor automatico di video per letture di tarocchi.

Prima versione base. Pipeline implementata:
  1. Template di stile riutilizzabile (font Cinzel + Classic Light, colori, glow, layout)
     salvato/caricato da JSON, con estrazione guidata da un video di esempio (via Claude).
  2. Elaborazione automatica del video grezzo:
       - trascrizione audio (faster-whisper / openai-whisper, se installati)
       - rilevamento e taglio dei silenzi (ffmpeg silencedetect)
       - zoom automatico nei momenti salienti (crop/scale time-varying)
       - card di testo automatiche (titolo Cinzel + corpo Classic Light, con glow)
       - montaggio finale (concat dei segmenti utili + overlay zoom/card)
  3. Output pensato per rifinitura manuale in un editor esterno, non per la perfezione.
  4. Export verticale (1080x1920), orizzontale (1920x1080), o entrambi.
  5. Il file grezzo non viene mai cancellato: a fine lavoro viene spostato in archivio/.
  6. Due modalità d'uso semplici: wizard interattivo da terminale (--interactive) e
     GUI minimale in Tkinter (--gui), oltre alla modalità a riga di comando pura.

I font sono già inclusi nella cartella fonts/ (scaricati da Google Fonts,
licenza SIL Open Font License — vedi i file LICENSE-*.OFL.txt lì dentro):
  - Cinzel-Regular.ttf / Cinzel-Bold.ttf per i titoli
  - ClassicLight-Regular.ttf (font "Cormorant" peso Light — su Google Fonts
    non esiste una famiglia chiamata letteralmente "Classic Light", quindi è
    stato scelto questo serif chiaro ed elegante che si abbina bene a Cinzel)
Non serve nessuna configurazione manuale dei font: funziona già così.

Dipendenze esterne richieste: ffmpeg / ffprobe nel PATH.
Dipendenze Python opzionali (il tool degrada con avvisi se mancano):
  pillow, faster-whisper (o openai-whisper), anthropic.

Da estendere in versioni successive: rilevamento più fine dei momenti salienti,
crossfade audio ai tagli, più stili di card, GUI più ricca.
"""

from __future__ import annotations

import argparse
import base64
import json
import logging
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

LOG = logging.getLogger("video_template_editor")

# --------------------------------------------------------------------------
# Dipendenze opzionali
# --------------------------------------------------------------------------
try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
except ImportError:
    Image = ImageDraw = ImageFont = ImageFilter = None

_WHISPER_BACKEND: Optional[str] = None
try:
    from faster_whisper import WhisperModel  # type: ignore
    _WHISPER_BACKEND = "faster_whisper"
except ImportError:
    try:
        import whisper  # type: ignore
        _WHISPER_BACKEND = "openai_whisper"
    except ImportError:
        _WHISPER_BACKEND = None

try:
    import anthropic  # type: ignore
except ImportError:
    anthropic = None

SCRIPT_DIR = Path(__file__).resolve().parent
FONTS_DIR = SCRIPT_DIR / "fonts"
TEMPLATES_DIR = SCRIPT_DIR / "templates"
ARCHIVE_DIRNAME = "archivio"

TITLE_FONT_CANDIDATES = ["Cinzel-Bold.ttf", "Cinzel-Regular.ttf", "Cinzel.ttf", "Cinzel-Bold.otf"]
BODY_FONT_CANDIDATES = [
    "ClassicLight-Regular.ttf", "ClassicLight.ttf", "Classic Light.ttf", "ClassicLight-Regular.otf",
]


# ==========================================================================
# Template di stile
# ==========================================================================

@dataclass
class StyleTemplate:
    """Parametri di stile riutilizzabili: font, colori, glow, layout della card."""

    name: str = "default_tarot_style"
    title_font: str = "Cinzel-Bold.ttf"
    body_font: str = "ClassicLight-Regular.ttf"
    title_color: str = "#D4AF37"        # oro
    body_color: str = "#F5F0E1"         # avorio
    glow_color: str = "#8B5CF6"         # viola
    glow_enabled: bool = True
    glow_radius: int = 14
    glow_intensity: float = 0.85
    card_background_color: str = "#150B24"
    card_background_opacity: float = 0.55
    card_position: str = "bottom_center"   # bottom_center | top_center | center
    card_width_ratio: float = 0.85
    card_padding: int = 44
    card_corner_radius: int = 26
    title_font_size: int = 58
    body_font_size: int = 40
    max_body_lines: int = 3
    zoom_enabled: bool = True
    zoom_factor: float = 1.18
    zoom_ramp_seconds: float = 0.6
    zoom_hold_seconds: float = 1.0
    silence_threshold_db: float = -35.0
    silence_min_duration: float = 0.6
    silence_keep_padding: float = 0.15
    card_min_display_seconds: float = 1.6

    @classmethod
    def from_file(cls, path: Path) -> "StyleTemplate":
        data = json.loads(Path(path).read_text(encoding="utf-8"))
        known = {f.name for f in cls.__dataclass_fields__.values()}  # type: ignore[attr-defined]
        filtered = {k: v for k, v in data.items() if k in known}
        return cls(**filtered)

    def save(self, path: Path) -> None:
        Path(path).write_text(json.dumps(asdict(self), indent=2, ensure_ascii=False), encoding="utf-8")

    def resolve_font(self, kind: str) -> Optional[Path]:
        """Cerca il file del font indicato (titolo o corpo) in fonts/."""
        wanted = self.title_font if kind == "title" else self.body_font
        candidates = [wanted] + (TITLE_FONT_CANDIDATES if kind == "title" else BODY_FONT_CANDIDATES)
        for name in candidates:
            p = FONTS_DIR / name
            if p.exists():
                return p
        return None


def ensure_default_template() -> Path:
    """Crea templates/default.json al primo avvio, se non esiste già."""
    TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
    default_path = TEMPLATES_DIR / "default.json"
    if not default_path.exists():
        StyleTemplate().save(default_path)
        LOG.info("Creato template di default: %s", default_path)
    return default_path


# ==========================================================================
# Utility ffmpeg / ffprobe
# ==========================================================================

def _run(cmd: list, capture: bool = True) -> subprocess.CompletedProcess:
    LOG.debug("Eseguo: %s", " ".join(cmd))
    return subprocess.run(
        cmd,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
        text=True,
        check=False,
    )


def check_ffmpeg_available() -> None:
    for binary in ("ffmpeg", "ffprobe"):
        if shutil.which(binary) is None:
            raise RuntimeError(
                f"'{binary}' non trovato nel PATH. Installa ffmpeg (include ffprobe) "
                "prima di usare questo script."
            )


def probe_duration(path: Path) -> float:
    result = _run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(path),
    ])
    try:
        return float(result.stdout.strip())
    except ValueError:
        raise RuntimeError(f"Impossibile leggere la durata di {path}: {result.stderr}")


# ==========================================================================
# Rilevamento silenzi e calcolo dei segmenti da mantenere
# ==========================================================================

_SILENCE_START_RE = re.compile(r"silence_start:\s*([0-9.]+)")
_SILENCE_END_RE = re.compile(r"silence_end:\s*([0-9.]+)")


def detect_silences(path: Path, threshold_db: float, min_duration: float) -> list[tuple[float, float]]:
    """Ritorna la lista di intervalli di silenzio (start, end) in secondi."""
    cmd = [
        "ffmpeg", "-i", str(path), "-af",
        f"silencedetect=noise={threshold_db}dB:d={min_duration}",
        "-f", "null", "-",
    ]
    result = _run(cmd)
    log_text = result.stderr or ""

    silences: list[tuple[float, float]] = []
    pending_start: Optional[float] = None
    for line in log_text.splitlines():
        start_match = _SILENCE_START_RE.search(line)
        end_match = _SILENCE_END_RE.search(line)
        if start_match:
            pending_start = float(start_match.group(1))
        elif end_match and pending_start is not None:
            silences.append((pending_start, float(end_match.group(1))))
            pending_start = None
    return silences


def compute_keep_segments(
    duration: float, silences: list[tuple[float, float]], padding: float
) -> list[tuple[float, float]]:
    """Complemento dei silenzi (con un piccolo margine) ritagliato su [0, duration]."""
    if not silences:
        return [(0.0, duration)]

    cuts = []
    for start, end in sorted(silences):
        cut_start = max(0.0, start + padding)
        cut_end = min(duration, end - padding)
        if cut_end > cut_start:
            cuts.append((cut_start, cut_end))

    segments = []
    cursor = 0.0
    for cut_start, cut_end in cuts:
        if cut_start > cursor:
            segments.append((cursor, cut_start))
        cursor = max(cursor, cut_end)
    if cursor < duration:
        segments.append((cursor, duration))

    # scarta micro-segmenti residui (rumore di parsing)
    return [(s, e) for s, e in segments if e - s > 0.05]


def map_time_to_edited(t: float, keep_segments: list[tuple[float, float]]) -> float:
    """Converte un istante nel video originale nell'istante corrispondente
    nel video dopo il taglio dei silenzi (concat dei keep_segments)."""
    cumulative = 0.0
    for start, end in keep_segments:
        if t < start:
            return cumulative
        if t <= end:
            return cumulative + (t - start)
        cumulative += end - start
    return cumulative


# ==========================================================================
# Trascrizione
# ==========================================================================

@dataclass
class TranscriptSegment:
    start: float
    end: float
    text: str


def transcribe(path: Path, language: str = "it") -> list[TranscriptSegment]:
    if _WHISPER_BACKEND is None:
        LOG.warning(
            "Nessun backend di trascrizione disponibile (installa faster-whisper o openai-whisper). "
            "Le card di testo e lo zoom automatico basati sul parlato saranno disattivati."
        )
        return []

    LOG.info("Trascrizione audio in corso (backend: %s)...", _WHISPER_BACKEND)
    if _WHISPER_BACKEND == "faster_whisper":
        model = WhisperModel("small", compute_type="int8")
        segments_iter, _info = model.transcribe(str(path), language=language)
        return [TranscriptSegment(s.start, s.end, s.text.strip()) for s in segments_iter]

    model = whisper.load_model("small")
    result = model.transcribe(str(path), language=language)
    return [
        TranscriptSegment(seg["start"], seg["end"], seg["text"].strip())
        for seg in result.get("segments", [])
    ]


# ==========================================================================
# Selezione dei momenti salienti (card + zoom)
# ==========================================================================

@dataclass
class Highlight:
    start: float
    end: float
    text: str
    kind: str  # "card" oppure "zoom"


_EMPHASIS_KEYWORDS = [
    "amore", "destino", "futuro", "attenzione", "importante", "cambiamento",
    "energia", "carta", "messaggio", "verità", "scelta", "occasione",
]


def select_highlights_heuristic(segments: list[TranscriptSegment], max_cards: int = 8) -> list[Highlight]:
    """Euristica semplice (nessuna chiamata a servizi esterni): premia frasi brevi
    e incisive o che contengono parole chiave tipiche di una lettura di tarocchi."""
    scored = []
    for seg in segments:
        text = seg.text.strip()
        if not text:
            continue
        word_count = len(text.split())
        score = 0.0
        if 3 <= word_count <= 14:
            score += 1.0
        if any(k in text.lower() for k in _EMPHASIS_KEYWORDS):
            score += 1.5
        if text.endswith(("!", "?")):
            score += 0.5
        if score > 0:
            scored.append((score, seg))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    chosen = sorted(scored[:max_cards], key=lambda pair: pair[1].start)
    return [Highlight(seg.start, seg.end, seg.text, "card") for _score, seg in chosen]


def select_highlights_claude(
    segments: list[TranscriptSegment], template: StyleTemplate, max_cards: int = 8
) -> list[Highlight]:
    """Usa l'API di Claude per scegliere i momenti più rilevanti dell'intera
    trascrizione. Richiede ANTHROPIC_API_KEY e il pacchetto 'anthropic'."""
    if anthropic is None:
        raise RuntimeError("Pacchetto 'anthropic' non installato: pip install anthropic")

    transcript_json = json.dumps(
        [{"start": s.start, "end": s.end, "text": s.text} for s in segments], ensure_ascii=False
    )
    client = anthropic.Anthropic()
    prompt = (
        "Sei un editor video esperto in contenuti di tarocchi per social media. "
        f"Dato questo elenco di segmenti trascritti (JSON), scegli al massimo {max_cards} momenti "
        "più incisivi e adatti a diventare card di testo in sovraimpressione. "
        "Rispondi SOLO con un array JSON di oggetti {start, end, text}, "
        "usando gli stessi timestamp dei segmenti scelti, ordinati per tempo crescente.\n\n"
        f"Segmenti:\n{transcript_json}"
    )
    message = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )
    raw = "".join(block.text for block in message.content if hasattr(block, "text"))
    match = re.search(r"\[.*\]", raw, re.DOTALL)
    if not match:
        raise RuntimeError(f"Risposta di Claude non interpretabile come JSON: {raw!r}")
    picks = json.loads(match.group(0))
    return [Highlight(p["start"], p["end"], p["text"], "card") for p in picks]


def build_zoom_highlights(card_highlights: list[Highlight]) -> list[Highlight]:
    """Ogni card diventa anche un punto di zoom automatico all'inizio della battuta."""
    return [Highlight(h.start, h.start + 0.1, h.text, "zoom") for h in card_highlights]


# ==========================================================================
# Rendering delle card di testo (Cinzel + Classic Light, con glow)
# ==========================================================================

def _load_font(path: Optional[Path], size: int):
    if path is not None and ImageFont is not None:
        try:
            return ImageFont.truetype(str(path), size=size)
        except OSError:
            LOG.warning("Font %s non caricabile, uso il font di default di PIL.", path)
    return ImageFont.load_default() if ImageFont is not None else None


def _wrap_text(text: str, font, draw, max_width: int) -> list[str]:
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), candidate, font=font)
        if bbox[2] - bbox[0] <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def render_text_card(
    text: str, template: StyleTemplate, canvas_width: int, canvas_height: int, out_path: Path
) -> Path:
    """Disegna una card semi-trasparente con titolo (Cinzel) ed eventuale corpo
    (Classic Light), con un alone (glow) dietro al testo, e la salva come PNG."""
    if Image is None:
        raise RuntimeError("Pillow non installato: pip install pillow")

    title_font = _load_font(template.resolve_font("title"), template.title_font_size)
    body_font = _load_font(template.resolve_font("body"), template.body_font_size)

    card_width = int(canvas_width * template.card_width_ratio)
    padding = template.card_padding

    layer = Image.new("RGBA", (canvas_width, canvas_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    lines = _wrap_text(text, title_font, draw, card_width - 2 * padding)[: template.max_body_lines + 1]
    line_height = template.title_font_size + 12
    text_block_height = line_height * len(lines)
    card_height = text_block_height + 2 * padding

    if template.card_position == "top_center":
        card_x, card_y = (canvas_width - card_width) // 2, int(canvas_height * 0.08)
    elif template.card_position == "center":
        card_x = (canvas_width - card_width) // 2
        card_y = (canvas_height - card_height) // 2
    else:  # bottom_center
        card_x = (canvas_width - card_width) // 2
        card_y = int(canvas_height * 0.78) - card_height

    bg_color = _hex_to_rgba(template.card_background_color, template.card_background_opacity)
    draw.rounded_rectangle(
        [card_x, card_y, card_x + card_width, card_y + card_height],
        radius=template.card_corner_radius,
        fill=bg_color,
    )

    title_color = _hex_to_rgba(template.title_color, 1.0)
    glow_color = _hex_to_rgba(template.glow_color, template.glow_intensity)

    text_y = card_y + padding
    for i, line in enumerate(lines):
        font = title_font if i == 0 else (body_font or title_font)
        color = title_color if i == 0 else _hex_to_rgba(template.body_color, 1.0)
        bbox = draw.textbbox((0, 0), line, font=font)
        text_x = card_x + (card_width - (bbox[2] - bbox[0])) // 2

        if template.glow_enabled:
            glow_layer = Image.new("RGBA", layer.size, (0, 0, 0, 0))
            glow_draw = ImageDraw.Draw(glow_layer)
            glow_draw.text((text_x, text_y), line, font=font, fill=glow_color)
            glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(template.glow_radius))
            layer = Image.alpha_composite(layer, glow_layer)
            draw = ImageDraw.Draw(layer)

        draw.text((text_x, text_y), line, font=font, fill=color)
        text_y += line_height

    layer.save(out_path)
    return out_path


def _hex_to_rgba(hex_color: str, opacity: float) -> tuple[int, int, int, int]:
    hex_color = hex_color.lstrip("#")
    r, g, b = (int(hex_color[i : i + 2], 16) for i in (0, 2, 4))
    return (r, g, b, max(0, min(255, int(opacity * 255))))


# ==========================================================================
# Espressione di zoom automatico (crop/scale con parametri variabili nel tempo)
# ==========================================================================

def build_zoom_expr(zoom_windows: list[tuple[float, float, float]], template: StyleTemplate) -> str:
    """Costruisce un'espressione ffmpeg che restituisce il fattore di zoom
    (1.0 = nessuno zoom) in funzione del tempo 't', con rampe morbide su
    ogni finestra (attack -> hold -> release)."""
    ramp = template.zoom_ramp_seconds
    factor = template.zoom_factor
    expr = "1"
    for start, hold_end, _text in zoom_windows:
        attack_start = start
        attack_end = start + ramp
        release_start = hold_end
        release_end = hold_end + ramp
        window_expr = (
            f"if(between(t,{attack_start},{attack_end}),"
            f"1+({factor}-1)*(t-{attack_start})/{ramp},"
            f"if(between(t,{attack_end},{release_start}),{factor},"
            f"if(between(t,{release_start},{release_end}),"
            f"{factor}-({factor}-1)*(t-{release_start})/{ramp},1)))"
        )
        expr = f"if(between(t,{attack_start},{release_end}),{window_expr},{expr})"
    return expr


# ==========================================================================
# Montaggio finale
# ==========================================================================

EXPORT_PRESETS = {
    "vertical": (1080, 1920),
    "horizontal": (1920, 1080),
}


class VideoEditor:
    def __init__(self, template: StyleTemplate, work_dir: Path):
        self.template = template
        self.work_dir = work_dir
        self.work_dir.mkdir(parents=True, exist_ok=True)

    def _build_concat_filter(self, keep_segments: list[tuple[float, float]]) -> tuple[str, str, str]:
        """Ritorna (filtro_video_audio, label_video_finale, label_audio_finale)
        per tagliare i silenzi mantenendo solo i keep_segments."""
        parts = []
        for i, (start, end) in enumerate(keep_segments):
            parts.append(f"[0:v]trim=start={start}:end={end},setpts=PTS-STARTPTS[v{i}]")
            parts.append(f"[0:a]atrim=start={start}:end={end},asetpts=PTS-STARTPTS[a{i}]")
        concat_inputs = "".join(f"[v{i}][a{i}]" for i in range(len(keep_segments)))
        parts.append(f"{concat_inputs}concat=n={len(keep_segments)}:v=1:a=1[vcut][acut]")
        return ";".join(parts), "vcut", "acut"

    def render(
        self,
        input_path: Path,
        keep_segments: list[tuple[float, float]],
        card_highlights: list[Highlight],
        zoom_highlights: list[Highlight],
        export_modes: list[str],
        output_dir: Path,
    ) -> list[Path]:
        output_dir.mkdir(parents=True, exist_ok=True)
        output_paths = []

        concat_filter, v_label, a_label = self._build_concat_filter(keep_segments)
        chain = [concat_filter]
        current_v_label = v_label

        if self.template.zoom_enabled and zoom_highlights:
            zoom_windows = []
            for h in zoom_highlights:
                mapped_start = map_time_to_edited(h.start, keep_segments)
                hold_end = mapped_start + self.template.zoom_hold_seconds
                zoom_windows.append((mapped_start, hold_end, h.text))
            zoom_expr = build_zoom_expr(zoom_windows, self.template)
            chain.append(
                f"[{current_v_label}]crop=w='iw/({zoom_expr})':h='ih/({zoom_expr})':"
                f"x='(iw-ow)/2':y='(ih-oh)/2':eval=frame[vzoom]"
            )
            current_v_label = "vzoom"

        card_inputs = []
        if card_highlights:
            for i, h in enumerate(card_highlights):
                png_path = self.work_dir / f"card_{i}.png"
                render_text_card(h.text, self.template, 1080, 1920, png_path)
                card_inputs.append((png_path, h))

        extra_input_args = []
        for i, (png_path, _h) in enumerate(card_inputs):
            extra_input_args += ["-i", str(png_path)]

        for i, (_png_path, h) in enumerate(card_inputs):
            mapped_start = map_time_to_edited(h.start, keep_segments)
            mapped_end = mapped_start + max(
                self.template.card_min_display_seconds, h.end - h.start
            )
            out_label = f"vcard{i}"
            chain.append(
                f"[{current_v_label}][{i+1}:v]overlay=0:0:"
                f"enable='between(t,{mapped_start},{mapped_end})'[{out_label}]"
            )
            current_v_label = out_label

        filter_complex = ";".join(chain)

        for mode in export_modes:
            width, height = EXPORT_PRESETS[mode]
            out_path = output_dir / f"{input_path.stem}_{mode}.mp4"
            scale_pad = (
                f"[{current_v_label}]scale={width}:{height}:force_original_aspect_ratio=decrease,"
                f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:color=black[vout_{mode}]"
            )
            cmd = [
                "ffmpeg", "-y", "-i", str(input_path), *extra_input_args,
                "-filter_complex", f"{filter_complex};{scale_pad}",
                "-map", f"[vout_{mode}]", "-map", f"[{a_label}]",
                "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                "-c:a", "aac", "-b:a", "192k",
                str(out_path),
            ]
            LOG.info("Rendering export %s -> %s", mode, out_path)
            result = _run(cmd)
            if result.returncode != 0:
                raise RuntimeError(f"ffmpeg fallito per l'export {mode}:\n{result.stderr}")
            output_paths.append(out_path)

        return output_paths


def archive_raw_file(input_path: Path, archive_root: Path) -> Path:
    """Sposta (mai cancella) il file grezzo in archivio/, evitando sovrascritture."""
    archive_root.mkdir(parents=True, exist_ok=True)
    destination = archive_root / input_path.name
    if destination.exists():
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        destination = archive_root / f"{input_path.stem}_{stamp}{input_path.suffix}"
    shutil.move(str(input_path), str(destination))
    LOG.info("File grezzo archiviato in %s", destination)
    return destination


# ==========================================================================
# Estrazione dello stile da un video di esempio (via Claude)
# ==========================================================================

def extract_frame(video_path: Path, timestamp: float, out_path: Path) -> Path:
    cmd = ["ffmpeg", "-y", "-ss", str(timestamp), "-i", str(video_path), "-frames:v", "1", str(out_path)]
    result = _run(cmd)
    if result.returncode != 0:
        raise RuntimeError(f"Impossibile estrarre il frame a {timestamp}s:\n{result.stderr}")
    return out_path


def extract_style_from_example(
    example_video: Path, sample_time: float, output_template_path: Path
) -> StyleTemplate:
    """Estrae colori/glow/layout da un frame del video di esempio usando Claude
    (i font restano fissi: Cinzel per i titoli, Classic Light per il corpo)."""
    if anthropic is None:
        raise RuntimeError("Pacchetto 'anthropic' non installato: pip install anthropic")

    with tempfile.TemporaryDirectory() as tmp:
        frame_path = Path(tmp) / "sample_frame.png"
        extract_frame(example_video, sample_time, frame_path)
        image_b64 = base64.standard_b64encode(frame_path.read_bytes()).decode("utf-8")

    client = anthropic.Anthropic()
    prompt = (
        "Analizza l'immagine: è un fotogramma di un video con una card di testo in "
        "sovraimpressione (stile lettura di tarocchi). Descrivi lo stile SOLO come JSON con "
        "queste chiavi: title_color, body_color, glow_color (tutti hex #RRGGBB), "
        "glow_enabled (bool), glow_intensity (0-1), card_background_color (hex), "
        "card_background_opacity (0-1), card_position (bottom_center|top_center|center), "
        "card_corner_radius (int px). Rispondi solo con l'oggetto JSON, nessun testo extra."
    )
    message = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": image_b64}},
                {"type": "text", "text": prompt},
            ],
        }],
    )
    raw = "".join(block.text for block in message.content if hasattr(block, "text"))
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise RuntimeError(f"Risposta di Claude non interpretabile come JSON: {raw!r}")
    extracted = json.loads(match.group(0))

    template = StyleTemplate(name=output_template_path.stem)
    for key, value in extracted.items():
        if hasattr(template, key):
            setattr(template, key, value)
    template.save(output_template_path)
    LOG.info("Template di stile salvato in %s", output_template_path)
    return template


# ==========================================================================
# Pipeline principale
# ==========================================================================

def process_video(
    input_path: Path,
    template: StyleTemplate,
    export_modes: list[str],
    output_dir: Path,
    archive_dir: Path,
    manual_cards_path: Optional[Path] = None,
    use_claude: bool = False,
) -> list[Path]:
    check_ffmpeg_available()
    input_path = input_path.resolve()

    LOG.info("Analisi di %s...", input_path)
    duration = probe_duration(input_path)
    silences = detect_silences(input_path, template.silence_threshold_db, template.silence_min_duration)
    keep_segments = compute_keep_segments(duration, silences, template.silence_keep_padding)
    LOG.info("Durata originale: %.1fs — %d silenzi rilevati — %d segmenti mantenuti",
              duration, len(silences), len(keep_segments))

    if manual_cards_path is not None:
        raw_cards = json.loads(manual_cards_path.read_text(encoding="utf-8"))
        card_highlights = [Highlight(c["start"], c["end"], c["text"], "card") for c in raw_cards]
    else:
        segments = transcribe(input_path)
        if not segments:
            card_highlights = []
        elif use_claude:
            card_highlights = select_highlights_claude(segments, template)
        else:
            card_highlights = select_highlights_heuristic(segments)

    zoom_highlights = build_zoom_highlights(card_highlights)
    LOG.info("Card di testo pianificate: %d", len(card_highlights))

    with tempfile.TemporaryDirectory(prefix="vte_") as tmp:
        editor = VideoEditor(template, Path(tmp))
        outputs = editor.render(
            input_path, keep_segments, card_highlights, zoom_highlights, export_modes, output_dir
        )

    archive_raw_file(input_path, archive_dir)
    return outputs


# ==========================================================================
# Wizard interattivo da terminale (nessuna competenza tecnica richiesta)
# ==========================================================================

def run_interactive_wizard() -> None:
    print("=== Editor video automatico per letture di tarocchi ===\n")
    input_str = input("Percorso del video grezzo da elaborare: ").strip().strip('"')
    input_path = Path(input_str)
    if not input_path.exists():
        print(f"File non trovato: {input_path}")
        return

    default_template_path = ensure_default_template()
    template_str = input(
        f"Percorso del template di stile [{default_template_path}]: "
    ).strip().strip('"')
    template_path = Path(template_str) if template_str else default_template_path
    template = StyleTemplate.from_file(template_path)

    print("Formato di export:")
    print("  1) Verticale (1080x1920)")
    print("  2) Orizzontale (1920x1080)")
    print("  3) Entrambi")
    choice = input("Scelta [3]: ").strip() or "3"
    export_modes = {"1": ["vertical"], "2": ["horizontal"], "3": ["vertical", "horizontal"]}.get(
        choice, ["vertical", "horizontal"]
    )

    output_dir = Path(input("Cartella di output [./output]: ").strip() or "./output")
    archive_dir = input_path.parent / ARCHIVE_DIRNAME

    print("\nElaborazione in corso, potrebbe richiedere qualche minuto...\n")
    try:
        outputs = process_video(input_path, template, export_modes, output_dir, archive_dir)
    except Exception as exc:
        print(f"Errore durante l'elaborazione: {exc}")
        return

    print("\nCompletato. File generati:")
    for out in outputs:
        print(f"  - {out}")
    print(f"Il file grezzo è stato spostato in: {archive_dir}")


# ==========================================================================
# GUI minimale (Tkinter, opzionale — richiede un display)
# ==========================================================================

def run_gui() -> None:
    try:
        import tkinter as tk
        from tkinter import filedialog, messagebox
    except ImportError:
        print("Tkinter non disponibile in questo ambiente. Usa --interactive.")
        return

    import threading

    root = tk.Tk()
    root.title("Editor video automatico — Tarocchi")
    root.geometry("520x360")

    input_var = tk.StringVar()
    template_var = tk.StringVar(value=str(ensure_default_template()))
    output_var = tk.StringVar(value=str(Path("./output").resolve()))
    vertical_var = tk.BooleanVar(value=True)
    horizontal_var = tk.BooleanVar(value=True)

    def browse_input():
        path = filedialog.askopenfilename(title="Seleziona il video grezzo")
        if path:
            input_var.set(path)

    def browse_template():
        path = filedialog.askopenfilename(title="Seleziona il template", filetypes=[("JSON", "*.json")])
        if path:
            template_var.set(path)

    def browse_output():
        path = filedialog.askdirectory(title="Seleziona la cartella di output")
        if path:
            output_var.set(path)

    def start_processing():
        input_path = Path(input_var.get())
        if not input_path.exists():
            messagebox.showerror("Errore", "Seleziona un video grezzo valido.")
            return
        export_modes = [m for m, v in (("vertical", vertical_var), ("horizontal", horizontal_var)) if v.get()]
        if not export_modes:
            messagebox.showerror("Errore", "Seleziona almeno un formato di export.")
            return

        start_button.config(state="disabled")
        log_box.insert("end", "Elaborazione avviata...\n")

        def worker():
            try:
                template = StyleTemplate.from_file(Path(template_var.get()))
                outputs = process_video(
                    input_path, template, export_modes,
                    Path(output_var.get()), input_path.parent / ARCHIVE_DIRNAME,
                )
                log_box.insert("end", f"Completato:\n" + "\n".join(str(o) for o in outputs) + "\n")
            except Exception as exc:
                log_box.insert("end", f"Errore: {exc}\n")
            finally:
                start_button.config(state="normal")

        threading.Thread(target=worker, daemon=True).start()

    tk.Label(root, text="Video grezzo:").pack(anchor="w", padx=10, pady=(10, 0))
    row1 = tk.Frame(root); row1.pack(fill="x", padx=10)
    tk.Entry(row1, textvariable=input_var).pack(side="left", fill="x", expand=True)
    tk.Button(row1, text="Sfoglia", command=browse_input).pack(side="left", padx=5)

    tk.Label(root, text="Template di stile:").pack(anchor="w", padx=10, pady=(10, 0))
    row2 = tk.Frame(root); row2.pack(fill="x", padx=10)
    tk.Entry(row2, textvariable=template_var).pack(side="left", fill="x", expand=True)
    tk.Button(row2, text="Sfoglia", command=browse_template).pack(side="left", padx=5)

    tk.Label(root, text="Cartella di output:").pack(anchor="w", padx=10, pady=(10, 0))
    row3 = tk.Frame(root); row3.pack(fill="x", padx=10)
    tk.Entry(row3, textvariable=output_var).pack(side="left", fill="x", expand=True)
    tk.Button(row3, text="Sfoglia", command=browse_output).pack(side="left", padx=5)

    row4 = tk.Frame(root); row4.pack(fill="x", padx=10, pady=10)
    tk.Checkbutton(row4, text="Verticale (1080x1920)", variable=vertical_var).pack(side="left")
    tk.Checkbutton(row4, text="Orizzontale (1920x1080)", variable=horizontal_var).pack(side="left")

    start_button = tk.Button(root, text="Avvia elaborazione", command=start_processing)
    start_button.pack(pady=5)

    log_box = tk.Text(root, height=8)
    log_box.pack(fill="both", expand=True, padx=10, pady=10)

    root.mainloop()


# ==========================================================================
# CLI
# ==========================================================================

def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Editor automatico di video per letture di tarocchi.",
    )
    parser.add_argument("-v", "--verbose", action="store_true", help="Log dettagliato")
    subparsers = parser.add_subparsers(dest="command")

    process_parser = subparsers.add_parser("process", help="Elabora un video grezzo")
    process_parser.add_argument("input", type=Path, help="Video grezzo da elaborare")
    process_parser.add_argument("--template", type=Path, default=None, help="Template di stile (JSON)")
    process_parser.add_argument(
        "--export", choices=["vertical", "horizontal", "both"], default="both",
        help="Formato/i di export",
    )
    process_parser.add_argument("--output", type=Path, default=Path("./output"), help="Cartella di output")
    process_parser.add_argument("--archive", type=Path, default=None, help="Cartella archivio (default: <input>/archivio)")
    process_parser.add_argument("--cards", type=Path, default=None, help="File JSON con card manuali (bypassa la trascrizione automatica)")
    process_parser.add_argument("--use-claude", action="store_true", help="Usa l'API di Claude per scegliere i momenti salienti")

    extract_parser = subparsers.add_parser("extract-style", help="Estrai un template di stile da un video di esempio")
    extract_parser.add_argument("example_video", type=Path)
    extract_parser.add_argument("--sample-time", type=float, default=5.0, help="Istante (secondi) da cui estrarre il frame di riferimento")
    extract_parser.add_argument("--output", type=Path, default=TEMPLATES_DIR / "extracted.json")

    subparsers.add_parser("interactive", help="Wizard guidato da terminale")
    subparsers.add_parser("gui", help="Interfaccia grafica minimale")

    return parser


def main(argv: Optional[list] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )

    if args.command is None or args.command == "interactive":
        run_interactive_wizard()
        return 0

    if args.command == "gui":
        run_gui()
        return 0

    if args.command == "extract-style":
        extract_style_from_example(args.example_video, args.sample_time, args.output)
        return 0

    if args.command == "process":
        template_path = args.template or ensure_default_template()
        template = StyleTemplate.from_file(template_path)
        export_modes = ["vertical", "horizontal"] if args.export == "both" else [args.export]
        archive_dir = args.archive or (args.input.parent / ARCHIVE_DIRNAME)
        try:
            outputs = process_video(
                args.input, template, export_modes, args.output, archive_dir,
                manual_cards_path=args.cards, use_claude=args.use_claude,
            )
        except Exception as exc:
            LOG.error("Elaborazione fallita: %s", exc)
            return 1
        for out in outputs:
            LOG.info("Generato: %s", out)
        return 0

    parser.print_help()
    return 0


if __name__ == "__main__":
    sys.exit(main())
