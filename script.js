// JavaScript source code

document.addEventListener('DOMContentLoaded', function () {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const defaultBackgroundImage = 'img/screen2.jpg';

    // --- Управление состоянием игры ---
    let isGameRunning = false;
    let isPaused = false;
    let flipTimer = null;

    // Функции фоновой музыки
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

    // Установка фона
    function setDisplayBackground(imagePath) {
        const displayDiv = document.body;
        if (displayDiv) {
            displayDiv.style.backgroundImage = `url('${imagePath}')`;
            displayDiv.style.backgroundSize = "cover";
            displayDiv.style.backgroundPosition = "center";
            displayDiv.style.backgroundRepeat = "no-repeat";
        } else {
            console.error("Элемент body не найден.");
        }
    }

    // Карточки
    const cards = document.querySelectorAll('.memory-card');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }

    function checkForMatch() {
        if (firstCard.dataset.framework === secondCard.dataset.framework) {
            displayLogoInfo(firstCard.dataset.framework);
            disableCards();
            return;
        }
        unflipCards();
    }

    const logoDatabase = {
        citroen: { name: "Citroën", logo_path: "img/citroen.svg", history: "Citroën (Ситроен) была основана Андре Ситроеном в 1919 году. Компания известна своими инновациями, такими как передний привод и гидропневматическая подвеска. Двойные шевроны в логотипе символизируют зубчатые колеса, которые Ситроен производил до основания автомобильной компании." },
        mitsubishi: { name: "Mitsubishi", logo_path: "img/mitsubishi.svg", history: "Mitsubishi (Мицубиси) в переводе означает три алмаза. Это конгломерат, основанный в 1870 году. Логотип состоит из трех ромбов, символизирующих три принципа компании: надежность, честность и ответственность." },
        opel: { name: "Opel", logo_path: "img/opel.svg", history: "Opel (Опель) — немецкий автопроизводитель, основанный в 1862 году. Изначально компания производила швейные машины. Логотип с молнией (Blitz) появился в 1930-х годах и символизирует скорость." },
        peugeot: { name: "Peugeot", logo_path: "img/peugeot.svg", history: "Peugeot (Пежо) — старейшая автомобильная марка в мире, основанная в 1810 году. Лев на логотипе символизирует силу и качество, а также отражает регион Франш-Конте, откуда родом основатели компании." },
        renault: { name: "Renault", logo_path: "img/renault.svg", history: "Renault (Рено) была основана Луи Рено в 1899 году. Знаменитый ромб появился в 1925 году. Современный логотип был представлен в 1992 году и символизирует движение вперед." },
        toyota: { name: "Toyota", logo_path: "img/toyota.svg", history: "Toyota (Тойота) основана Киичиро Тоёдой. Логотип, состоящий из трех эллипсов, символизирует слияние сердец клиентов, продуктов и технологического прогресса компании." }
    };

    // Модальное окно инфо (модель предполагает наличие элементов)
    function displayLogoInfo(framework) {
        const modal = document.getElementById('infoModal');
        if (!modal) return;
        const logoName = document.getElementById('logoName');
        const logoImage = document.getElementById('logoImage');
        const logoHistory = document.getElementById('logoHistory');
        const info = logoDatabase[framework];

        if (info) {
            logoName.textContent = info.name;
            logoImage.src = info.logo_path;
            logoHistory.textContent = info.history;
            modal.style.display = "block";
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
        // Привязать обработчики снова, если нужно
    }

    // Панель управления:Start/Pause
    function togglePause() {
        if (!isGameRunning) return;
        isPaused = !isPaused;

        if (isPaused) {
            lockBoard = true;
            if (flipTimer) clearTimeout(flipTimer);
            pauseBackgroundMusic();
            pauseButton.textContent = 'RESUME';
            console.log("Игра поставлена на паузу.");
        } else {
            if (lockBoard && firstCard && secondCard) {
                resetBoard();
            } else {
                lockBoard = false;
            }
            playBackgroundMusic();
            pauseButton.textContent = 'PAUSE';
            console.log("Игра возобновлена.");
        }
    }

    function initializeGame() {
        isGameRunning = true;
        isPaused = false;
        startButton.disabled = true;
        startButton.textContent = 'GAME STARTED';
        pauseButton.disabled = false;
        pauseButton.textContent = 'PAUSE';

        cards.forEach(card => {
            let ramdomPos = Math.floor(Math.random() * 12);
            card.style.order = ramdomPos;
            card.classList.remove('flip');
            card.removeEventListener('click', flipCard);
            card.addEventListener('click', flipCard);
        });

        playBackgroundMusic();
    }

    // Установка фона по умолчанию
    setDisplayBackground(defaultBackgroundImage);

    // Привязка кнопок
    startButton.addEventListener('click', initializeGame);
    pauseButton.addEventListener('click', togglePause);

    // Изначально сброс состояния карточек
    cards.forEach(card => {
        card.classList.remove('flip');
    });

    // Прегрузка обработчиков кликов на карточках
    // Важно: убедитесь, что у карточек есть data-framework и класс memory-card
});