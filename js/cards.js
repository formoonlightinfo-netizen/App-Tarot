// Mazzo completo dei 78 Arcani de Il Cerchio del Richiamo, con nome e spiegazione in italiano.
const TAROT_DECK = [
  {
    name: "Il Matto",
    image: "assets/cards/il-matto.jpg",
    description:
      "Il Matto rappresenta i nuovi inizi, il coraggio di ripartire e il passo verso l'ignoto fatto a cuore aperto. Parla di innocenza, spontaneità e della disponibilità a fare un salto nel vuoto senza sapere dove porterà il cammino.\n\nQuesta carta ti invita a fidarti del viaggio che hai davanti, a coltivare la curiosità e ad accogliere le occasioni inattese. Porta con sé lo spirito dell'avventura, ma ti ricorda anche, con dolcezza, di restare presente e di imparare da ogni passo."
  },
  {
    name: "Il Mago",
    image: "assets/cards/il-mago.jpg",
    description:
      "Il Mago simboleggia l'intenzione focalizzata, l'abilità e la capacità di trasformare le idee in realtà. Rappresenta chi ha già tutti gli strumenti necessari e la consapevolezza per usarli con uno scopo preciso.\n\nQuando appare, indica che volontà, creatività e chiarezza mentale sono allineate. Ti incoraggia ad agire con sicurezza, a comunicare con chiarezza e a credere che ciò che immagini possa prendere forma attraverso un impegno deciso."
  },
  {
    name: "La Papessa",
    image: "assets/cards/la-papessa.jpg",
    description:
      "La Papessa rappresenta l'intuizione, la saggezza interiore e la voce silenziosa che parla al di sotto del rumore della vita quotidiana. È la custode dei misteri, dei segreti e di una conoscenza che non sempre può essere messa in parole.\n\nQuando compare, ti invita a rallentare, ad ascoltarti dentro e a fidarti di ciò che percepisci più che di ciò che puoi dimostrare. È una carta di riflessione, di sogni e di verità sottili che si rivelano solo quando concedi loro spazio."
  },
  {
    name: "L'Imperatrice",
    image: "assets/cards/limperatrice.jpg",
    description:
      "L'Imperatrice incarna l'abbondanza, l'energia nutriente e la forza creativa che dà vita alle idee. È legata alla natura, alla bellezza, alla sensualità e al conforto di sentirsi profondamente accuditi.\n\nQuesta carta ti invita a prenderti cura di ciò che hai seminato, che si tratti di una relazione, di un progetto o del tuo stesso benessere. Parla di una crescita che sboccia naturalmente, quando le si concedono calore, pazienza e attenzione."
  },
  {
    name: "L'Imperatore",
    image: "assets/cards/limperatore.jpg",
    description:
      "L'Imperatore rappresenta la struttura, l'autorità e la mano ferma di chi sa guidare. Simboleggia la parte di noi che costruisce fondamenta solide, pone dei confini e crea ordine dal caos.\n\nQuando appare, suggerisce che disciplina, pianificazione e principi chiari ti serviranno bene. Ti invita a prenderti le tue responsabilità, a guidare con equità e a proteggere ciò che hai costruito con impegno costante e buon giudizio."
  },
  {
    name: "Il Papa",
    image: "assets/cards/il-papa.jpg",
    description:
      "Il Papa rappresenta la tradizione, le credenze condivise e la saggezza tramandata attraverso istituzioni, maestri e comunità. Parla di guida, apprendimento e del valore dei percorsi già tracciati.\n\nQuesta carta può suggerire che un consiglio da una fonte autorevole, lo studio di ciò che conosci bene o un ritorno alle tue radici possano offrirti chiarezza in questo momento. Onora il rito, la cerimonia e il significato che nasce dall'appartenere a qualcosa di più grande di te."
  },
  {
    name: "Gli Amanti",
    image: "assets/cards/gli-amanti.jpg",
    description:
      "Gli Amanti rappresentano una connessione autentica, la scelta consapevole e l'unione degli opposti in qualcosa di completo. Pur essendo spesso collegata all'amore romantico, questa carta parla più in generale di valori, impegni e dell'allineamento tra cuore e mente.\n\nTi invita a considerare ciò che davvero conta per te e a scegliere con onestà. Che tu stia affrontando una relazione, una decisione o un bivio, questa carta chiede che tu resti fedele alla tua bussola interiore."
  },
  {
    name: "Il Carro",
    image: "assets/cards/il-carro.jpg",
    description:
      "Il Carro rappresenta la determinazione, la concentrazione e la spinta ad andare avanti nonostante gli ostacoli. Parla di una vittoria conquistata con autodisciplina e della capacità di restare saldi quando le forze tirano in direzioni diverse.\n\nQuando appare, ti incoraggia a prendere le redini, a definire una direzione chiara e a fidarti della tua forza. Il progresso è possibile se resti fedele al tuo obiettivo e rifiuti di farti deviare."
  },
  {
    name: "La Forza",
    image: "assets/cards/la-forza.jpg",
    description:
      "La Forza rappresenta un coraggio silenzioso, la pazienza e il potere gentile che nasce dall'equilibrio interiore più che dalla forza bruta. È la calma che ammansisce ciò che è selvaggio, la mano ferma che affronta le difficoltà con compassione.\n\nQuesta carta ti ricorda che la vera forza non è rumorosa né aggressiva. È la resilienza di andare avanti, la gentilezza di gestirti bene sotto pressione e la fiducia che dolcezza e potere possano convivere."
  },
  {
    name: "L'Eremita",
    image: "assets/cards/leremita.jpg",
    description:
      "L'Eremita rappresenta la solitudine, l'introspezione e la ricerca di un significato dentro di sé. Porta con sé una lanterna che illumina solo il passo successivo, ricordandoci che la saggezza si trova tanto nella quiete quanto nel movimento.\n\nQuando appare, ti invita a fare un passo indietro dal rumore, a riflettere sul tuo cammino e ad ascoltare ciò che già sai. Il tempo trascorso da soli con i tuoi pensieri può portare la chiarezza che il mondo esterno non riesce a darti."
  },
  {
    name: "La Ruota della Fortuna",
    image: "assets/cards/la-ruota-della-fortuna.jpg",
    description:
      "La Ruota della Fortuna rappresenta lo scorrere dei cicli, il ritmo del cambiamento e i momenti in cui la vita svolta in direzioni inaspettate. Parla di fortuna, destino e degli schemi più grandi che agiscono sotto le nostre scelte quotidiane.\n\nQuesta carta ti ricorda che nulla resta uguale per sempre. Quando le cose sembrano difficili, un cambiamento sta arrivando. Quando sembrano facili, godine. Resta radicato nei momenti di svolta e fidati che la ruota continua a girare."
  },
  {
    name: "La Giustizia",
    image: "assets/cards/la-giustizia.jpg",
    description:
      "La Giustizia rappresenta l'equità, la verità e le naturali conseguenze delle nostre azioni. Parla dell'importanza dell'onestà, della responsabilità e di vedere le situazioni con chiarezza, senza pregiudizi.\n\nQuando appare, ti chiede di soppesare le cose con attenzione, di agire con integrità e di accettare i risultati delle decisioni passate. L'equilibrio si ritrova non evitando la difficoltà, ma affrontandola con lucidità e la volontà di rimettere le cose a posto."
  },
  {
    name: "L'Appeso",
    image: "assets/cards/lappeso.jpg",
    description:
      "L'Appeso rappresenta la pausa, la resa e la nuova prospettiva che nasce quando smetti di lottare contro il momento presente. Parla di lasciar andare, di sospendere il giudizio e di guardare le cose da un'angolazione diversa.\n\nQuesta carta suggerisce che aspettare non equivale a perdere. A volte l'intuizione arriva solo quando lasci andare il controllo. Concediti la quiete, osserva e fidati che questa pausa abbia il suo scopo."
  },
  {
    name: "La Morte",
    image: "assets/cards/la-morte.jpg",
    description:
      "La Morte raramente indica una fine letterale. Rappresenta la trasformazione, la chiusura di un capitolo perché un altro possa iniziare, e il naturale rilascio di ciò che non ti serve più.\n\nQuando appare, ti invita a lasciar andare con grazia. Le fini possono essere scomode, ma liberano spazio per il rinnovamento. Fidati che ciò che si allontana sta facendo posto a qualcosa di più in sintonia con chi stai diventando."
  },
  {
    name: "La Temperanza",
    image: "assets/cards/la-temperanza.jpg",
    description:
      "La Temperanza rappresenta l'equilibrio, la moderazione e la paziente fusione degli opposti in armonia. Parla di azione misurata, di un tempismo calmo e dell'arte di trovare la via di mezzo.\n\nQuesta carta ti incoraggia a respirare, a prenderti il tuo tempo e a portare in equilibrio le diverse parti della tua vita. La guarigione e i progressi duraturi non nascono dagli estremi, ma da una cura gentile e costante."
  },
  {
    name: "Il Diavolo",
    image: "assets/cards/il-diavolo.jpg",
    description:
      "Il Diavolo rappresenta l'attaccamento, l'illusione e gli schemi che ci tengono legati quando la libertà è più vicina di quanto pensiamo. Parla di abitudini, paure o convinzioni che sembrano inevitabili ma che spesso sono create da noi stessi.\n\nQuando appare, ti chiede di guardare con onestà a ciò che ti trattiene. Le catene in questa immagine sono in realtà allentate. La consapevolezza è il primo passo per liberarti di ciò che ti limita e riprenderti il tuo potere."
  },
  {
    name: "La Torre",
    image: "assets/cards/la-torre.jpg",
    description:
      "La Torre rappresenta un cambiamento improvviso, il crollo di strutture costruite su basi instabili e le rivelazioni che emergono quando le illusioni cadono. Può sembrare sconvolgente, ma apre la strada a qualcosa di più autentico.\n\nQuesta carta ti ricorda che ciò che è costruito sulla verità resiste. Ciò che crolla doveva cadere. Anche nello sconvolgimento c'è libertà nel vedere le cose per quello che sono davvero."
  },
  {
    name: "La Stella",
    image: "assets/cards/la-stella.jpg",
    description:
      "La Stella rappresenta la speranza, il rinnovamento e la fiducia silenziosa che ritorna dopo un passaggio difficile. È la luce soffusa che appare una volta passata la tempesta, a ricordarti che la guarigione è possibile.\n\nQuando appare, ti invita a fidarti di nuovo, a sognare e a riconnetterti con ciò che ti ispira. C'è calma qui, e la sensazione di essere esattamente dove devi essere."
  },
  {
    name: "La Luna",
    image: "assets/cards/la-luna.jpg",
    description:
      "La Luna rappresenta l'invisibile, l'intuitivo e le parti della vita che non sono ancora chiare. Parla di sogni, immaginazione e dell'incertezza che ci chiede di procedere per sensazioni più che per ragionamento.\n\nQuesta carta ti invita a onorare le tue emozioni e ad avere pazienza con ciò che sta ancora prendendo forma. Non tutto ha bisogno di essere spiegato subito. Fidati di ciò che senti, anche quando il sentiero è poco illuminato."
  },
  {
    name: "Il Sole",
    image: "assets/cards/il-sole.jpg",
    description:
      "Il Sole rappresenta la gioia, la chiarezza e il calore di una vita vissuta apertamente. È la carta della celebrazione, della vitalità e della semplice felicità di essere pienamente presenti.\n\nQuando appare, porta incoraggiamento. Qualunque cosa tu stia costruendo, la luce è dalla tua parte. Lasciati attraversare dall'ottimismo, condividi il tuo calore con gli altri e goditi il momento senza trattenerti."
  },
  {
    name: "Il Giudizio",
    image: "assets/cards/il-giudizio.jpg",
    description:
      "Il Giudizio rappresenta il risveglio, la riflessione e il richiamo a diventare una versione più vera di te stesso. Parla dei momenti in cui vedi il passato con chiarezza e ti senti pronto ad andare avanti con una nuova comprensione.\n\nQuesta carta ti chiede di ascoltare la voce interiore che sa cosa deve cambiare. Perdona ciò che va perdonato, lascia andare ciò che è concluso e rispondi al richiamo a vivere in modo più autentico."
  },
  {
    name: "Il Mondo",
    image: "assets/cards/il-mondo.jpg",
    description:
      "Il Mondo rappresenta il compimento, l'interezza e la chiusura appagante di un ciclo importante. È la carta del successo, dell'integrazione e del silenzioso orgoglio di aver portato qualcosa a termine.\n\nQuando appare, onora il cammino che hai percorso. Fermati a riconoscere quanta strada hai fatto. Un capitolo si sta chiudendo bene, e uno nuovo si sta preparando ad iniziare."
  },
  {
    name: "Asso di Coppe",
    image: "assets/cards/asso-di-coppe.jpg",
    description:
      "L'Asso di Coppe rappresenta l'inizio di un flusso emotivo, un amore nuovo e l'apertura del cuore. È una carta di sentimenti freschi, ispirazione creativa e connessioni che arrivano senza preavviso.\n\nQuando appare, ti invita ad accogliere ciò che ti viene offerto. Concediti di sentire profondamente, esprimi ciò che si muove dentro di te e accogli il calore che sta arrivando verso di te."
  },
  {
    name: "Due di Coppe",
    image: "assets/cards/due-di-coppe.jpg",
    description:
      "Il Due di Coppe rappresenta un legame, il rispetto reciproco e l'incontro di due cuori in un'intesa condivisa. Parla di armonia, attrazione e del calore che scorre tra persone che sanno davvero vedersi.\n\nQuesta carta può indicare un'amicizia che nasce, una conversazione significativa o una relazione che approfondisce la fiducia. Ti ricorda che la connessione si costruisce con apertura e con la volontà di incontrare l'altro alla pari."
  },
  {
    name: "Tre di Coppe",
    image: "assets/cards/tre-di-coppe.jpg",
    description:
      "Il Tre di Coppe rappresenta la celebrazione, l'amicizia e la gioia che nasce dai momenti condivisi. È una carta di comunità, incontri e del semplice piacere di stare tra persone che ti vogliono bene.\n\nQuando appare, ti invita a passare del tempo con chi ti solleva lo spirito. Che tu stia festeggiando un traguardo o semplicemente godendo di buona compagnia, c'è felicità da trovare nello stare insieme."
  },
  {
    name: "Quattro di Coppe",
    image: "assets/cards/quattro-di-coppe.jpg",
    description:
      "Il Quattro di Coppe rappresenta l'introspezione, l'irrequietezza e la sensazione di non trovare più ispirazione in ciò che hai davanti. Parla dei momenti in cui percepisci che manca qualcosa, anche quando le fortune sono a portata di mano.\n\nQuesta carta ti invita ad alzare lo sguardo. Un'opportunità potrebbe attenderti in silenzio, ma devi accorgertene. Rifletti su ciò che desideri davvero e considera che ciò che stai trascurando potrebbe essere proprio ciò di cui hai bisogno."
  },
  {
    name: "Cinque di Coppe",
    image: "assets/cards/cinque-di-coppe.jpg",
    description:
      "Il Cinque di Coppe rappresenta il dolore, la delusione e il peso di concentrarsi su ciò che è stato perso. Onora la tristezza che arriva quando le cose non vanno come si sperava.\n\nQuesta carta ti ricorda anche che non tutto è perduto. Due coppe restano ancora in piedi. Quando sarai pronto, rivolgi con dolcezza l'attenzione a ciò che rimane. La guarigione inizia quando ti concedi di sentire, e poi scegli di guardare avanti."
  },
  {
    name: "Sei di Coppe",
    image: "assets/cards/sei-di-coppe.jpg",
    description:
      "Il Sei di Coppe rappresenta il ricordo, la nostalgia e la dolcezza di tornare a qualcosa di familiare. Parla dell'infanzia, delle vecchie amicizie e del conforto di tempi più semplici.\n\nQuando appare, ti invita a trarre calore dal tuo passato senza restarne intrappolato. Riconnettiti con ciò che un tempo ti rendeva felice, condividi gentilezza con generosità e lascia che una gioia innocente ritrovi la strada nei tuoi giorni."
  },
  {
    name: "Sette di Coppe",
    image: "assets/cards/sette-di-coppe.jpg",
    description:
      "Il Sette di Coppe rappresenta le scelte, i sogni ad occhi aperti e le molte possibilità che possono sembrare travolgenti quando ti si presentano davanti. Parla di immaginazione, ma anche del rischio di perdersi nella fantasia.\n\nQuesta carta ti chiede di guardare con chiarezza a ciò che è reale e a ciò che è solo desiderio. Riporta i tuoi sogni con i piedi per terra, scegli con cura e ricorda che non ogni coppa contiene ciò che sembra."
  },
  {
    name: "Otto di Coppe",
    image: "assets/cards/otto-di-coppe.jpg",
    description:
      "L'Otto di Coppe rappresenta l'allontanarsi, il lasciar andare ciò che non ti appaga più e la ricerca di qualcosa di più autentico. Parla di un coraggio silenzioso e della saggezza di lasciarsi alle spalle ciò che un tempo sembrava importante.\n\nQuando appare, suggerisce che qualcosa dentro di te è pronto per il cambiamento. Fidati della spinta verso ciò che senti più vero, anche se significa lasciare il familiare."
  },
  {
    name: "Nove di Coppe",
    image: "assets/cards/nove-di-coppe.jpg",
    description:
      "Il Nove di Coppe rappresenta l'appagamento, la soddisfazione e la gioia silenziosa di vedere i propri desideri realizzarsi. È spesso chiamata la carta dei desideri, segno di pienezza emotiva e gratitudine.\n\nQuesta carta ti invita a goderti ciò che hai creato e ad apprezzare le comodità che ti circondano. Concediti di sentirti orgoglioso, condividi la tua felicità e riconosci l'abbondanza già presente nella tua vita."
  },
  {
    name: "Dieci di Coppe",
    image: "assets/cards/dieci-di-coppe.jpg",
    description:
      "Il Dieci di Coppe rappresenta l'armonia emotiva, la famiglia e la felicità duratura che nasce dall'amore donato liberamente. Parla di pace domestica, legami profondi e senso di appartenenza.\n\nQuando appare, onora le connessioni che hai coltivato. Prenditi un momento per essere presente con chi ami e per riconoscere la quieta bellezza di una vita costruita sulla cura reciproca."
  },
  {
    name: "Fante di Coppe",
    image: "assets/cards/fante-di-coppe.jpg",
    description:
      "Il Fante di Coppe rappresenta l'ispirazione creativa, una curiosità gentile e i messaggi che toccano il cuore. Questa figura è aperta, immaginativa e non ha paura di sentire.\n\nQuando appare, ti invita ad affrontare la vita con meraviglia. Un'idea sorprendente, un messaggio inatteso o un sentimento tenero potrebbero essere in cammino verso di te. Accoglili con mente aperta."
  },
  {
    name: "Cavaliere di Coppe",
    image: "assets/cards/cavaliere-di-coppe.jpg",
    description:
      "Il Cavaliere di Coppe rappresenta il romanticismo, l'idealismo e la ricerca di qualcosa di significativo. Questa figura segue il cuore, offrendo gesti sinceri e pieni di grazia.\n\nQuesta carta può segnalare un invito, una proposta creativa o l'arrivo di qualcuno o qualcosa che smuove le tue emozioni. Muoviti verso ciò che ti chiama, ma resta abbastanza radicato da vedere le cose per come sono davvero."
  },
  {
    name: "Regina di Coppe",
    image: "assets/cards/regina-di-coppe.jpg",
    description:
      "La Regina di Coppe rappresenta la profondità emotiva, la compassione e la comprensione intuitiva. Ascolta con tutta se stessa e offre cura senza bisogno che le venga chiesta.\n\nQuando appare, ti invita a guidare con empatia. Fidati dei tuoi sentimenti, accogli lo spazio per gli altri e ricorda che la tua dolcezza è anch'essa una forma di saggezza."
  },
  {
    name: "Re di Coppe",
    image: "assets/cards/re-di-coppe.jpg",
    description:
      "Il Re di Coppe rappresenta la maturità emotiva, la calma sotto pressione e la saggezza equilibrata di chi si conosce bene. Tiene in equilibrio cuore e mente con quieta autorevolezza.\n\nQuesta carta ti incoraggia a rispondere invece di reagire, a offrire guida con pazienza e a mantenere calme le tue acque interiori anche quando il mondo intorno a te si agita."
  },
  {
    name: "Asso di Pentacoli",
    image: "assets/cards/asso-di-pentacoli.jpg",
    description:
      "L'Asso di Pentacoli rappresenta nuove opportunità nel mondo materiale, fondamenta fresche e il seme di qualcosa di stabile e duraturo. Parla di inizi radicati nel concreto e nel pratico.\n\nQuando appare, ti invita a piantare ciò che desideri veder crescere. Che tu stia iniziando un progetto, sistemandoti in un nuovo spazio o avviando una nuova routine, il terreno è pronto."
  },
  {
    name: "Due di Pentacoli",
    image: "assets/cards/due-di-pentacoli.jpg",
    description:
      "Il Due di Pentacoli rappresenta l'equilibrio, l'adattabilità e l'abilità di gestire più cose contemporaneamente. Parla del destreggiarsi tra responsabilità restando leggeri sui propri passi.\n\nQuesta carta ti ricorda che la vita si muove a ondate. Resta flessibile, dai priorità con saggezza e ricorda che mantenere grazia sotto pressione è già di per sé un piccolo traguardo."
  },
  {
    name: "Tre di Pentacoli",
    image: "assets/cards/tre-di-pentacoli.jpg",
    description:
      "Il Tre di Pentacoli rappresenta la collaborazione, l'abilità artigianale e la soddisfazione di costruire qualcosa di buono insieme agli altri. Parla del riconoscimento delle competenze e del valore dato all'impegno.\n\nQuando appare, suggerisce che lavorare insieme porterà risultati migliori che agire da soli. Condividi le tue idee, ascolta gli altri e sii orgoglioso di ciò che create come squadra."
  },
  {
    name: "Quattro di Pentacoli",
    image: "assets/cards/quattro-di-pentacoli.jpg",
    description:
      "Il Quattro di Pentacoli rappresenta l'attaccamento, la sicurezza e il desiderio di proteggere ciò che si ha. Parla di stabilità, ma anche del rischio di aggrapparsi troppo stretti.\n\nQuesta carta ti chiede di riflettere su cosa stai custodendo e perché. Alcune cose meritano di essere protette. Altre crescono solo se lasciate libere. Trova l'equilibrio tra prudenza e apertura."
  },
  {
    name: "Cinque di Pentacoli",
    image: "assets/cards/cinque-di-pentacoli.jpg",
    description:
      "Il Cinque di Pentacoli rappresenta la difficoltà, il sentirsi esclusi o l'attraversare un periodo di mancanza. Onora la solitudine che può presentarsi nei momenti difficili.\n\nQuesta carta ti ricorda anche che l'aiuto è più vicino di quanto sembri. Cerca la luce. Chiedi sostegno quando ne hai bisogno e fidati che questo passaggio è temporaneo."
  },
  {
    name: "Sei di Pentacoli",
    image: "assets/cards/sei-di-pentacoli.jpg",
    description:
      "Il Sei di Pentacoli rappresenta la generosità, l'equità e il flusso naturale tra il dare e il ricevere. Parla di condividere ciò che hai e di essere aperti a ricevere sostegno quando arriva.\n\nQuando appare, ti invita a considerare dove serve equilibrio. Offri ciò che puoi. Accetta l'aiuto con grazia. L'abbondanza cresce quando si muove liberamente tra le persone."
  },
  {
    name: "Sette di Pentacoli",
    image: "assets/cards/sette-di-pentacoli.jpg",
    description:
      "Il Sette di Pentacoli rappresenta la pazienza, la valutazione e la visione a lungo termine che nasce da un impegno costante. Parla di fermarsi a valutare i progressi e a fidarsi che la crescita richiede tempo.\n\nQuesta carta ti invita a fare un passo indietro e a considerare ciò che hai seminato. Alcune cose sono pronte per essere raccolte. Altre necessitano di più tempo. In entrambi i casi, il tuo lavoro non è stato vano."
  },
  {
    name: "Otto di Pentacoli",
    image: "assets/cards/otto-di-pentacoli.jpg",
    description:
      "L'Otto di Pentacoli rappresenta la dedizione, l'apprendimento di nuove abilità e l'orgoglio silenzioso di diventare bravi in qualcosa attraverso la pratica. Parla di concentrazione, ripetizione e cura per il proprio mestiere.\n\nQuando appare, ti incoraggia a continuare. Ogni piccolo sforzo si somma. La maestria non nasce solo dal talento, ma dal presentarsi giorno dopo giorno."
  },
  {
    name: "Nove di Pentacoli",
    image: "assets/cards/nove-di-pentacoli.jpg",
    description:
      "Il Nove di Pentacoli rappresenta l'indipendenza, il benessere e il piacere silenzioso di godersi la vita che hai costruito. Parla di autosufficienza e del piacere di momenti tutti tuoi.\n\nQuesta carta ti invita ad apprezzare ciò che ti circonda e a riconoscere la libertà che nasce dai tuoi stessi sforzi. Prenditi il tempo per goderti i frutti di ciò che hai creato."
  },
  {
    name: "Dieci di Pentacoli",
    image: "assets/cards/dieci-di-pentacoli.jpg",
    description:
      "Il Dieci di Pentacoli rappresenta la stabilità duratura, la famiglia e il senso di appartenere a qualcosa che resiste oltre il momento presente. Parla di eredità, tradizione e del conforto di solide fondamenta.\n\nQuando appare, onora ciò che tu e chi ti ha preceduto avete costruito. Sii orgoglioso della casa, della comunità o della storia condivisa che ti sostiene."
  },
  {
    name: "Fante di Pentacoli",
    image: "assets/cards/fante-di-pentacoli.jpg",
    description:
      "Il Fante di Pentacoli rappresenta un nuovo studio, nuove competenze e il desiderio di imparare qualcosa di concreto. Questa figura si avvicina al mondo con curiosità e la volontà di ricominciare da zero.\n\nQuando appare, ti invita a interessarti a qualcosa di nuovo. Iscriviti al corso, inizia il progetto, leggi il libro. I piccoli inizi portano a una crescita significativa."
  },
  {
    name: "Cavaliere di Pentacoli",
    image: "assets/cards/cavaliere-di-pentacoli.jpg",
    description:
      "Il Cavaliere di Pentacoli rappresenta l'impegno costante, l'affidabilità e il progresso lento ma sicuro di chi segue con perseveranza il proprio piano. Questa figura preferisce la coerenza all'apparenza.\n\nQuesta carta ti incoraggia a essere paziente e metodico. Mantieni i tuoi impegni, curane i dettagli e fidati che un lavoro attento costruisce risultati duraturi."
  },
  {
    name: "Regina di Pentacoli",
    image: "assets/cards/regina-di-pentacoli.jpg",
    description:
      "La Regina di Pentacoli rappresenta una praticità premurosa, il comfort e il calore concreto di chi si prende cura della casa, della famiglia e dei dettagli quotidiani.\n\nQuando appare, ti invita a occuparti delle cose essenziali. Mangia bene, riposa, cura il tuo spazio e dedica attenzione a chi ti sta intorno. Un amore silenzioso e costante è già una forma di magia."
  },
  {
    name: "Re di Pentacoli",
    image: "assets/cards/re-di-pentacoli.jpg",
    description:
      "Il Re di Pentacoli rappresenta un successo consolidato, la generosità e la sicurezza di chi ha costruito qualcosa di solido e ama condividerne i frutti.\n\nQuesta carta ti incoraggia a guidare con stabilità e a essere generoso con ciò che hai. La stabilità si costruisce nel tempo, e possiedi la saggezza per gestire con cura ciò che ti è affidato."
  },
  {
    name: "Asso di Spade",
    image: "assets/cards/asso-di-spade.jpg",
    description:
      "L'Asso di Spade rappresenta la chiarezza, la svolta improvvisa e un lampo di intuizione che taglia la confusione. Parla di una prospettiva nuova e del potere di un pensiero lucido.\n\nQuando appare, ti invita a parlare con schiettezza, a vedere con chiarezza e ad agire in base a ciò che ora comprendi. La verità ha un suo slancio: usala con cura."
  },
  {
    name: "Due di Spade",
    image: "assets/cards/due-di-spade.jpg",
    description:
      "Il Due di Spade rappresenta scelte difficili, uno stallo e i momenti in cui evitare sembra più sicuro che decidere. Parla dell'essere bloccati tra due opzioni, senza scegliere nessuna delle due.\n\nQuesta carta ti invita a toglierti la benda dagli occhi. Guarda con onestà ciò che hai davanti. Anche una decisione scomoda è meglio che restare paralizzati."
  },
  {
    name: "Tre di Spade",
    image: "assets/cards/tre-di-spade.jpg",
    description:
      "Il Tre di Spade rappresenta il dolore d'amore, le verità dolorose e la lucidità tagliente che a volte arriva attraverso la sofferenza. Onora il dolore che chiede di essere riconosciuto.\n\nQuando appare, concediti di sentire ciò che è reale. Il dolore non dura per sempre, e nominarlo è il primo passo per lasciarlo attraversare."
  },
  {
    name: "Quattro di Spade",
    image: "assets/cards/quattro-di-spade.jpg",
    description:
      "Il Quattro di Spade rappresenta il riposo, il recupero e la saggezza di fare un passo indietro quando sei stanco. Parla della quiete come forma di forza, non di ritirata.\n\nQuesta carta ti invita a fermarti. Placa la mente, ristora il corpo e concediti la calma che precede l'inizio del capitolo successivo."
  },
  {
    name: "Cinque di Spade",
    image: "assets/cards/cinque-di-spade.jpg",
    description:
      "Il Cinque di Spade rappresenta il conflitto, le vittorie vuote e il prezzo di vincere a ogni costo. Ti chiede di considerare se avere ragione valga davvero ciò che ti costa.\n\nQuesta carta invita alla riflessione. A volte la scelta più saggia è allontanarsi. Scegli con cura le tue battaglie, e ricorda che la pace vale spesso più del trionfo."
  },
  {
    name: "Sei di Spade",
    image: "assets/cards/sei-di-spade.jpg",
    description:
      "Il Sei di Spade rappresenta la transizione, l'andare avanti e il sollievo silenzioso di lasciarsi alle spalle un passaggio difficile. Parla di acque più calme in arrivo.\n\nQuando appare, suggerisce che un cambiamento è in corso. Il percorso potrebbe non essere finito, ma il peggio sta passando. Porta con te solo ciò che ti serve e lascia andare il resto."
  },
  {
    name: "Sette di Spade",
    image: "assets/cards/sette-di-spade.jpg",
    description:
      "Il Sette di Spade rappresenta l'astuzia, la strategia e la tentazione di prendere delle scorciatoie. Può indicare un inganno, da parte di altri o verso se stessi.\n\nQuesta carta ti chiede di essere onesto riguardo alle tue motivazioni. Le mosse furbe possono ritorcersi contro. Considera se una strada più diretta possa servirti meglio nel lungo periodo."
  },
  {
    name: "Otto di Spade",
    image: "assets/cards/otto-di-spade.jpg",
    description:
      "L'Otto di Spade rappresenta la sensazione di essere intrappolati, limitati o incapaci di vedere una via d'uscita. Parla delle gabbie mentali che a volte costruiamo intorno a noi stessi.\n\nQuesta carta ti ricorda che i legami sono più allentati di quanto sembrino. Guardati intorno. La strada da percorrere c'è. Fidati della tua capacità di uscire dalla storia che dice che non puoi muoverti."
  },
  {
    name: "Nove di Spade",
    image: "assets/cards/nove-di-spade.jpg",
    description:
      "Il Nove di Spade rappresenta la preoccupazione, le notti insonni e il modo in cui la paura può ingigantirsi nelle ore silenziose. Onora il peso di una mente in ansia.\n\nQuesta carta ti ricorda che non ogni pensiero è vero. Porta le tue preoccupazioni alla luce del giorno. Parlane, scrivile, e nota quanto spesso il timore pesa più della realtà."
  },
  {
    name: "Dieci di Spade",
    image: "assets/cards/dieci-di-spade.jpg",
    description:
      "Il Dieci di Spade rappresenta le fini, le conclusioni dolorose e il momento più buio che finalmente apre la strada a qualcosa di nuovo. Parla di una chiusura definitiva, ma con la promessa di nuovi inizi.\n\nQuando appare, sappi che la parte difficile sta finendo. Da qui si può solo risalire. Concediti di elaborare il dolore, poi rialzati con dolcezza verso ciò che verrà."
  },
  {
    name: "Fante di Spade",
    image: "assets/cards/fante-di-spade.jpg",
    description:
      "Il Fante di Spade rappresenta la curiosità, un pensiero acuto e la voglia di scoprire la verità delle cose. Questa figura fa domande e segue le idee ovunque conducano.\n\nQuando appare, ti invita a restare curioso, a raccogliere informazioni e a farti sentire quando hai qualcosa da dire. Sii solo attento a come atterrano le tue parole."
  },
  {
    name: "Cavaliere di Spade",
    image: "assets/cards/cavaliere-di-spade.jpg",
    description:
      "Il Cavaliere di Spade rappresenta la rapidità, la convinzione e la spinta ad agire su un'idea senza esitazione. Questa figura carica in avanti, a volte più veloce di quanto la saggezza suggerirebbe.\n\nQuesta carta incoraggia l'azione audace, ma anche la cautela. Muoviti con uno scopo, ma assicurati di sapere dove stai andando. Le decisioni rapide sono potenti, ma lasciano poco spazio alla riflessione."
  },
  {
    name: "Regina di Spade",
    image: "assets/cards/regina-di-spade.jpg",
    description:
      "La Regina di Spade rappresenta una visione chiara, l'onestà e il tipo di saggezza che nasce dall'esperienza. Parla senza fronzoli e vede oltre le apparenze.\n\nQuando appare, ti invita a guidare con verità e a stabilire confini chiari. Compassione e chiarezza possono convivere. Non serve addolcire la verità per essere gentili."
  },
  {
    name: "Re di Spade",
    image: "assets/cards/re-di-spade.jpg",
    description:
      "Il Re di Spade rappresenta l'intelletto, l'equità e l'autorevolezza di chi sa pensare con lucidità sotto pressione. È una mente salda nei momenti difficili.\n\nQuesta carta ti incoraggia a guidare con la ragione, a soppesare i fatti e a offrire indicazioni oneste e ponderate. Il giudizio saggio è ora la tua risorsa più grande."
  },
  {
    name: "Asso di Bastoni",
    image: "assets/cards/asso-di-bastoni.jpg",
    description:
      "L'Asso di Bastoni rappresenta l'ispirazione, l'energia nuova e la scintilla che accende un percorso creativo appena nato. Parla di passione, possibilità e del desiderio di iniziare.\n\nQuando appare, ti invita a seguire quella scintilla. Qualunque cosa si stia muovendo dentro di te è pronta a prendere forma. Fidati dell'impulso e agisci di conseguenza."
  },
  {
    name: "Due di Bastoni",
    image: "assets/cards/due-di-bastoni.jpg",
    description:
      "Il Due di Bastoni rappresenta la pianificazione, la visione e il momento in cui ti trovi sul limite di ciò che potrebbe essere. Parla di guardare oltre e considerare la tua prossima mossa.\n\nQuesta carta ti invita a sognare in grande e a scegliere la tua direzione con cura. Il mondo è più vasto di quanto sembri. Dove andare da qui, sta a te deciderlo."
  },
  {
    name: "Tre di Bastoni",
    image: "assets/cards/tre-di-bastoni.jpg",
    description:
      "Il Tre di Bastoni rappresenta l'espansione, la lungimiranza e la soddisfazione di vedere i propri piani iniziare a realizzarsi. Parla di progresso e di un orizzonte che diventa visibile.\n\nQuando appare, suggerisce che i tuoi sforzi stanno dando frutti. Sii paziente mentre le cose si sviluppano e resta aperto alle opportunità che arrivano da luoghi inaspettati."
  },
  {
    name: "Quattro di Bastoni",
    image: "assets/cards/quattro-di-bastoni.jpg",
    description:
      "Il Quattro di Bastoni rappresenta la celebrazione, la casa e la gioia di raggiungere un traguardo che merita di essere festeggiato. Parla di armonia, appartenenza e successo condiviso.\n\nQuesta carta ti invita a fermarti e ad apprezzare ciò che hai costruito. Riunisciti con chi conta per te. La gioia condivisa è una gioia moltiplicata."
  },
  {
    name: "Cinque di Bastoni",
    image: "assets/cards/cinque-di-bastoni.jpg",
    description:
      "Il Cinque di Bastoni rappresenta l'attrito, la competizione e l'energia di opinioni diverse che si scontrano. Parla di disaccordi che possono frammentare o affinare, a seconda di come vengono gestiti.\n\nQuesta carta ti invita ad ascoltare tanto quanto a parlare. Il conflitto può essere produttivo se affrontato con pazienza. Cerca un terreno comune sotto il rumore."
  },
  {
    name: "Sei di Bastoni",
    image: "assets/cards/sei-di-bastoni.jpg",
    description:
      "Il Sei di Bastoni rappresenta la vittoria, il riconoscimento e l'orgoglio di vedere i propri sforzi apprezzati. Parla di successo pubblico e delle ricompense della perseveranza.\n\nQuando appare, onora il tuo duro lavoro. Accogli gli elogi con grazia, condividi il merito quando è dovuto, e lascia che questo momento ti incoraggi ad andare avanti."
  },
  {
    name: "Sette di Bastoni",
    image: "assets/cards/sette-di-bastoni.jpg",
    description:
      "Il Sette di Bastoni rappresenta il tener duro, il difendere ciò che hai costruito e il restare saldi di fronte alla sfida. Parla di una convinzione messa alla prova.\n\nQuesta carta ti incoraggia a restare forte. Hai il vantaggio della posizione. Fidati di ciò che sai, mantieni la tua posizione e ricorda che i confini a volte meritano di essere difesi."
  },
  {
    name: "Otto di Bastoni",
    image: "assets/cards/otto-di-bastoni.jpg",
    description:
      "L'Otto di Bastoni rappresenta il movimento rapido, lo slancio e il rapido svolgersi degli eventi. Parla di messaggi che arrivano velocemente e di un progresso che accelera.\n\nQuando appare, aspettati che le cose si muovano. Resta agile, rispondi prontamente e cavalca l'onda di energia ora in movimento."
  },
  {
    name: "Nove di Bastoni",
    image: "assets/cards/nove-di-bastoni.jpg",
    description:
      "Il Nove di Bastoni rappresenta la resilienza, l'ultimo tratto di strada e la forza silenziosa di chi ha fatto molta strada ed è determinato a portare tutto a termine.\n\nQuesta carta ti ricorda che sei più forte di quanto ti senta. Riposa se ne hai bisogno, ma non arrenderti. Sei più vicino al traguardo di quanto pensi."
  },
  {
    name: "Dieci di Bastoni",
    image: "assets/cards/dieci-di-bastoni.jpg",
    description:
      "Il Dieci di Bastoni rappresenta il peso, la responsabilità e il carico di portare troppo per troppo tempo. Parla del prezzo di fare tutto da soli.\n\nQuesta carta ti invita a posarne un po'. Non devi portare ogni fardello da solo. Chiedi aiuto, semplifica dove puoi, e ricorda che anche il riposo fa parte del lavoro."
  },
  {
    name: "Fante di Bastoni",
    image: "assets/cards/fante-di-bastoni.jpg",
    description:
      "Il Fante di Bastoni rappresenta l'entusiasmo, le idee fresche e la scintilla di un'avventura pronta a iniziare. Questa figura è audace, curiosa e pronta a esplorare.\n\nQuando appare, ti invita a seguire il tuo entusiasmo. Nuovi interessi, viaggi o impulsi creativi potrebbero chiamarti. Di' sì e scopri dove ti portano."
  },
  {
    name: "Cavaliere di Bastoni",
    image: "assets/cards/cavaliere-di-bastoni.jpg",
    description:
      "Il Cavaliere di Bastoni rappresenta la passione, l'azione e la spinta a inseguire ciò che ti entusiasma. Questa figura si muove rapidamente, alimentata da ispirazione e sicurezza.\n\nQuesta carta ti incoraggia ad agire sulle tue idee, ma anche a pensare prima di lanciarti. Incanala la tua energia con uno scopo, così che il tuo entusiasmo ti porti da qualche parte che vale la pena raggiungere."
  },
  {
    name: "Regina di Bastoni",
    image: "assets/cards/regina-di-bastoni.jpg",
    description:
      "La Regina di Bastoni rappresenta il calore, la sicurezza e la presenza magnetica di chi si sente pienamente a casa in se stesso. Ispira gli altri semplicemente essendo chi è.\n\nQuando appare, ti invita a entrare nella tua luce. Fidati del tuo carisma, guida con il cuore e lascia che la tua autenticità attiri verso di te le persone e le occasioni giuste."
  },
  {
    name: "Re di Bastoni",
    image: "assets/cards/re-di-bastoni.jpg",
    description:
      "Il Re di Bastoni rappresenta la visione, la leadership e la spinta sicura di chi trasforma le idee in movimenti concreti. Guida con passione, bilanciata dall'esperienza.\n\nQuesta carta ti incoraggia a pensare in grande, a prendere in mano la tua direzione e a ispirare chi ti sta intorno. Un'azione audace, radicata nella saggezza, può portarti lontano."
  }
];
