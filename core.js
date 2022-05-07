function createMatrix (size) {
    const matrix = []

    matrix.size = size
    matrix.getCell = getCell.bind(matrix)
    matrix.getCellById = getCellById.bind(matrix)
    matrix.print = printMatrix.bind(matrix)

    let k = 0;

    for(let i = 0; i < size; i++) {
        const row = []

        for(let j = 0; j < size; j++) {
            row.push({
                isFlag: false,
                isMine: false,
                isOpen: false,
                minesAround: 0,
                id: k,
                x: j,
                y: i
            })

            k++
        }

        matrix.push(row)
    }

    return matrix
}

function prepareMatrix(matrix) {
    for(let i = 0; i < matrix.size; i++) {
        setRandomMine(matrix)
    }

    for(let row of matrix) {
        for(let cell of row) {

        }
    }
}

function printMatrix() {
    for(let row of this) {
        for(let cell of row) {
            if(cell.isMine) {
                console.log('X')
            } else {
                console.log('O')
            }
        }
    }
}

function getCell(x, y) {
    if(x >= 0 && x < this.size && y >= 0 && y < this.size) {
        return this[x][y]
    } else {
        return undefined
    }
}

function getCellById(id) {
    const x = Math.floor(id/this.size)
    const y = id%this.size

    return this[x][y]
}

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

function calculateMinesAround(matrix, x, y) {
    let counter = 0;

    for(let dx = - 1; dx <= 1; dx++) {
        for(let dy = - 1; dy <= 1; dy++) {
            if(!(dx === 0 && dy === 0)) {

                let cell = matrix.getCell(x+dx, y+dy)
                if(cell !== undefined) {
                    if(cell.isMine) {
                        counter++
                    }
                }
            }
        }
    }

    return counter
}

function setMinesAround(matrix) {
    for(let row of matrix) {
        for(let cell of row) {
            cell.minesAround = getMinesAround(matrix, cell.x, cell.y)
        }
    }
}

// function matrixToHtml(matrix) {
//     const gameField = document.createElement('div')
//     gameField.classList.add('gameView')
//
//     for(let column of matrix) {
//         const gameColumn = document.createElement('div')
//         gameColumn.classList.add('gameColumn')
//
//         for(let cell of column) {
//             const gameCell = document.createElement('div')
//             gameCell.setAttribute('id', cell.id)
//
//             gameCell.addEventListener('onclick', () => console.log(cell.id))
//
//             gameCell.classList.add('gameCell')
//
//             gameColumn.appendChild(gameCell)
//         }
//
//         gameField.appendChild(gameColumn)
//     }
//
//     return gameField
// }

function matrixToHtml(matrix) {
    const gameElement = document.createElement('div')
    gameElement.classList.add('sapper')

    for(let column of matrix) {
        const columnElement = document.createElement('div')
        columnElement.classList.add('column')

        for(let cell of column) {
            const imgElement = document.createElement('img')

            if(cell.isMine) {
                imgElement.src = 'Minesweeper_LAZARUS_61x61_mine.png'
            } else {
                switch(cell.minesAround) {
                    case 0: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_0.png'
                        break
                    }
                    case 1: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_1.png'
                        break
                    }
                    case 2: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_2.png'
                        break
                    }
                    case 3: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_3.png'
                        break
                    }
                    case 4: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_4.png'
                        break
                    }
                    case 5: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_5.png'
                        break
                    }
                    case 6: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_6.png'
                        break
                    }
                    case 7: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_7.png'
                        break
                    }
                    case 8: {
                        imgElement.src = 'Minesweeper_LAZARUS_61x61_8.png'
                        break
                    }
                }
            }

            // if(!cell.isOpen) {
            //     imgElement.src = 'Minesweeper_LAZARUS_61x61_unexplored.png'
            // } else {
            //
            // }

            columnElement.appendChild(imgElement)
        }

        gameElement.appendChild(columnElement)
    }

    return gameElement
}




















