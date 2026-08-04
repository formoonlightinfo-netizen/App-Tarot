(function () {
  const cardButton = document.getElementById('cardButton');
  const cardInner = document.getElementById('cardInner');
  const cardBack = cardInner.querySelector('.card-back');
  const cardFront = cardInner.querySelector('.card-front');
  const cardImage = document.getElementById('cardImage');
  const hint = document.getElementById('hint');
  const result = document.getElementById('result');
  const resultName = document.getElementById('resultName');
  const resultText = document.getElementById('resultText');
  const drawAgain = document.getElementById('drawAgain');

  const HALF_SPIN_MS = 300;

  let isBusy = false;
  let lastIndex = -1;

  function pickCard() {
    if (TAROT_DECK.length === 1) return TAROT_DECK[0];
    let index;
    do {
      index = Math.floor(Math.random() * TAROT_DECK.length);
    } while (index === lastIndex);
    lastIndex = index;
    return TAROT_DECK[index];
  }

  // Spins the card away (edge-on), runs onMidpoint to swap its content,
  // then spins it back into view. Avoids relying on backface-visibility,
  // which renders unreliably in some browsers/headless environments.
  function spin(onMidpoint) {
    cardInner.style.transition = 'transform ' + HALF_SPIN_MS + 'ms cubic-bezier(0.5, 0, 0.75, 0)';
    cardInner.style.transform = 'rotateY(90deg)';

    window.setTimeout(function () {
      onMidpoint();

      cardInner.style.transition = 'none';
      cardInner.style.transform = 'rotateY(-90deg)';
      // eslint-disable-next-line no-unused-expressions
      cardInner.offsetHeight; // force reflow so the jump isn't animated

      cardInner.style.transition = 'transform ' + HALF_SPIN_MS + 'ms cubic-bezier(0.25, 0.25, 0.5, 1)';
      cardInner.style.transform = 'rotateY(0deg)';

      window.setTimeout(function () {
        isBusy = false;
      }, HALF_SPIN_MS);
    }, HALF_SPIN_MS);
  }

  function showResult(card) {
    resultName.textContent = card.name;
    resultText.textContent = card.description;
    hint.classList.add('is-hidden');
    result.classList.add('is-visible');
  }

  function drawCard() {
    if (isBusy) return;
    isBusy = true;

    const card = pickCard();
    const firstDraw = !cardFront.classList.contains('is-active');

    if (firstDraw) {
      result.classList.remove('is-visible');
    }

    spin(function () {
      cardImage.src = card.image;
      cardImage.alt = card.name;
      cardBack.classList.remove('is-active');
      cardFront.classList.add('is-active');
      showResult(card);
    });
  }

  cardButton.addEventListener('click', drawCard);
  drawAgain.addEventListener('click', function (e) {
    e.stopPropagation();
    drawCard();
  });
})();
