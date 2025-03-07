const images = [
  'images/image1.png',
  'images/image2.png',
  'images/image3.png',
  'images/image4.png',
  'images/image1.png',
  'images/image2.png',
  'images/image3.png',
  'images/image4.png'
];

let flippedCards = [];
let matchedCards = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createMemoryGrid() {
  const grid = document.querySelector('.memory-grid');
  const shuffledImages = shuffle(images);
  shuffledImages.forEach((image) => {
    const card = document.createElement('div');
    card.classList.add('memory-card');

    const front = document.createElement('img');
    front.src = image;
    front.classList.add('front');

    const back = document.createElement('div');
    back.classList.add('back');

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (flippedCards.length < 2 && !flippedCards.includes(card) && !card.classList.contains('flipped')) {
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const img1 = card1.querySelector('.front').src;
  const img2 = card2.querySelector('.front').src;

  if (img1 === img2) {
    matchedCards.push(card1, card2);
    if (matchedCards.length === images.length) {
      setTimeout(() => alert('You win!'), 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
    }, 1000);
  }
  flippedCards = [];
}

createMemoryGrid();