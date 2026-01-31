// JavaScript source code
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

const defaultBackgroundImage = 'img/screen2.jpg';

document.addEventListener('DOMContentLoaded', function () {
    // Устанавливаем фон при загрузке DOM
    setDisplayBackground(defaultBackgroundImage);
});

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

(function shuffle() {
    cards.forEach(card => {
      let ramdomPos = Math.floor(Math.random() * 12);
      card.style.order = ramdomPos;
    });
  })();

cards.forEach(card => card.addEventListener('click', flipCard));
