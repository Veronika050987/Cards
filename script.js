// JavaScript source code

// Получаем аудиоэлемент
const backgroundMusic = document.getElementById('backgroundMusic');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton'); // Новый элемент

// --- Управление состоянием игры ---
let isGameRunning = false; // Флаг, запущена ли игра
let isPaused = false;      // Флаг, поставлена ли игра на паузу
let flipTimer = null;      // Для хранения ID таймаута unflipCards

function playBackgroundMusic() {
    if (backgroundMusic && !isPaused) {
        backgroundMusic.play().catch(error => {
            console.warn("Воспроизведение музыки не удалось:", error);
        });
    }
}

function pauseBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

function setDisplayBackground(imagePath) 
{
    const displayDiv = document.body; 

    if (displayDiv) {
        // Устанавливаем фоновое изображение
        displayDiv.style.backgroundImage = `url('${imagePath}')`;

        // Настраиваем, как изображение должно отображаться
        displayDiv.style.backgroundSize = "cover";       // Масштабирует изображение, чтобы оно полностью покрыло контейнер
        displayDiv.style.backgroundPosition = "center";  // Центрирует изображение
        displayDiv.style.backgroundRepeat = "no-repeat"; // Запрещает повторение

    }
    else {
        console.error("Элемент body не найден.");
    }
}

const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() 
{
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) 
  {
     hasFlippedCard = true;
     firstCard = this;
     return;
   }

   secondCard = this;
   lockBoard = true;

   checkForMatch();
}


function checkForMatch() 
{
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
      disableCards();
      return;
    }
 
    unflipCards();
}

function disableCards() 
{
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}
 
  function unflipCards() 
 {
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      resetBoard();
    }, 1500);
 }

function resetBoard() 
{
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  
}
function togglePause() {
    if (!isGameRunning) return; // Нельзя поставить на паузу, если игра не начата

    isPaused = !isPaused;

    if (isPaused) {
        // 1. PAUSE игры
        lockBoard = true;
        // Убедимся, что таймер, который переворачивает карты, тоже остановлен
        if (flipTimer) clearTimeout(flipTimer);

        // 2. PAUSE музыки
        pauseBackgroundMusic();

        // 3. Обновление интерфейса
        pauseButton.textContent = 'RESUME';
        console.log("Игра поставлена на паузу.");

    } else {
        // 1. Возобновление игры
        // При возобновлении мы должны восстановить lockBoard, но только если он был заблокирован из-за несовпадения.
        // Если lockBoard=true, это значит, что две карты перевернуты и ждут unflipCards. 
        // Так как мы остановили flipTimer, нужно принудительно сбросить их в unflipCards, чтобы игра продолжилась.
        if (lockBoard && firstCard && secondCard) {
            // Если мы ставим на паузу в момент, когда карты ждут сопоставления,
            // при возобновлении мы просто сбрасываем их, чтобы не зависать.
            resetBoard();
        } else {
            // Если не было временной блокировки, просто убираем общую блокировку
            lockBoard = false;
        }

        // 2. Возобновление музыки
        playBackgroundMusic();

        // 3. Обновление интерфейса
        pauseButton.textContent = 'PAUSE';
        console.log("Игра возобновлена.");
    }
}
function initializeGame() {
    // Сброс состояния перед стартом
    isGameRunning = true;
    isPaused = false;
    startButton.disabled = true;
    startButton.textContent = 'GAME STARTED';
    pauseButton.disabled = false;
    pauseButton.textContent = 'PAUSE';

    // Перемешивание и сброс карточек
    cards.forEach(card => {
        let ramdomPos = Math.floor(Math.random() * 12);
        card.style.order = ramdomPos;
        card.classList.remove('flip');
        card.removeEventListener('click', flipCard); // Удаляем старые слушатели, если были
        card.addEventListener('click', flipCard);
    });

    // Запуск музыки
    playBackgroundMusic();
}


document.addEventListener('DOMContentLoaded', function () {
    const defaultBackgroundImage = 'img/screen2.jpg';
    setDisplayBackground(defaultBackgroundImage);

    // Изначально привязываем функцию инициализации к кнопке
    startButton.addEventListener('click', initializeGame);
    pauseButton.addEventListener('click', togglePause);

    // Сбросим состояние карточек перед первым запуском
    cards.forEach(card => {
        // Убедимся, что они не были перевернуты ранее
        card.classList.remove('flip');
    });
})();


//(function shuffle() {
//    cards.forEach(card => {
//      let ramdomPos = Math.floor(Math.random() * 12);
//      card.style.order = ramdomPos;
//    });
//  })();

//cards.forEach(card => card.addEventListener('click', flipCard));


//const defaultBackgroundImage = 'img/screen2.jpg';

//document.addEventListener('DOMContentLoaded', function () {
//    // Устанавливаем фон при загрузке DOM
//    setDisplayBackground(defaultBackgroundImage);

//    playBackgroundMusic();
//});