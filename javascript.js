//MARK: Global variables
const X = "X";
const O = "O";
const EMPTY_CELL = "";
const X_IMAGE = "./images/X_symbol.png";
const O_IMAGE = "./images/O_symbol.png";
const IMAGE_SIZE = 50;
const MANUAL_MODE = "manual";
const EASY_MODE = "automatic_easy";
const MEDIUM_MODE = "automatic_medium";

//MARK: Board class
class Board {

    constructor(n) {
        this.dimension = n;
        this.matrix = Array(n).fill(Array(n).fill(EMPTY_CELL));
        this.minimaxOptions = new Map();

        var tableDiv = document.getElementById("table_div");
        tableDiv.innerHTML = EMPTY_CELL;
        var table = document.createElement('table');
        table.className = "table-striped no-bordered";
        table.id = 'board';
        tableDiv.appendChild(table);
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);
        for (var i = 0; i < n; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < n; j++) {
                var td = document.createElement('td');
                td.className = "normalCell";
                td.id = i * n + j;
                td.addEventListener('click', playerTurn);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    isThereEmptyCell() {
        return (this.matrix.map(row => { return row.includes(EMPTY_CELL) })).includes(true);
    }

    writeInMatrix(row, column, value) {
        this.matrix = this.matrix.map((r, i) => {
            if (row == i) {
                return r.map((c, j) => {
                    return column == j ? value : c;
                });
            } else {
                return r;
            }
        });
    }

    getEmptyCells(matrix) {
        var emptyCells = matrix.map((row, i) => {
            return row.map((element, j) => {
                if (element === EMPTY_CELL) {
                    return (i * this.dimension) + j;
                }
            });
        }).map(row => {
            return row.filter(Number.isFinite);
        });
        var emptyIds = emptyCells[0];
        for (var i = 1; i < emptyCells.length; i++) {
            emptyIds = emptyIds.concat(emptyCells[i]);
        }
        return emptyIds;
    }

    checkBoard(matrix, value) {
        var n = this.dimension;
        var col = 0;
        var row = 0;
        var diag = 0;
        var rdiag = 0;

        var cols = [];
        var rows = [];

        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (matrix[i][j] === value) row++;
                if (matrix[j][i] === value) col++;
            }
            if (matrix[i][i] === value) diag++;
            if (matrix[i][n - (i + 1)] === value) rdiag++;
            cols.push(col === n);
            rows.push(row === n);
            col = 0;
            row = 0;
        }

        return rows.includes(true) || cols.includes(true) || diag === n || rdiag === n;
    }

    tryToWin(value) {
        var id = -1;

        //Get available moves
        var emptyIds = this.getEmptyCells(this.matrix);

        //Iterate over available moves
        emptyIds.forEach(element => {

            var row = Math.floor(element / this.dimension);
            var column = Math.floor(element % this.dimension);

            var child = this.matrix.map((r, i) => {
                if (row == i) {
                    return r.map((c, j) => {
                        return column == j ? value : c;
                    });
                } else {
                    return r;
                }
            });

            var victory = this.checkBoard(child, value);
            if (victory) {
                id = element;
            }
        });

        return id;
    }

    minimax(board, maximizing, callback, depth) {

        var dimension = this.dimension;
    
        if (depth == 0) this.minimaxOptions.clear();
        var Xvictory = this.checkBoard(board, X);
        var Ovictory = this.checkBoard(board, O);
        if (Xvictory) {
          return -100 + depth;
        } else if (Ovictory) {
          return 100 - depth;
        } else if (depth === dimension + 1) {
          return 0;
        }
    
        if (maximizing) {
          var best = -100;
    
          //Get available moves
          var emptyIds = this.getEmptyCells(board);
    
          //Iterate over available moves
          emptyIds.forEach(element => {
    
            var row = Math.floor(element / dimension);
            var column = Math.floor(element % dimension);
    
            var child = board.map((r, i) => {
              if (row == i) {
                return r.map((c, j) => {
                  return column == j ? O : c;
                });
              } else {
                return r;
              }
            });
    
            var node_value = this.minimax(child, false, callback, depth + 1);
            best = Math.max(best, node_value);
    
            if (depth === 0) {
              var moves = this.minimaxOptions.has(node_value) ? this.minimaxOptions.get(node_value).toString() + "," + element.toString() : element
              this.minimaxOptions.set(node_value, moves)
            }
    
          });
    
          var result;
          if (depth === 0) {
    
            if (this.minimaxOptions.has(-100)) {
              best = -100;
            } else if (this.minimaxOptions.has(100)) {
              best = 100;
            }
    
            var bestResult = this.minimaxOptions.get(best);
            if (typeof bestResult == "string") {
    
              var bestArray = bestResult.split(",").map(id => parseInt(id));
              if (bestArray.length === Math.pow(dimension, 2) - 1) {
                if (bestArray.includes(0)) {
                  result = 0;
                } else if (bestArray.includes(dimension - 1)) {
                  result = dimension - 1;
                } else if (bestArray.includes((dimension - 1) * dimension)) {
                  result = (dimension - 1) * dimension;
                } else if (bestArray.includes(Math.pow(dimension, 2) - 1)) {
                  result = Math.pow(dimension, 2) - 1;
                } else {
                  var random = this.getRandomNumber(0, bestArray.length - 1);
                  result = bestArray[random];
                }
              } else {
                var random = this.getRandomNumber(0, bestArray.length - 1);
                result = bestArray[random];
              }
              
            } else {
              result = bestResult;
            }
    
            callback(result);
            return result;
          }
          return best;
        }
    
        if (!maximizing) {
          var best = 100;
    
          //Get available moves
          var emptyIds = this.getEmptyCells(board);
    
          //Iterate over available moves
          emptyIds.forEach(element => {
    
            var row = Math.floor(element / dimension);
            var column = Math.floor(element % dimension);
    
            var child = board.map((r, i) => {
              if (row == i) {
                return r.map((c, j) => {
                  return column == j ? X : c;
                });
              } else {
                return r;
              }
            });
    
            var node_value = this.minimax(child, true, callback, depth + 1);
            best = Math.min(best, node_value);
    
            if (depth === 0) {
              var moves = this.minimaxOptions.has(node_value) ? this.minimaxOptions.get(node_value).toString() + "," + element.toString() : element
              this.minimaxOptions.set(node_value, moves)
            }
    
          });
          return best;
        }
      }
}

