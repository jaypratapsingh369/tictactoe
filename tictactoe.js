const gameBoard = document.getElementById('gameBoard');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const gameOver = document.getElementById('gameOver');
const gameOverTitle = document.getElementById('gameOverTitle');
const gameOverMessage = document.getElementById('gameOverMessage');
const playAgainButton = document.getElementById('playAgainButton');
const cells = document.querySelectorAll('[data-cell]');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winningLine = null;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition;
            break;
        }
    }

    if (roundWon) {
        drawWinningLine(winningLine);
        setTimeout(() => {
            showGameOver(`Player ${currentPlayer === 'X' ? '❌' : '⭕'} Wins!`);
        }, 1000); // Delay to show the line animation
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        showGameOver("It's a Draw! 🤝");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer === 'X' ? '❌' : '⭕'}'s turn`;
}

function drawWinningLine(winCondition) {
    const line = document.createElement('div');
    line.classList.add('winner-line');

    // Determine the type of line
    if (winCondition[0] % 3 === winCondition[1] % 3) { // Vertical
        line.classList.add('vertical');
        const col = winCondition[0] % 3;
        line.style.left = `${16.67 + col * 33.33}%`;
    } else if (Math.floor(winCondition[0] / 3) === Math.floor(winCondition[1] / 3)) { // Horizontal
        line.classList.add('horizontal');
        const row = Math.floor(winCondition[0] / 3);
        line.style.top = `${16.67 + row * 33.33}%`;
    } else { // Diagonal
        line.classList.add('diagonal');
        if (winCondition[0] === 0) {
            line.classList.add('diagonal-1');
        } else {
            line.classList.add('diagonal-2');
        }
    }

    gameBoard.appendChild(line);
}

function showGameOver(message) {
    gameOverMessage.textContent = message;
    gameOver.style.display = 'flex';
}

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.textContent = `Player ${currentPlayer === 'X' ? '❌' : '⭕'}'s turn`;
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
    });
    // Remove any existing winner line
    const existingLine = gameBoard.querySelector('.winner-line');
    if (existingLine) {
        existingLine.remove();
    }
    gameOver.style.display = 'none';
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
playAgainButton.addEventListener('click', resetGame);

// Initialize the game
statusDisplay.textContent = `Player ${currentPlayer === 'X' ? '❌' : '⭕'}'s turn`;
