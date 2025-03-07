const images = [
  'images/image1.png', 'images/image2.png', 'images/image3.png', 'images/image4.png', 'images/image5.png', 'images/image6.png', 'images/image7.png', 'images/image8.png', 'images/image9.png', 'images/image10.png', 'images/image11.png', 'images/image12.png', 'images/image13.png', 'images/image14.png', 'images/image15.png', 'images/image16.png', 'images/image17.png', 'images/image18.png', 'images/image19.png', 'images/image20.png', 'images/image21.png', 'images/image22.png', 'images/image23.png', 'images/image24.png', 'images/image25.png', 'images/image26.png', 'images/image27.png', 'images/image28.png', 'images/image29.png', 'images/image30.png', 'images/image31.png', 'images/image32.png', 'images/image33.png', 'images/image34.png', 'images/image35.png', 'images/image36.png', 'images/image37.png', 'images/image38.png', 'images/image39.png', 'images/image40.png', 'images/image41.png', 'images/image42.png', 'images/image43.png', 'images/image44.png', 'images/image45.png', 'images/image46.png', 'images/image47.png', 'images/image48.png', 'images/image49.png', 'images/image50.png', 'images/image51.png', 'images/image52.png', 'images/image53.png', 'images/image54.png', 'images/image55.png', 'images/image56.png', 'images/image57.png', 'images/image58.png', 'images/image59.png', 'images/image60.png', 'images/image61.png', 'images/image62.png', 'images/image63.png', 'images/image64.png', 'images/image65.png', 'images/image66.png', 'images/image67.png', 'images/image68.png', 'images/image69.png', 'images/image70.png', 'images/image71.png', 'images/image72.png', 'images/image73.png', 'images/image74.png', 'images/image75.png', 'images/image76.png', 'images/image77.png', 'images/image78.png', 'images/image79.png', 'images/image80.png', 'images/image81.png', 'images/image82.png', 'images/image83.png', 'images/image84.png', 'images/image85.png', 'images/image86.png', 'images/image87.png', 'images/image88.png', 'images/image89.png', 'images/image90.png', 'images/image91.png', 'images/image92.png', 'images/image93.png', 'images/image94.png', 'images/image95.png', 'images/image96.png', 'images/image97.png', 'images/image98.png', 'images/image99.png', 'images/image1.png', 'images/image2.png', 'images/image3.png', 'images/image4.png', 'images/image5.png', 'images/image6.png', 'images/image7.png', 'images/image8.png', 'images/image9.png', 'images/image10.png', 'images/image11.png', 'images/image12.png', 'images/image13.png', 'images/image14.png', 'images/image15.png', 'images/image16.png', 'images/image17.png', 'images/image18.png', 'images/image19.png', 'images/image20.png', 'images/image21.png', 'images/image22.png', 'images/image23.png', 'images/image24.png', 'images/image25.png', 'images/image26.png', 'images/image27.png', 'images/image28.png', 'images/image29.png', 'images/image30.png', 'images/image31.png', 'images/image32.png', 'images/image33.png', 'images/image34.png', 'images/image35.png', 'images/image36.png', 'images/image37.png', 'images/image38.png', 'images/image39.png', 'images/image40.png', 'images/image41.png', 'images/image42.png', 'images/image43.png', 'images/image44.png', 'images/image45.png', 'images/image46.png', 'images/image47.png', 'images/image48.png', 'images/image49.png', 'images/image50.png', 'images/image51.png', 'images/image52.png', 'images/image53.png', 'images/image54.png', 'images/image55.png', 'images/image56.png', 'images/image57.png', 'images/image58.png', 'images/image59.png', 'images/image60.png', 'images/image61.png', 'images/image62.png', 'images/image63.png', 'images/image64.png', 'images/image65.png', 'images/image66.png', 'images/image67.png', 'images/image68.png', 'images/image69.png', 'images/image70.png', 'images/image71.png', 'images/image72.png', 'images/image73.png', 'images/image74.png', 'images/image75.png', 'images/image76.png', 'images/image77.png', 'images/image78.png', 'images/image79.png', 'images/image80.png', 'images/image81.png', 'images/image82.png', 'images/image83.png', 'images/image84.png', 'images/image85.png', 'images/image86.png', 'images/image87.png', 'images/image88.png', 'images/image89.png', 'images/image90.png', 'images/image91.png', 'images/image92.png', 'images/image93.png', 'images/image94.png', 'images/image95.png', 'images/image96.png', 'images/image97.png', 'images/image98.png', 'images/image99.png'
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