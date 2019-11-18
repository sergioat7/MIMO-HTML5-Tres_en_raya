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
}

//MARK: Game class
class Game {

    constructor(n) {
        this.turn = X;
        this.gameFinished = false;
        this.move = 0;
        this.writeInMainText("Iniciar partida");
        this.getModeSelected();
        this.board = new Board(n);
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
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

    writeInMainText(text) {
        document.getElementById('title').innerHTML = text;
    }

    writeInMatrix(row, column, value) {
        this.board.matrix = this.board.matrix.map((r, i) => {
            if (row == i) {
                return r.map((c, j) => {
                    return column == j ? value : c;
                });
            } else {
                return r;
            }
        });
    }

    writeCell(value, cell) {
        if (value == X) {
            cell.appendChild(this.getXImage());
            this.turn = O;
        } else {
            cell.appendChild(this.getOImage());
            this.turn = X;
        }
        this.checkBoard(this.board.matrix, value, cell.id);
        if (this.gameFinished == false) {
            this.writeInMainText("Turno de " + this.turn);
        }
    }

    checkBoard(matrix, currentTurn, position) {
        if (!(matrix.map(row => { return row.includes(EMPTY_CELL) })).includes(true)) {
            this.writeInMainText("Empate");
            var tds = document.querySelectorAll("td");
            for (let td of tds) {
                td.className = "normalCell disable";
            }
            this.gameFinished = true;
        } else {
            this.gameFinished = this.checkMatrix(matrix, currentTurn, Math.floor(position / this.board.dimension), Math.floor(position % this.board.dimension));
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
        var taken = false;
        while (taken === false && this.move != 5) {
            var id = this.chooseCell();
            var cell = document.getElementById(id);
            if (cell != null && !cell.hasChildNodes()) {
                taken = true;
                this.writeInMatrix(Math.floor(id / this.board.dimension), Math.floor(id % this.board.dimension), this.turn);
                this.writeCell(this.turn, cell);
            }
        }
    }

    chooseCell() {
        if (this.mode == EASY_MODE) {
            return this.getRandomNumber(0, (this.board.dimension * this.board.dimension) - 1);
        } else {
            var choice = this.tryToWin(O);
            if (choice != -1) {
                return choice;
            } else {
                choice = this.tryToWin(X);
                if (choice != -1) {
                    return choice;
                } else {
                    return this.mode == MEDIUM_MODE ? this.getRandomNumber(0, (this.board.dimension * this.board.dimension) - 1) : this.studyMove();
                }
            }
        }
    }

    tryToWin(value) {
        //Primera fila
        if (this.board.matrix[0][0] == value && this.board.matrix[0][1] == value && this.board.matrix[0][2] == EMPTY_CELL) {
            return 2;
        } else if (this.board.matrix[0][0] == value && this.board.matrix[0][2] == value && this.board.matrix[0][1] == EMPTY_CELL) {
            return 1;
        } else if (this.board.matrix[0][1] == value && this.board.matrix[0][2] == value && this.board.matrix[0][0] == EMPTY_CELL) {
            return 0;
        }
        //Segunda fila
        else if (this.board.matrix[1][0] == value && this.board.matrix[1][1] == value && this.board.matrix[1][2] == EMPTY_CELL) {
            return 5;
        } else if (this.board.matrix[1][0] == value && this.board.matrix[1][2] == value && this.board.matrix[1][1] == EMPTY_CELL) {
            return 4;
        } else if (this.board.matrix[1][1] == value && this.board.matrix[1][2] == value && this.board.matrix[1][0] == EMPTY_CELL) {
            return 3;
        }
        //Tercera fila
        else if (this.board.matrix[2][0] == value && this.board.matrix[2][1] == value && this.board.matrix[2][2] == EMPTY_CELL) {
            return 8;
        } else if (this.board.matrix[2][0] == value && this.board.matrix[2][2] == value && this.board.matrix[2][1] == EMPTY_CELL) {
            return 7;
        } else if (this.board.matrix[2][1] == value && this.board.matrix[2][2] == value && this.board.matrix[2][0] == EMPTY_CELL) {
            return 6;
        }
        //Primera columna
        else if (this.board.matrix[0][0] == value && this.board.matrix[1][0] == value && this.board.matrix[2][0] == EMPTY_CELL) {
            return 6;
        } else if (this.board.matrix[0][0] == value && this.board.matrix[2][0] == value && this.board.matrix[1][0] == EMPTY_CELL) {
            return 3;
        } else if (this.board.matrix[1][0] == value && this.board.matrix[2][0] == value && this.board.matrix[0][0] == EMPTY_CELL) {
            return 0;
        }
        //Segunda columna
        else if (this.board.matrix[0][1] == value && this.board.matrix[1][1] == value && this.board.matrix[2][1] == EMPTY_CELL) {
            return 7;
        } else if (this.board.matrix[0][1] == value && this.board.matrix[2][1] == value && this.board.matrix[1][1] == EMPTY_CELL) {
            return 4;
        } else if (this.board.matrix[1][1] == value && this.board.matrix[2][1] == value && this.board.matrix[0][1] == EMPTY_CELL) {
            return 1;
        }
        //Tercera columna
        else if (this.board.matrix[0][2] == value && this.board.matrix[1][2] == value && this.board.matrix[2][2] == EMPTY_CELL) {
            return 8;
        } else if (this.board.matrix[0][2] == value && this.board.matrix[2][2] == value && this.board.matrix[1][2] == EMPTY_CELL) {
            return 5;
        } else if (this.board.matrix[1][2] == value && this.board.matrix[2][2] == value && this.board.matrix[0][2] == EMPTY_CELL) {
            return 2;
        }
        //Primera diagonal
        else if (this.board.matrix[0][0] == value && this.board.matrix[1][1] == value && this.board.matrix[2][2] == EMPTY_CELL) {
            return 8;
        } else if (this.board.matrix[0][0] == value && this.board.matrix[2][2] == value && this.board.matrix[1][1] == EMPTY_CELL) {
            return 4;
        } else if (this.board.matrix[1][1] == value && this.board.matrix[2][2] == value && this.board.matrix[0][0] == EMPTY_CELL) {
            return 0;
        }
        //Segunda diagonal
        else if (this.board.matrix[0][2] == value && this.board.matrix[1][1] == value && this.board.matrix[2][0] == EMPTY_CELL) {
            return 6;
        } else if (this.board.matrix[0][2] == value && this.board.matrix[2][0] == value && this.board.matrix[1][1] == EMPTY_CELL) {
            return 4;
        } else if (this.board.matrix[1][1] == value && this.board.matrix[2][0] == value && this.board.matrix[0][2] == EMPTY_CELL) {
            return 2;
        }
        //Otro
        else {
            return -1;
        }
    }

    studyMove() {
        switch (this.move) {
            //Primer turno
            case 1:
                if (this.board.matrix[0][0] == X || this.board.matrix[0][2] == X || this.board.matrix[2][0] == X || this.board.matrix[2][2] == X) {
                    return 4;
                } else if (this.board.matrix[1][1] == X) {
                    return 0;
                } else if (this.board.matrix[0][1] == X) {
                    return 2;
                } else if (this.board.matrix[1][0] == X) {
                    return 6;
                } else {
                    return 8;
                }
            //Segundo turno: solo debemos comprobar las opciones que no se hayan descartado anteriormente con la función tryToWin
            case 2:
                if (this.board.matrix[0][0] == X && this.board.matrix[1][1] == O) {
                    if (this.board.matrix[1][2] == X) {
                        return 1;
                    } else {
                        return 5;
                    }
                } else if (this.board.matrix[0][1] == X && this.board.matrix[0][2] == O) {
                    if (this.board.matrix[0][0] == X || this.board.matrix[1][0] == X) {
                        return 8;
                    } else if (this.board.matrix[1][2] == X) {
                        return 4;
                    } else {
                        return 7;
                    }
                } else if (this.board.matrix[0][2] == X && this.board.matrix[1][1] == O) {
                    if (this.board.matrix[1][0] == X) {
                        return 1;
                    } else {
                        return 3;
                    }
                } else if (this.board.matrix[1][0] == X && this.board.matrix[2][0] == O) {
                    if (this.board.matrix[0][0] == X || this.board.matrix[0][1] == X) {
                        return 8;
                    } else if (this.board.matrix[2][2] == X) {
                        return 5;
                    } else {
                        return 4;
                    }
                } else if (this.board.matrix[1][1] == X && this.board.matrix[0][0] == O) {
                    return 6;
                } else if (this.board.matrix[1][2] == X && this.board.matrix[2][2] == O) {
                    if (this.board.matrix[0][0] == X || this.board.matrix[2][1] == X) {
                        return 4;
                    } else if (this.board.matrix[2][0] == X) {
                        return 3;
                    } else {
                        return 6;
                    }
                } else if (this.board.matrix[2][0] == X && this.board.matrix[1][1] == O) {
                    if (this.board.matrix[1][2] == X) {
                        return 7;
                    } else {
                        return 3;
                    }
                } else if (this.board.matrix[2][1] == X && this.board.matrix[2][2] == O) {
                    if (this.board.matrix[1][0] == X || this.board.matrix[2][0] == X) {
                        return 2;
                    } else if (this.board.matrix[0][2] == X) {
                        return 1;
                    } else {
                        return 4;
                    }
                } else if (this.board.matrix[2][2] == X && this.board.matrix[1][1] == O) {
                    if (this.board.matrix[0][0] == X) {
                        return 5;
                    } else if (this.board.matrix[0][1] == X) {
                        return 0;
                    } else {
                        return 7;
                    }
                } else {
                    return this.getRandomNumber(0, (this.board.dimension * this.board.dimension) - 1);
                }
            default:
                return this.getRandomNumber(0, (this.board.dimension * this.board.dimension) - 1);
        }
    }
}

function playerTurn() {
    var id = this.id;
    var cell = document.getElementById(id);
    if (game.gameFinished == false && !cell.hasChildNodes()) {
        game.move++;
        game.writeInMatrix(Math.floor(id / game.board.dimension), Math.floor(id % game.board.dimension), game.turn);
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