//MARK: Game class
class Game {

    constructor(n) {
        this.turn = X;
        this.gameFinished = false;
        this.writeInMainText("Iniciar partida");
        this.getModeSelected();
        this.board = new Board(n);
    }

    getModeSelected() {
        var modes = document.getElementsByName('mode');
        for (let mode of modes) {
            if (mode.checked) {
                this.mode = mode.id;
                break;
            }
        }
    }

    getXImage() {
        var image = document.createElement("img");
        image.src = X_IMAGE;
        image.height = IMAGE_SIZE;
        image.width = IMAGE_SIZE;
        return image;
    }

    getOImage() {
        var image = document.createElement("img");
        image.src = O_IMAGE;
        image.height = IMAGE_SIZE;
        image.width = IMAGE_SIZE;
        return image;
    }

    getRandomEmptyCell() {
        var emptyIds = this.board.getEmptyCells(this.board.matrix);
        var number = this.board.getRandomNumber(0, emptyIds.length - 1);
        return emptyIds[number];
    }

    writeInMainText(text) {
        document.getElementById('title').innerHTML = text;
    }

    writeCell(value, cell) {
        if (value == X) {
            cell.appendChild(this.getXImage());
            this.turn = O;
        } else {
            cell.appendChild(this.getOImage());
            this.turn = X;
        }
        this.gameFinished = this.checkMatrix(this.board.matrix, value, Math.floor(cell.id / this.board.dimension), Math.floor(cell.id % this.board.dimension));
        if (this.gameFinished == false) {
            this.writeInMainText("Turno de " + this.turn);
        }
    }

    checkMatrix(matrix, value, x, y) {
        var n = this.board.dimension;
        var col = 0;
        var row = 0;
        var diag = 0;
        var rdiag = 0;

        for (var i = 0; i < n; i++) {
            if (matrix[x][i] === value) row++;
            if (matrix[i][y] === value) col++;
            if (matrix[i][i] === value) diag++;
            if (matrix[i][n - (i + 1)] === value) rdiag++;
        }

        if (row === n) {
            this.setVictoryCells(x * n, 1);
            return true;
        } else if (col === n) {
            this.setVictoryCells(y, n);
            return true;
        } else if (diag === n) {
            this.setVictoryCells(0, n + 1);
            return true;
        } else if (rdiag === n) {
            this.setVictoryCells(n - 1, n - 1);
            return true;
        } else if (!this.board.isThereEmptyCell()) {
            this.writeInMainText("Empate");
            var tds = document.querySelectorAll("td");
            for (let td of tds) {
                td.className = "normalCell disable";
            }
            return true;
        } else {
            return false;
        }
    }

    setVictoryCells(init, sum) {
        this.writeInMainText("Victoria de " + this.board.matrix[Math.floor(init / this.board.dimension)][Math.floor(init % this.board.dimension)]);
        var tds = document.querySelectorAll("td");
        for (let td of tds) {
            td.className = "normalCell disable";
        }
        for (var i = 0; i < this.board.dimension; i++) {
            document.getElementById(init + (i * sum)).className = "winCell";
        }
    }

    computersTurn() {
        var id = this.chooseCell();
        var cell = document.getElementById(id);
        if (cell != null && !cell.hasChildNodes()) {
            this.board.writeInMatrix(Math.floor(id / this.board.dimension), Math.floor(id % this.board.dimension), this.turn);
            this.writeCell(this.turn, cell);
        }
    }

    chooseCell() {
        if (this.mode == EASY_MODE) {
            return this.getRandomEmptyCell();
        } else if (this.mode == MEDIUM_MODE) {
            var choice = this.board.tryToWin(X);
            if (choice != -1) {
                return choice;
            } else {
                return this.getRandomEmptyCell();
            }
        } else {
            return this.board.minimax(this.board.matrix, true, (res) => { }, 0);
        }
    }
}

function playerTurn() {
    var id = this.id;
    var cell = document.getElementById(id);
    if (game.gameFinished == false && !cell.hasChildNodes()) {
        game.board.writeInMatrix(Math.floor(id / game.board.dimension), Math.floor(id % game.board.dimension), game.turn);
        game.writeCell(game.turn, cell);
        if (game.gameFinished == false && game.mode != MANUAL_MODE) {
            game.computersTurn();
        }
    }
}

function resetBoard() {
    game = new Game(3);
}

//MARK: Ejecución
var game = new Game(3);