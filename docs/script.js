const state = {
    size: 3,
    start: [],
    target: [],
    chessBoard: []
}

function generateChessboard() {

    const size = new Number(document.getElementById("size").value);
    if (size < 3 || size > 26) {
        alert("Provided size is incorrect");
        document.getElementById("size").value = 3;
        return;
    }
    state.size = size;

    const start = document.getElementById("start").value;
    if (!/^([A-Z]{1})([0-9]{1,2})$/.test(start)) {
        alert("Provided field is not of correct format");
        document.getElementById("start").value = "A1";
        return;
    }
    state.start = getNumbersForCharacters(start);
    if (state.start[0] >= state.size || state.start[1] >= state.size) {
        alert("Start value is out of bounds, aborting");
        document.getElementById("start").value = "A1";
        return;
    }

    const target = document.getElementById("target").value;
    if (!/^([A-Z]{1})([0-9]{1,2})$/.test(target)) {
        alert("Provided field is not of correct format");
        document.getElementById("target").value = "B2";
        return;
    }
    state.target = getNumbersForCharacters(target);
    if (state.target[0] >= state.size || state.target[1] >= state.size) {
        alert("Target value is out of bounds, aborting");
        document.getElementById("target").value = "B2";
        return;
    }

    const chessboardDiv = document.getElementById("chessboard");
    chessboardDiv.innerHTML = "";
    chessboardDiv.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    for (var rowNumber = 0; rowNumber < size; rowNumber++) {
        for (var colNumber = 0; colNumber < size; colNumber++) {
            var cell = document.createElement("div");
            let name = "";
            if ((colNumber + rowNumber) % 2 !== 0) name = " odd";
            cell.className = "cell" + name;
            cell.innerHTML = getCharactersForNumbers(rowNumber, colNumber);
            chessboardDiv.appendChild(cell);
        }
    }
    const [startRow, startCol] = state.start;
    var startElement = chessboardDiv.childNodes[startRow * size + startCol];
    startElement.className += " start";

    const [targetRow, targetCol] = state.target;
    var targetElement = chessboardDiv.childNodes[targetRow * size + targetCol];
    targetElement.className += " target";

    document.getElementById("result").innerHTML = "";
}

function findShortestPath() {
    // a knight can in principle move in 8 ways - 2 per each quadrant
    // e.g. (0,0) => (2,1), (0,0) => (1,2)
    const moveRow = [-2, -1, 1, 2, -2, -1, 1, 2];
    const moveCol = [-1, -2, -2, -1, 1, 2, 2, 1];
    // row is A1 - A8
    // column is A1 - H1
    const visited = [];
    for (var row = 0; row < state.size; row++) {
        var rowArray = [];
        for (var col = 0; col < state.size; col++) {
            rowArray.push(false);
        }
        visited.push(rowArray);
    }
    const queue = [];
    const [startRow, startCol] = state.start;
    const [targetRow, targetCol] = state.target;
    queue.push(new Field(startRow, startCol, startRow, startCol));
    while (queue.length !== 0) {
        const field = queue.pop();

        if (field.rowNumber === targetRow && field.colNumber === targetCol) {
            visited[field.rowNumber][field.colNumber] = [field.parentRow, field.parentColumn];
            const path = getPath(field, visited);
            const summary = document.createElement('div');
            summary.innerHTML = `The path took ${path.length} hops:`;
            document.getElementById('result').appendChild(summary);
            path.forEach(item => {
                const element = document.createElement('div');
                element.innerHTML = item;
                document.getElementById('result').appendChild(element);
            });
            alert(`The path took ${path.length} hops`);
            state.visited = visited;
            return path.length;
        }

        if (visited[field.rowNumber][field.colNumber] === false) {
            visited[field.rowNumber][field.colNumber] = [field.parentRow, field.parentColumn];
            for (var i = 0; i < 8; i++) {
                var newRow = field.rowNumber + moveRow[i];
                var newCol = field.colNumber + moveCol[i];

                if (newRow >= 0 && newRow < state.size && newCol >= 0 && newCol < state.size) {
                    if (visited[newRow][newCol] === false) {
                        queue.unshift(new Field(newRow, newCol, field.rowNumber, field.colNumber));
                    }
                }
            }
        }
    }
    alert('There is no possible path between two provided fields.');
    return Number.MAX_SAFE_INTEGER;
}

function getPath(field, visited) {
    let path = [];
    let currentRow = field.rowNumber;
    let currentColumn = field.colNumber;
    while (true) {
        const [parentRow, parentColumn] = visited[currentRow][currentColumn];
        if (parentRow === currentRow && parentColumn === currentColumn) {
            break;
        }
        path.unshift(`${getCharactersForNumbers(parentRow, parentColumn)} => ${getCharactersForNumbers(currentRow, currentColumn)}`);
        currentRow = parentRow;
        currentColumn = parentColumn;
    }
    return path;
}

class Field {
    constructor(row, col, parentRow, parentColumn) {
        this.rowNumber = row;
        this.colNumber = col;
        this.parentRow = parentRow;
        this.parentColumn = parentColumn;

    }
    rowNumber;
    colNumber;
    parentRow;
    parentColumn;
}

function getNumbersForCharacters(chars) {
    return [chars.substring(0, 1).charCodeAt() - "A".charCodeAt(), new Number(chars.substring(1)) - 1];
}

function getCharactersForNumbers(row, column) {
    return String.fromCharCode("A".charCodeAt() + row) + (column + 1);
}