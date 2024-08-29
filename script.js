const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const cardsArray = [
    'A', 'A', 'B', 'B', 
    'C', 'C', 'D', 'D',
    'E', 'E', 'F', 'F',
    'G', 'G', 'H', 'H'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let startTime = null;
let timerInterval = null;
let playerName = prompt("Enter your name:");

function createBoard() {
    const shuffledArray = shuffle(cardsArray);
    shuffledArray.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        timerElement.innerText = `Time: ${elapsedTime}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function flipCard() {
    if (!startTime) startTimer();
    if (lockBoard) return;
    this.classList.add('flipped');
    this.innerText = this.dataset.value;

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchedPairs++;
        if (matchedPairs === cardsArray.length / 2) {
            stopTimer();
            const elapsedTime = Math.floor((new Date() - startTime) / 1000);
            savePlayerStats(playerName, elapsedTime);
            alert(`Congratulations, ${playerName}! You've completed the game in ${elapsedTime}s.`);
            displayLeaderboard();
        }
        resetBoard();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerText = '';
            secondCard.innerText = '';
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function savePlayerStats(name, time) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, time });
    leaderboard.sort((a, b) => a.time - b.time);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    let leaderboardText = 'Leaderboard:\n';
    leaderboard.forEach((player, index) => {
        leaderboardText += `${index + 1}. ${player.name} - ${player.time}s\n`;
    });
    alert(leaderboardText);
}

createBoard();
