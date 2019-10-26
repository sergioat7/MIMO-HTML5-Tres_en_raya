//MARK: Global variables
const JUGADOR_X = "X";
const JUGADOR_O = "O";
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
        this.cells = Array(9).fill(EMPTY_CELL);
        var tableDiv = document.getElementById("table_div");
        tableDiv.innerHTML = '';

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

    /* var cells;
    var turn;
    var mode;
    var gameFinished;
    var move; */

    constructor(n) {
        this.turn = JUGADOR_X;
        this.gameFinished = false;
        this.move = 0;
        document.getElementById('main_text').innerHTML = "Iniciar partida";
        this.getModeSelected();
        this.board = new Board(n);
    }

    getModeSelected() {
        var modes = document.getElementsByName('mode');
        for (let i = 0; i < modes.length; i++) {
            if (modes[i].checked) {
                this.mode = modes[i].id;
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
        document.getElementById('main_text').innerHTML = text;
    }

    computersTurn() {
        var taken = false;
        while (taken === false && this.move != 5) {
            var id = this.chooseCell();
            var cell = document.getElementById(id);
            if (cell != null && !cell.hasChildNodes()) {
                taken = true;
                this.board.cells[id] = this.turn
                this.writeCell(this.turn, cell);
            }
        }
    }

    chooseCell() {
        if (this.mode == EASY_MODE) {
            return (Math.random() * 9).toFixed();
        } else {
            var choice = this.tryToWin(JUGADOR_O);
            if (choice != -1) {
                return choice;
            } else {
                if (this.mode == MEDIUM_MODE) {
                    choice = this.tryToWin(JUGADOR_X);
                    if (choice != -1) {
                        return choice;
                    } else {
                        return (Math.random() * 9).toFixed();
                    }
                } else {
                    return this.studyMove();
                }
            }
        }
    }

    writeCell(value, cell) {
        if (value == JUGADOR_X) {
            cell.appendChild(this.getXImage());
            this.turn = JUGADOR_O;
        } else {
            cell.appendChild(this.getOImage());
            this.turn = JUGADOR_X;
        }
        this.checkBoard(this.board.cells, value);
        if (this.gameFinished == false) {
            this.writeInMainText("Turno de " + this.turn);
        }
    }

    tryToWin(value) {
        //Primera fila
        if (this.board.cells[0] == value && this.board.cells[1] == value && this.board.cells[2] == '') {
            return 2;
        } else if (this.board.cells[0] == value && this.board.cells[2] == value && this.board.cells[1] == '') {
            return 1;
        } else if (this.board.cells[1] == value && this.board.cells[2] == value && this.board.cells[0] == '') {
            return 0;
        }
        //Segunda fila
        else if (this.board.cells[3] == value && this.board.cells[4] == value && this.board.cells[5] == '') {
            return 5;
        } else if (this.board.cells[3] == value && this.board.cells[5] == value && this.board.cells[4] == '') {
            return 4;
        } else if (this.board.cells[4] == value && this.board.cells[5] == value && this.board.cells[3] == '') {
            return 3;
        }
        //Tercera fila
        else if (this.board.cells[6] == value && this.board.cells[7] == value && this.board.cells[8] == '') {
            return 8;
        } else if (this.board.cells[6] == value && this.board.cells[8] == value && this.board.cells[7] == '') {
            return 7;
        } else if (this.board.cells[7] == value && this.board.cells[8] == value && this.board.cells[6] == '') {
            return 6;
        }
        //Primera columna
        else if (this.board.cells[0] == value && this.board.cells[3] == value && this.board.cells[6] == '') {
            return 6;
        } else if (this.board.cells[0] == value && this.board.cells[6] == value && this.board.cells[3] == '') {
            return 3;
        } else if (this.board.cells[3] == value && this.board.cells[6] == value && this.board.cells[0] == '') {
            return 0;
        }
        //Segunda columna
        else if (this.board.cells[1] == value && this.board.cells[4] == value && this.board.cells[7] == '') {
            return 7;
        } else if (this.board.cells[1] == value && this.board.cells[7] == value && this.board.cells[4] == '') {
            return 4;
        } else if (this.board.cells[4] == value && this.board.cells[7] == value && this.board.cells[1] == '') {
            return 1;
        }
        //Tercera columna
        else if (this.board.cells[2] == value && this.board.cells[5] == value && this.board.cells[8] == '') {
            return 8;
        } else if (this.board.cells[2] == value && this.board.cells[8] == value && this.board.cells[5] == '') {
            return 5;
        } else if (this.board.cells[5] == value && this.board.cells[8] == value && this.board.cells[2] == '') {
            return 2;
        }
        //Primera diagonal
        else if (this.board.cells[0] == value && this.board.cells[4] == value && this.board.cells[8] == '') {
            return 8;
        } else if (this.board.cells[0] == value && this.board.cells[8] == value && this.board.cells[4] == '') {
            return 4;
        } else if (this.board.cells[4] == value && this.board.cells[8] == value && this.board.cells[0] == '') {
            return 0;
        }
        //Segunda diagonal
        else if (this.board.cells[2] == value && this.board.cells[4] == value && this.board.cells[6] == '') {
            return 6;
        } else if (this.board.cells[2] == value && this.board.cells[6] == value && this.board.cells[4] == '') {
            return 4;
        } else if (this.board.cells[4] == value && this.board.cells[6] == value && this.board.cells[2] == '') {
            return 2;
        }
        //Otro
        else {
            return -1;
        }
    }

    checkBoard(cells, currentTurn) {
        if (this.checkCombination(cells, 0, 1, 2, currentTurn)) {
            this.setCellClassName(0, 1, 2)
        } else if (this.checkCombination(cells, 3, 4, 5, currentTurn)) {
            this.setCellClassName(3, 4, 5);
        } else if (this.checkCombination(cells, 6, 7, 8, currentTurn)) {
            this.setCellClassName(6, 7, 8);
        } else if (this.checkCombination(cells, 0, 3, 6, currentTurn)) {
            this.setCellClassName(0, 3, 6);
        } else if (this.checkCombination(cells, 1, 4, 7, currentTurn)) {
            this.setCellClassName(1, 4, 7);
        } else if (this.checkCombination(cells, 2, 5, 8, currentTurn)) {
            this.setCellClassName(2, 5, 8);
        } else if (this.checkCombination(cells, 0, 4, 8, currentTurn)) {
            this.setCellClassName(0, 4, 8);
        } else if (this.checkCombination(cells, 2, 4, 6, currentTurn)) {
            this.setCellClassName(2, 4, 6);
        } else if (!(cells.includes(EMPTY_CELL))) {
            this.writeInMainText("Empate");
            var cells = document.querySelectorAll("td");
            for (let i = 0; i < cells.length; i++) {
                cells[i].className = "normalCell disable";
            }
            this.gameFinished = true;
        } else {
            this.gameFinished = false;
        }
    }

    checkCombination(cells, x, y, z, value) {
        if (cells[x] == value && cells[y] == value && cells[z] == value) {
            this.gameFinished = true;
            return true;
        }
    }

    setCellClassName(x, y, z) {
        this.writeInMainText("Victoria de " + this.board.cells[x]);
        var cells = document.querySelectorAll("td");
        for (let i = 0; i < cells.length; i++) {
            cells[i].className = "normalCell disable";
        }
        document.getElementById(x).className = "winCell";
        document.getElementById(y).className = "winCell";
        document.getElementById(z).className = "winCell";
    }

    studyMove() {
        //Si podemos, evitamos la victoria del jugador
        var choice = this.tryToWin(JUGADOR_X);
        if (choice != -1) {
            return choice;
        } else {
            switch (this.move) {
                //Primer turno
                case 1:
                    if (this.board.cells[0] == JUGADOR_X || this.board.cells[2] == JUGADOR_X || this.board.cells[6] == JUGADOR_X || this.board.cells[8] == JUGADOR_X) {
                        return 4;
                    } else if (this.board.cells[4] == JUGADOR_X) {
                        return 0;
                    } else if (this.board.cells[1] == JUGADOR_X) {
                        return 2;
                    } else if (this.board.cells[3] == JUGADOR_X) {
                        return 6;
                    } else {
                        return 8;
                    }
                    //Segundo turno: solo debemos comprobar las opciones que no se hayan descartado anteriormente con la función tryToWin
                    case 2:
                        if (this.board.cells[0] == JUGADOR_X && this.board.cells[4] == JUGADOR_O) {
                            if (this.board.cells[5] == JUGADOR_X) {
                                return 1;
                            } else {
                                return 5;
                            }
                        } else if (this.board.cells[1] == JUGADOR_X && this.board.cells[2] == JUGADOR_O) {
                            if (this.board.cells[0] == JUGADOR_X || this.board.cells[3] == JUGADOR_X) {
                                return 8;
                            } else if (this.board.cells[5] == JUGADOR_X) {
                                return 4;
                            } else {
                                return 7;
                            }
                        } else if (this.board.cells[2] == JUGADOR_X && this.board.cells[4] == JUGADOR_O) {
                            if (this.board.cells[3] == JUGADOR_X) {
                                return 1;
                            } else {
                                return 3;
                            }
                        } else if (this.board.cells[3] == JUGADOR_X && this.board.cells[6] == JUGADOR_O) {
                            if (this.board.cells[0] == JUGADOR_X || this.board.cells[1] == JUGADOR_X) {
                                return 8;
                            } else if (this.board.cells[8] == JUGADOR_X) {
                                return 5;
                            } else {
                                return 4;
                            }
                        } else if (this.board.cells[4] == JUGADOR_X && this.board.cells[0] == JUGADOR_O) {
                            return 6;
                        } else if (this.board.cells[5] == JUGADOR_X && this.board.cells[8] == JUGADOR_O) {
                            if (this.board.cells[0] == JUGADOR_X || this.board.cells[7] == JUGADOR_X) {
                                return 4;
                            } else if (this.board.cells[6] == JUGADOR_X) {
                                return 3;
                            } else {
                                return 6;
                            }
                        } else if (this.board.cells[6] == JUGADOR_X && this.board.cells[4] == JUGADOR_O) {
                            if (this.board.cells[5] == JUGADOR_X) {
                                return 7;
                            } else {
                                return 3;
                            }
                        } else if (this.board.cells[7] == JUGADOR_X && this.board.cells[8] == JUGADOR_O) {
                            if (this.board.cells[3] == JUGADOR_X || this.board.cells[6] == JUGADOR_X) {
                                return 2;
                            } else if (this.board.cells[2] == JUGADOR_X) {
                                return 1;
                            } else {
                                return 4;
                            }
                        } else if (this.board.cells[8] == JUGADOR_X && this.board.cells[4] == JUGADOR_O) {
                            if (this.board.cells[0] == JUGADOR_X) {
                                return 5;
                            } else if (this.board.cells[1] == JUGADOR_X) {
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
}

function playerTurn() {
    var id = this.id;
    var cell = document.getElementById(id);
    if (game.gameFinished == false && !cell.hasChildNodes()) {
        game.move++;
        game.board.cells[id] = game.turn
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