/**
 * Tic - Tac - Toe game for the Odin Project
 */

/**
 * Factory Object: Cell
 *     - Stores the cell details (value)
 *          - value: X, O, or null
 *
 */
const createCell = function () {
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
};

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

const createPlayer = function (name, symbol) {
  if (name === "") {
    throw new Error("Player name cannot be empty");
  }
  if (symbol !== "X" && symbol !== "O") {
    throw new Error("Player symbol must be either X or O");
  }

  this.score = 0;
  name = name;
  symbol = symbol;

  // addScore method
  const addScore = function () {
    this.score++;
  };

  // getScore method
  const getScore = function () {
    return this.score;
  };

  return { name, symbol, score, addScore, getScore };
};

function createAIPlayer(name, symbol) {
  const player = createPlayer(name, symbol);

  // set to AI
  const setAI = function () {
    name = "AI";
  };

  const AImakeMove = function () {
    // get random row and column
    const row = Math.floor(Math.random() * 3);
    const col = Math.floor(Math.random() * 3);
    return [row, col];
  };

  return { ...player, setAI, AImakeMove };
}

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
  let playerHuman = null;
  let playerAi = null;
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

  const getCurrentPlayer = function () {
    return currentPlayer;
  };

  // initialize game
  const init = function () {
    player1 = createPlayer("Player 1", "X");
    playerHuman = createPlayer("Player 2", "O");
    playerAi = createAIPlayer("AI", "O");

    // init with 2 players
    player2 = playerHuman;

    currentPlayer = player1;
  };

  const setPlayer2 = function (player_num) {
    if (player_num === "one-player") {
      player2 = playerAi;
      setPlayerSymbol(player1.symbol);
    } else {
      player2 = playerHuman;
    }
  };

  const setPlayerSymbol = function (symbol) {
    if (symbol === "X") {
      player1.symbol = "X";
      player2.symbol = "O";
    } else {
      player1.symbol = "O";
      player2.symbol = "X";
    }
  };

  // makeMove method
  const makeMove = function (row, col) {
    if (gameBoard.makeMove(row, col, currentPlayer.symbol)) {
      if (checkWin()) {
        currentPlayer.addScore();
        gameStatus = "win";
        // setGameStatus("win");
        console.log(currentPlayer.name + " won the game! Score: " + currentPlayer.getScore());
        return { game_result: gameStatus, text: `Player ${currentPlayer.name} won the game! \n Score: \n
           ${player1.name}: ${player1.getScore()} to ${player2.name}: ${player2.getScore()}` };
      } else if (checkDraw()) {
        gameStatus = "draw";
        return { game_result: gameStatus, text: "Draw!" };
      } else {
        switchPlayer();
        printBoard();
        return false;
      }
    } else {
      printBoard();
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
    const [row, col] = input.split(",").map((item) => parseInt(item.trim()));
    // make move
    let results = makeMove(row, col);

    // print board
    printBoard();
  };

  return { init, makeMove, reset, printBoard, playRound, setGameStatus, setPlayer2, setPlayerSymbol, getCurrentPlayer };
})();

gameController.init();

const displayController = (function () {
  // private data
  const _winner_banner = document.querySelector(".winner-banner");
  const _draw_banner = document.querySelector(".draw-banner");
  const _overlay = document.querySelector(".overlay");

  // select number of players
  const _num_players = document.querySelectorAll(".num-players");
  for (const radio of _num_players) {
    radio.addEventListener("change", function (e) {
      e.preventDefault();
      console.log(e.target.value);
      gameController.setPlayer2(e.target.value);
    });
  }

  // select player symbol
  const _player_symbol_btn = document.querySelectorAll(".btn-player");
  for (const btn of _player_symbol_btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      console.log(e.target.value);
      gameController.setPlayerSymbol(e.target.innerText);
      // swap .btn-player-selected from X to O or vis versa
      const btn_selected = document.querySelector(".btn-player-selected");
      btn_selected.classList.remove("btn-player-selected");
      e.target.classList.add("btn-player-selected");
    });
  }

  function updateCurrentPlayer() {
    // display current player's turn
    const _current_player = document.querySelector(".current-player");
    _current_player.innerText = gameController.getCurrentPlayer().symbol;

    if (_player_symbol_btn[0].innerHTML === gameController.getCurrentPlayer().symbol) {
      _player_symbol_btn[0].classList.add("btn-current-player");
      _player_symbol_btn[1].classList.remove("btn-current-player");
    } else {
      _player_symbol_btn[1].classList.add("btn-current-player");
      _player_symbol_btn[0].classList.remove("btn-current-player");
    }
  }

  // restart button
  const _btn_restart = document.querySelectorAll(".btn-reset");
  _btn_restart.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
  
      gameController.reset();
      updateCurrentPlayer();
  
      displayBoard();
      
      // remove banner
      _winner_banner.classList.remove("active");
      _draw_banner.classList.remove("active");
      _overlay.classList.remove("active");
  });
  });

  // make move
  const _board = document.querySelectorAll(".field");
  _board.forEach((cell) => {
    cell.addEventListener("click", function (e) {
      e.preventDefault();

      const row = parseInt(e.target.dataset.row);
      const col = parseInt(e.target.dataset.col);

      // make move
      let result = gameController.makeMove(row, col);
      // update board
      displayBoard();

      // if winner or draw, display winner banner
      if (result.game_result === "win") {
        _winner_banner.classList.add("active");
        _winner_banner.childNodes[3].innerText = result.text;
        _overlay.classList.add("active");
        return;
      } else if (result.game_result === "draw") {
        _draw_banner.classList.add("active");
        _overlay.classList.add("active");

        return;
      }
      // update score
      //updateScore();
      updateCurrentPlayer();
    });
  });

  //  Display board
  function displayBoard() {
    const board = gameBoard.getBoard();
    for (let i = 0; i < _board.length; i++) {
      _board[i].innerText = board[Math.floor(i / 3)][i % 3].value || "";
    }
  }

  // Display winner

  updateCurrentPlayer();
  // when user clicks outside of form, close form
  _overlay.addEventListener("click", () => {
    _winner_banner.classList.remove("active");
    _draw_banner.classList.remove("active");
    _overlay.classList.remove("active");
  });
})();

console.log("end of script");

// functionality to display the game

// x1. Select player x or o
// x2. Get number of players and init game 1 v ai or 1 v 1
// x3. Make move
// x4. Display board
// 5. Display winner
// 6. Display draw
// x7. Reset game
// 8. Display score
// x9. Display current player
