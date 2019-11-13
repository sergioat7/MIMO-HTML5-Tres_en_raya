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
        this.cells = Array(n * n).fill(EMPTY_CELL);
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

    // var cells;
    // var turn;
    // var mode;
    // var gameFinished;
    // var move;

    constructor(n) {
        this.turn = X;
        this.gameFinished = false;
        this.move = 0;
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
        this.checkBoard(this.board.cells, value, cell.id);
        if (this.gameFinished == false) {
            this.writeInMainText("Turno de " + this.turn);
        }
    }

    checkBoard(cells, currentTurn, position) {
        if (!(cells.includes(EMPTY_CELL))) {
            this.writeInMainText("Empate");
            var tds = document.querySelectorAll("td");
            for (let td of tds) {
                td.className = "normalCell disable";
            }
            this.gameFinished = true;
        } else {
            this.gameFinished = this.checkCells(cells, currentTurn, Math.floor(position/this.board.dimension),  Math.floor(position%this.board.dimension));
        }
    }

    checkCells(cells, value, x, y) {
        var n = this.board.dimension;
        var col=0;
        var row=0;
        var diag=0;
        var rdiag=0;

        for (var i=0; i<n; i++) {
            if (cells[(x*n)+i]===value) row++;
            if (cells[(i*n)+y]===value) col++;
            if (cells[(i*n)+i]===value) diag++;
            if (cells[(i*n)+n-(i+1)]===value) rdiag++;
        }

        if (row === n) {
            this.setVictoryCells(x*n,1);
            return true;
        } else if (col === n) {
            this.setVictoryCells(y,n);
            return true;
        } else if (diag === n) {
            this.setVictoryCells(0,n+1);
            return true;
        } else if (rdiag === n) {
            this.setVictoryCells(n-1,n-1);
            return true;
        } else {
            return false;
        }
    }

    setVictoryCells(init, sum) {
        this.writeInMainText("Victoria de " + this.board.cells[init]);
        var tds = document.querySelectorAll("td");
        for (let td of tds) {
            td.className = "normalCell disable";
        }
        for (var i = 0; i < this.board.dimension; i++) {
            document.getElementById(init+(i*sum)).className = "winCell";
        }
    }

    computersTurn() {
        var taken = false;
        while (taken === false && this.move != 5) {
            var id = this.chooseCell();
            var cell = document.getElementById(id);
            if (cell != null && !cell.hasChildNodes()) {
                taken = true;
                this.board.cells[id] = this.turn;
                this.writeCell(this.turn, cell);
            }
        }
    }

    chooseCell() {
        if (this.mode == EASY_MODE) {
            return (Math.random() * 9).toFixed();
        } else {
            var choice = this.tryToWin(O);
            if (choice != -1) {
                return choice;
            } else {
                choice = this.tryToWin(X);
                if (choice != -1) {
                    return choice;
                } else {
                    return this.mode == MEDIUM_MODE ? (Math.random() * 9).toFixed() : this.studyMove();
                }
            }
        }
    }

    tryToWin(value) {
        //Primera fila
        if (this.board.cells[0] == value && this.board.cells[1] == value && this.board.cells[2] == EMPTY_CELL) {
            return 2;
        } else if (this.board.cells[0] == value && this.board.cells[2] == value && this.board.cells[1] == EMPTY_CELL) {
            return 1;
        } else if (this.board.cells[1] == value && this.board.cells[2] == value && this.board.cells[0] == EMPTY_CELL) {
            return 0;
        }
        //Segunda fila
        else if (this.board.cells[3] == value && this.board.cells[4] == value && this.board.cells[5] == EMPTY_CELL) {
            return 5;
        } else if (this.board.cells[3] == value && this.board.cells[5] == value && this.board.cells[4] == EMPTY_CELL) {
            return 4;
        } else if (this.board.cells[4] == value && this.board.cells[5] == value && this.board.cells[3] == EMPTY_CELL) {
            return 3;
        }
        //Tercera fila
        else if (this.board.cells[6] == value && this.board.cells[7] == value && this.board.cells[8] == EMPTY_CELL) {
            return 8;
        } else if (this.board.cells[6] == value && this.board.cells[8] == value && this.board.cells[7] == EMPTY_CELL) {
            return 7;
        } else if (this.board.cells[7] == value && this.board.cells[8] == value && this.board.cells[6] == EMPTY_CELL) {
            return 6;
        }
        //Primera columna
        else if (this.board.cells[0] == value && this.board.cells[3] == value && this.board.cells[6] == EMPTY_CELL) {
            return 6;
        } else if (this.board.cells[0] == value && this.board.cells[6] == value && this.board.cells[3] == EMPTY_CELL) {
            return 3;
        } else if (this.board.cells[3] == value && this.board.cells[6] == value && this.board.cells[0] == EMPTY_CELL) {
            return 0;
        }
        //Segunda columna
        else if (this.board.cells[1] == value && this.board.cells[4] == value && this.board.cells[7] == EMPTY_CELL) {
            return 7;
        } else if (this.board.cells[1] == value && this.board.cells[7] == value && this.board.cells[4] == EMPTY_CELL) {
            return 4;
        } else if (this.board.cells[4] == value && this.board.cells[7] == value && this.board.cells[1] == EMPTY_CELL) {
            return 1;
        }
        //Tercera columna
        else if (this.board.cells[2] == value && this.board.cells[5] == value && this.board.cells[8] == EMPTY_CELL) {
            return 8;
        } else if (this.board.cells[2] == value && this.board.cells[8] == value && this.board.cells[5] == EMPTY_CELL) {
            return 5;
        } else if (this.board.cells[5] == value && this.board.cells[8] == value && this.board.cells[2] == EMPTY_CELL) {
            return 2;
        }
        //Primera diagonal
        else if (this.board.cells[0] == value && this.board.cells[4] == value && this.board.cells[8] == EMPTY_CELL) {
            return 8;
        } else if (this.board.cells[0] == value && this.board.cells[8] == value && this.board.cells[4] == EMPTY_CELL) {
            return 4;
        } else if (this.board.cells[4] == value && this.board.cells[8] == value && this.board.cells[0] == EMPTY_CELL) {
            return 0;
        }
        //Segunda diagonal
        else if (this.board.cells[2] == value && this.board.cells[4] == value && this.board.cells[6] == EMPTY_CELL) {
            return 6;
        } else if (this.board.cells[2] == value && this.board.cells[6] == value && this.board.cells[4] == EMPTY_CELL) {
            return 4;
        } else if (this.board.cells[4] == value && this.board.cells[6] == value && this.board.cells[2] == EMPTY_CELL) {
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
                if (this.board.cells[0] == X || this.board.cells[2] == X || this.board.cells[6] == X || this.board.cells[8] == X) {
                    return 4;
                } else if (this.board.cells[4] == X) {
                    return 0;
                } else if (this.board.cells[1] == X) {
                    return 2;
                } else if (this.board.cells[3] == X) {
                    return 6;
                } else {
                    return 8;
                }
                //Segundo turno: solo debemos comprobar las opciones que no se hayan descartado anteriormente con la función tryToWin
                case 2:
                    if (this.board.cells[0] == X && this.board.cells[4] == O) {
                        if (this.board.cells[5] == X) {
                            return 1;
                        } else {
                            return 5;
                        }
                    } else if (this.board.cells[1] == X && this.board.cells[2] == O) {
                        if (this.board.cells[0] == X || this.board.cells[3] == X) {
                            return 8;
                        } else if (this.board.cells[5] == X) {
                            return 4;
                        } else {
                            return 7;
                        }
                    } else if (this.board.cells[2] == X && this.board.cells[4] == O) {
                        if (this.board.cells[3] == X) {
                            return 1;
                        } else {
                            return 3;
                        }
                    } else if (this.board.cells[3] == X && this.board.cells[6] == O) {
                        if (this.board.cells[0] == X || this.board.cells[1] == X) {
                            return 8;
                        } else if (this.board.cells[8] == X) {
                            return 5;
                        } else {
                            return 4;
                        }
                    } else if (this.board.cells[4] == X && this.board.cells[0] == O) {
                        return 6;
                    } else if (this.board.cells[5] == X && this.board.cells[8] == O) {
                        if (this.board.cells[0] == X || this.board.cells[7] == X) {
                            return 4;
                        } else if (this.board.cells[6] == X) {
                            return 3;
                        } else {
                            return 6;
                        }
                    } else if (this.board.cells[6] == X && this.board.cells[4] == O) {
                        if (this.board.cells[5] == X) {
                            return 7;
                        } else {
                            return 3;
                        }
                    } else if (this.board.cells[7] == X && this.board.cells[8] == O) {
                        if (this.board.cells[3] == X || this.board.cells[6] == X) {
                            return 2;
                        } else if (this.board.cells[2] == X) {
                            return 1;
                        } else {
                            return 4;
                        }
                    } else if (this.board.cells[8] == X && this.board.cells[4] == O) {
                        if (this.board.cells[0] == X) {
                            return 5;
                        } else if (this.board.cells[1] == X) {
                            return 0;
                        } else {
                            return 7;
                        }
                    } else {
                        return (Math.random() * 9).toFixed();
                    }
                    default:
                        return (Math.random() * 9).toFixed();
        }
    }
}

function playerTurn() {
    var id = this.id;
    var cell = document.getElementById(id);
    if (game.gameFinished == false && !cell.hasChildNodes()) {
        game.move++;
        game.board.cells[id] = game.turn;
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