/**
 * Tic - Tac - Toe game for the Odin Project
 */

/**
 * Factory Object: Cell
 *     - Stores the cell details (value)
 *          - value: X, O, or null
 *
 */
const createCell = function() {
  let value = null;

  const setValue = function (value) {
    // check value is either X, O, or null
    if (this.value !== null) {
      throw new Error("Cell already has a value");
    } else {
      if (value === "X" || value === "O" || value === null) {
        this.value = value;
      } else {
        throw new Error("Invalid value");
      }
    }
  };

  const clearValue = function () {
    this.value = null;
  };

  return { value: null, setValue, clearValue };
}

/** Factory object: Player
 *     - Stores the player details
 *       - name: player name
 *       - symbol: X or O
 *       - score: player score
 *     - addScore: method to add score
 *
 *     - validates only 2 players max
 *     - validates player name is not empty
 *     - validates player symbol is either X or O
 */

const playerFactory = function () {
  let playerCount = 0;

  return function (name, symbol) {
    if (playerCount >= 2) {
      throw new Error("Only 2 players allowed");
    }
    if (name === "") {
      throw new Error("Player name cannot be empty");
    }
    if (symbol !== "X" && symbol !== "O") {
      throw new Error("Player symbol must be either X or O");
    }
    playerCount++;

    score = 0;
    name = name;
    symbol = symbol;

    // addScore method
    const addScore = function () {
      score++;
    };

    // getScore method
    const getScore = function () {
      return score;
    };

    return { name, symbol, addScore, getScore };
  };
};

/** Module object: GameBoard
 *
 *      - Stores the game board details
 *      - Cell obj stored in 2D array object
 *      - makeMove method to update the board
 *      - reset method to reset the board
 *      - getBoard method to return the board
 *
 */

const gameBoard = (function () {
  // private data
  const board = [];
  const boardSize = 3;

  // Initialize board

  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(createCell());
    }
    board.push(row);
  }

  /**
   *
   * @param {Number} row
   * @param {Number} col
   * @param {Number} value
   * @returns
   */
  const makeMove = function (row, col, value) {
    try {
      board[row][col].setValue(value);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  // reset method
  const resetBoard = function () {
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        board[i][j].clearValue();
      }
    }
  };

  // getBoard method
  const getBoard = function () {
    return board;
  };

  const printBoard = function () {
    for (let i = 0; i < board.length; i++) {
      let rowString = "";
      for (let j = 0; j < board[i].length; j++) {
        const cellValue = board[i][j].value || "-";
        rowString += cellValue + (j < board[i].length - 1 ? " | " : "");
      }
      console.log(rowString);
      if (i < board.length - 1) {
        console.log("---------");
      }
    }
  };

  return { makeMove, resetBoard, getBoard, printBoard };
})();

/** Module Object: Game Controller
 * Values:
 * - Stores the game controller details
 * - gameBoard: GameBoard object
 * - player1: Player object
 * - player2: Player object
 * - currentPlayer: Player object
 *
 *  Methods:
 *  - makeMove: method to make a move
 *  - switchPlayer: method to switch the current player
 *  - checkWin: method to check if the current player has won
 *  - checkDraw: method to check if the game is a draw
 *  - reset: method to reset the game
 *  - printBoard: method to print the board
 *  -
 *
 */

const gameController = (function () {
  const Board = gameBoard.getBoard();

  // private data
  let player1 = null;
  let player2 = null;
  let currentPlayer = null;
  
  // public data
  // game status
  let gameStatus = null;

  const setGameStatus = function (status) {
    gameStatus = status;
  };

  const getGameStatus = function () {
    return gameStatus;
  };


  // initialize game
  const init = function () {
    const createPlayer = playerFactory();
    player1 = createPlayer("Player 1", "X");
    player2 = createPlayer("Player 2", "O");
    currentPlayer = player1;
  };

  // makeMove method
  const makeMove = function (row, col) {
    if (gameBoard.makeMove(row, col, currentPlayer.symbol)) {
      if (checkWin()) {
        currentPlayer.addScore();
        gameStatus = "win";
        // setGameStatus("win");
        console.log(
          currentPlayer.name + " won the game! Score: " + currentPlayer.getScore()
        )
        return true;
      } else if (checkDraw()) {
        gameStatus = "draw";
        return true;
      } else {
        switchPlayer();
        return false;
      }
    } else {
      return false;
    }
  };

  // switchPlayer method
  const switchPlayer = function () {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  };

  //  checkWin Method
  const checkWin = function () {
    // check rows
    for (let i = 0; i < Board.length; i++) {
      if (Board[i][0].value === currentPlayer.symbol && Board[i][1].value === currentPlayer.symbol && Board[i][2].value === currentPlayer.symbol) {
        return true;
      }
    }

    // check columns
    for (let i = 0; i < Board.length; i++) {
      if (Board[0][i].value === currentPlayer.symbol && Board[1][i].value === currentPlayer.symbol && Board[2][i].value === currentPlayer.symbol) {
        return true;
      }
    }

    // check diagonals
    if (Board[0][0].value === currentPlayer.symbol && Board[1][1].value === currentPlayer.symbol && Board[2][2].value === currentPlayer.symbol) {
      return true;
    }

    if (Board[0][2].value === currentPlayer.symbol && Board[1][1].value === currentPlayer.symbol && Board[2][0].value === currentPlayer.symbol) {
      return true;
    }

    return false;
  };

  // checkDraw method
  const checkDraw = function () {
    // check board is full
    for (let i = 0; i < Board.length; i++) {
      for (let j = 0; j < Board.length; j++) {
        if (Board[i][j].value === null) {
          return false;
        }
      }
    }
    // if full, check win
    return !checkWin();
  };

  // reset method
  const reset = function () {
    gameBoard.resetBoard();
    gameStatus = null;
  };

  // printBoard method
  const printBoard = function () {
    gameBoard.printBoard();
  };

  // playRound method
  const playRound = function () {
    // get move
    console.log(currentPlayer.name + " make a move");
    const input = prompt("Enter move (row, column): ");
    const [row, col] = input.split(',').map(item => parseInt(item.trim()) );
    // make move
    let results = makeMove(row, col);

    // print board
    printBoard();
  };

  return { init, makeMove, reset, printBoard, playRound, setGameStatus, getGameStatus };
})();

//  console version of game testing
gameController.init();
// gameController.setGameStatus("win");
// console.log(gameController.getGameStatus()) // displays "win"


while(true){

  while(gameController.getGameStatus() === null){
    gameController.playRound();
  }
  
  prompt("Press any key to play again");
  gameController.reset();
}

// console.log(gameController);
// gameController.setGameStatus("win");
// gameController.setPublicStatus("public win");
// console.log(gameController.getGameStatus());
// console.log(gameController.getPublicStatus());
// console.log(gameController.publicStatus);
// console.log(gameController);

// const cell = createCell();

// console.log(cell);
// cell.setValue("X");
// console.log(cell.value);


