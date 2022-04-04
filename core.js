function getMatrix (columns, rows) {
    const matrix = []

    for(let i = 0; i < columns; i++) {
        const row = []

        for(let j = 0; j < rows; j++) {
            row.push({
                isFlag: false,
                isMine: false,
                minesAround: 0,
                x: i,
                y: j
            })
        }

        matrix.push(row)
    }

    return matrix
}

//mine-free
function getRandomFreeCell(matrix) {
    const freeCells = []

    for(let column of matrix) {
        for(let cell of column) {
            if(!cell.isMine) {
                freeCells.push(cell)
            }
        }
    }

    const index = Math.floor(Math.random() * freeCells.length)

    return freeCells[index]
}

function setRandomMine(matrix) {
    const cell = getRandomFreeCell(matrix)
    cell.isMine = true
}

function setMinesAround(matrix) {
    for(let column of matrix) {
        for(let cell of column) {
            cell.minesAround = getMinesAround(matrix, cell.x, cell.y)
        }
    }
}

function getMinesAround(matrix, x, y) {
    let counter = 0;
    for(let dx = - 1; dx <= 1; dx++) {
        for(let dy = - 1; dy <= 1; dy++) {
            if(!(dx === 0 && dy === 0)) {
                if(getCell(matrix, x+dx, y+dy).isMine) {
                    counter++
                }
            }
        }
    }

    return counter
}

function getCell(matrix, x, y) {
    if(!matrix[x] || !matrix[x][y]) {
        return false
    }

    return matrix[x][y]
}

function matrixToHtml(matrix) {
    const gameField = document.createElement('div')
    gameField.classList.add('gameView')

    for(let column of matrix) {
        const gameColumn = document.createElement('div')
        gameColumn.classList.add('gameColumn')

        for(let cell of column) {
            const gameCell = document.createElement('div')
            gameCell.classList.add('gameCell')

            gameColumn.appendChild(gameCell)
        }

        gameField.appendChild(gameColumn)
    }

    return gameField
}