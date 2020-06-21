const state = {
    size: 3,
    start: [],
    target: [],
    chessBoard: []
}

function generateChessboard() {
    const size = document.getElementById("size").value;
    if (size < 3 || size > 26) {
        alert("Value out of bounds, aborting");
        return;
    }
    state.size = size;
    const start = document.getElementById("start").value;
    // TODO validate input
    state.start = getNumbersForCharacters(start);
    const target = document.getElementById("target").value;
    // TODO validate input
    state.target = getNumbersForCharacters(target);
    const chessboardDiv = document.getElementById("chessboard");
    chessboardDiv.innerHTML = "";
    chessboardDiv.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    for (var rowNumber = 0; rowNumber < size; rowNumber++) {
        var rowName = String.fromCharCode("A".charCodeAt() + rowNumber);
        for (var colNumber = 0; colNumber < size; colNumber++) {
            var cell = document.createElement("div");
            let name = "";
            if ((colNumber + rowNumber) % 2 !== 0) name = " odd";
            cell.className = "cell" + name;
            cell.innerHTML = rowName + (colNumber + 1);
            chessboardDiv.appendChild(cell);
        }
    }
    const [startRow, startCol] = state.start;
    var startElement = chessboardDiv.childNodes[startRow * size + startCol];
    startElement.className += " start";

    const [targetRow, targetCol] = state.target;
    var targetElement = chessboardDiv.childNodes[targetRow * size + targetCol];
    targetElement.className += " target";
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
    queue.push(new Field(startRow, startCol, 0));
    console.log('start:', state.start, 'target:', state.target);
    while (queue.length !== 0 && queue.length < 100) {
        const field = queue.pop()
        if (field.rowNumber === targetRow && field.colNumber === targetCol) {
            document.getElementById('result').innerHTML = `The path took ${field.hops} hops`;
            alert(`The path took ${field.hops} hops`);
            return field.hops;
        }

        if (visited[field.rowNumber][field.colNumber] === false) {
            visited[field.rowNumber][field.colNumber] = true;
            for (var i = 0; i < 8; i++) {
                var newRow = field.rowNumber + moveRow[i];
                var newCol = field.colNumber + moveCol[i];
                if (isInside(newRow, newCol, state.size)) {
                    if (visited[newRow][newCol] === false) {
                        queue.unshift(new Field(newRow, newCol, field.hops + 1));
                        console.log(`from ${field.rowNumber} ${field.colNumber} enqueued:`, newRow, newCol);
                    }
                }
            }
        }
    }

    return Number.MAX_SAFE_INTEGER;
}

class Field {
    constructor(row, col, hops) {
        this.rowNumber = row;
        this.colNumber = col;
        this.hops = hops;
    }
    rowNumber;
    colNumber;
    hops;
}

function isInside(newRow, newCol, size) {
    return (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size);
}

function getNumbersForCharacters(chars) {
    const row = chars.substring(0, 1).charCodeAt() - "A".charCodeAt();
    const col = chars.substring(1, 2) - 1;
    return [row, col];
}
