let players = 2;
let currentPlayer = 1;
let points = [0, 0, 0];
let firstCard = null;
let secondCard = null;
let canFlip = true;
let images = [];  // Mảng chứa các đường dẫn đến ảnh

document.getElementById('two-players').addEventListener('click', () => startGame(2));
document.getElementById('three-players').addEventListener('click', () => startGame(3));
document.getElementById('restart').addEventListener('click', restartGame);
document.getElementById('back').addEventListener('click', goBackToMenu);

function startGame(playerCount) {
  players = playerCount;
  document.querySelector('.menu').classList.add('hidden');
  document.querySelector('.game-board').classList.remove('hidden');
  loadImages();
  createGrid();
  updatePlayerInfo();
}

function loadImages() {
  images = [];  // Reset mảng hình ảnh trước khi tải lại
  for (let i = 1; i <= 36; i++) { // Tạo 50 cặp hình ảnh
    const imagePath = `img/image${i}.jpg`; // Sử dụng định dạng image(số).jpg
    images.push(imagePath, imagePath); // Thêm cả 2 ảnh để tạo cặp
    console.log("Loading image:", imagePath);  // Kiểm tra đường dẫn ảnh
  }
  images = shuffle(images);
}

function createGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = 'repeat(8, 1fr)'; // 8 cột
  grid.style.gridTemplateRows = 'repeat(9, 1fr)'; // 9 hàng

  images.forEach((src, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = src; // Gán đúng đường dẫn ảnh
    card.dataset.index = index;

    // Tạo thẻ chứa hình ảnh
    const img = document.createElement('div');
    img.classList.add('image');
    img.style.backgroundImage = `url(${src})`; // Đặt hình ảnh cho thẻ
    card.appendChild(img);

    // Tạo lớp phủ cho thẻ
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.backgroundImage = 'url(face-down/placeholder.jpg)'; // Đặt hình ảnh cho lớp phủ
    card.appendChild(overlay);

    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
}

function flipCard() {
  if (!canFlip || this.classList.contains('flipped')) return;

  this.classList.add('flipped');

  // Lật thẻ, không cần gán hình ảnh ở đây
  // Hình ảnh đã được đặt trong phần tử con

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    canFlip = false;
    checkMatch();
  }
}

function checkMatch() {
  console.log('First Card Image:', firstCard.dataset.image);
  console.log('Second Card Image:', secondCard.dataset.image);
  
  if (firstCard.dataset.image === secondCard.dataset.image) {
    // Nếu hai thẻ khớp
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    points[currentPlayer - 1]++;
    updatePlayerInfo();
    resetTurn(true);
    checkGameEnd();
  } else {
    // Nếu không khớp, lật lại thẻ sau 1 giây
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetTurn(false);
    }, 1500);
  }
}

function resetTurn(matched) {
  if (!matched) {
    currentPlayer = (currentPlayer % players) + 1;
  }
  updatePlayerInfo();
  firstCard = null;
  secondCard = null;
  canFlip = true;
}

function updatePlayerInfo() {
  document.getElementById('score1').textContent = points[0];
  document.getElementById('score2').textContent = points[1];
  
  const player1Info = document.querySelector('h2:nth-child(1)');
  const player2Info = document.querySelector('h2:nth-child(2)');
  const player3Info = document.getElementById('player3-info');

  player1Info.classList.toggle('active', currentPlayer === 1);
  player2Info.classList.toggle('active', currentPlayer === 2);
  if (players === 3) {
    player3Info.classList.remove('hidden');
    document.getElementById('score3').textContent = points[2];
    player3Info.classList.toggle('active', currentPlayer === 3);
  } else {
    player3Info.classList.add('hidden');
  }
}

function checkGameEnd() {
  const remainingCards = document.querySelectorAll('.card:not(.flipped)');
  if (remainingCards.length === 0) {
    document.getElementById('restart').classList.remove('hidden');
  }
}

function restartGame() {
  points = [0, 0, 0];
  currentPlayer = 1;
  loadImages();
  createGrid();
  document.getElementById('restart').classList.add('hidden');
}

function goBackToMenu() {
    if (confirm('Bạn có chắc chắn muốn bỏ trận đấu này?')) {
      // Đặt lại điểm số về 0 trước khi quay lại màn hình chính
      points = [0, 0, 0];
      document.querySelector('.game-board').classList.add('hidden');
      document.querySelector('.menu').classList.remove('hidden');
      updatePlayerInfo(); // Cập nhật thông tin người chơi để hiển thị điểm số 0
    }
}
  
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
