//MARK: Global variables
var cells;
var turn;
var mode;
var gameFinished;
var move;

//MARK: Functions
function getModeSelected() {
    var modes = document.getElementsByName('mode');
    for (i = 0; i < modes.length; i++) {
        if (modes[i].checked) {
            mode = modes[i].id;
            break;
        }
    }
}

function playerTurn() {
    var id = this.id;
    var cell = document.getElementById(id);
    if (gameFinished == false && cell.innerHTML == "") {
        move++;
        cells[id] = turn
        writeCell(turn, cell);
        if (gameFinished == false && mode != 'manual') {
            computersTurn();
        }
    }
}

function computersTurn() {
    var taken = false;
    while (taken === false && move != 5) {
        var id = (Math.random() * 9).toFixed();
        var cell = document.getElementById(id);
        if (cell != null && cell.innerHTML == "") {
            taken = true;
            cells[id] = turn
            writeCell(turn, cell);
        }
    }
}

function writeCell(value, cell) {
    cell.innerHTML = value
    if (value == 'X') {
        turn = 'O';
    } else {
        turn = 'X';
    }
    checkBoard(cells, value);
    if (gameFinished == false) {
        document.getElementById('main_text').innerHTML = "Turno de " + turn;
    }
}

function checkBoard(cells, currentTurn) {
    if (checkCombination(0, 1, 2, currentTurn)) {
        setCellClassName(0, 1, 2)
    } else if (checkCombination(3, 4, 5, currentTurn)) {
        setCellClassName(3, 4, 5);
    } else if (checkCombination(6, 7, 8, currentTurn)) {
        setCellClassName(6, 7, 8);
    } else if (checkCombination(0, 3, 6, currentTurn)) {
        setCellClassName(0, 3, 6);
    } else if (checkCombination(1, 4, 7, currentTurn)) {
        setCellClassName(1, 4, 7);
    } else if (checkCombination(2, 5, 8, currentTurn)) {
        setCellClassName(2, 5, 8);
    } else if (checkCombination(0, 4, 8, currentTurn)) {
        setCellClassName(0, 4, 8);
    } else if (checkCombination(2, 4, 6, currentTurn)) {
        setCellClassName(2, 4, 6);
    } else if (!(cells.includes(""))) {
        document.getElementById('main_text').innerHTML = "Empate";
        gameFinished = true;
    } else {
        gameFinished = false;
    }
}

function checkCombination(x, y, z, value) {
    if (cells[x] == value && cells[y] == value && cells[z] == value) {
        gameFinished = true;
        return true;
    }
}

function setCellClassName(x, y, z) {
    document.getElementById('main_text').innerHTML = "Victoria de " + cells[x];
    document.getElementById(x).className = 'winCell';
    document.getElementById(y).className = 'winCell';
    document.getElementById(z).className = 'winCell';
}

function createBoard() {
    cells = ["", "", "", "", "", "", "", "", ""];
    turn = 'X';
    getModeSelected();
    gameFinished = false;
    move = 0;
    document.getElementById('main_text').innerHTML = "Iniciar partida";

    var tableDiv = document.getElementById("table_div");
    tableDiv.innerHTML = '';

    var table = document.createElement('table');
    table.border = '1';
    table.id = 'board';
    tableDiv.appendChild(table);

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    for (var i = 0; i < 3; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 3; j++) {
            var td = document.createElement('td');
            td.id = i * 3 + j;
            td.innerHTML = "";
            td.addEventListener('click', playerTurn);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

//MARK: Ejecución
createBoard();