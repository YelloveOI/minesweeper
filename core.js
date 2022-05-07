function createMatrix (size) {
    const matrix = []

    matrix.firstTurn = true
    matrix.flagsQuantity = size
    matrix.size = size
    matrix.getCell = getCell.bind(matrix)
    matrix.getCellById = getCellById.bind(matrix)
    matrix.print = printMatrix.bind(matrix)
    matrix.open = openCell.bind(matrix)
    matrix.update = () => {
        for(let row of matrix) {
            for(let cell of row) {
                updateCellTile(cell)
            }
        }
    }

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
    const bombQuantity = Math.floor(matrix.size/3*matrix.size/3)
    // const bombQuantity = size

    for(let i = 0; i < bombQuantity; i++) {
        setRandomMine(matrix)
    }

    setMinesAround(matrix)
}

function gameOver(isWin) {
    //TODO
    console.log('GAMEOVER')
}


function markCell(matrix, cell) {
    cell.isFlag = !cell.isFlag;
    matrix.flagsQuantity--;

    if(matrix.flagsQuantity === 0) {
        gameOver(true)
    }

    updateCellTile(cell)
}

function openCell(matrix, cell) {
    if(!cell.isOpen && !cell.isFlag) {
        cell.isOpen = true
        updateCellTile(cell)

        if(cell.isMine) {
            gameOver(false)
        } else {
            for(let dx = - 1; dx <= 1; dx++) {
                for(let dy = - 1; dy <= 1; dy++) {
                    if(!(dx === 0 && dy === 0)) {

                        let cll = matrix.getCell(cell.y+dy, cell.x+dx)

                        if(cll !== undefined && !cll.isMine) {
                            if(cll.minesAround === 0) {
                                openCell(matrix, cll)
                            } else {
                                cll.isOpen = true
                                updateCellTile(cll)
                            }
                        }
                    }
                }
            }
        }
    }
}

function printMatrix() {
    let matrix = ''

    for(let row of this) {
        for(let cell of row) {
            if(cell.isMine) {
                matrix += 'X'
                matrix += ' '
            } else {
                matrix += cell.minesAround
                matrix += ' '
            }
        }

        matrix += '\n'
    }

    console.log(matrix)
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
            if(!cell.isMine && !cell.isOpen) {
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
            cell.minesAround = calculateMinesAround(matrix, cell.y, cell.x)
        }
    }
}



function matrixToHtml(matrix) {
    const gameElement = document.createElement('div')
    gameElement.classList.add('game')

    for(let row of matrix) {
        const rowElement = document.createElement('div')
        rowElement.classList.add('gameRow')

        for(let cell of row) {
            const imgElement = document.createElement('img')

            imgElement.onclick = () => {
                if(matrix.firstTurn) {
                    cell.isOpen = true
                    prepareMatrix(matrix)
                    updateCellTile(cell)
                    matrix.firstTurn = false

                    for(let dx = - 1; dx <= 1; dx++) {
                        for(let dy = - dx; dy <= 1; dy++) {
                            if(!(dx === 0 && dy === 0)) {

                                let cll = matrix.getCell(cell.y+dy, cell.x+dx)

                                if(cll !== undefined && !cll.isMine) {
                                    if(cll.minesAround === 0) {
                                        openCell(matrix, cll)
                                    } else {
                                        cll.isOpen = true
                                        updateCellTile(cll)
                                    }
                                }
                            }
                        }
                    }
                }

                openCell(matrix, cell)
            }

            imgElement.oncontextmenu = (e) => {
                e.preventDefault()
                markCell(matrix, cell)
            }
            imgElement.classList.add('gameCell')
            imgElement.setAttribute('id', cell.id)

            rowElement.appendChild(imgElement)
        }

        gameElement.appendChild(rowElement)
    }

    return gameElement
}

function updateCellTile(cell) {
    const cellElement = document.getElementById(cell.id)

    if(!cell.isOpen) {
        if(cell.isFlag) {
            cellElement.src = 'Minesweeper_LAZARUS_61x61_flag.png'
        } else {
            cellElement.src = 'Minesweeper_LAZARUS_61x61_unexplored.png'
        }
    } else {
        if(cell.isMine) {
            cellElement.src = 'Minesweeper_LAZARUS_61x61_mine.png'
        } else {
            switch(cell.minesAround) {
                case 0: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_0.png'
                    break
                }
                case 1: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_1.png'
                    break
                }
                case 2: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_2.png'
                    break
                }
                case 3: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_3.png'
                    break
                }
                case 4: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_4.png'
                    break
                }
                case 5: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_5.png'
                    break
                }
                case 6: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_6.png'
                    break
                }
                case 7: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_7.png'
                    break
                }
                case 8: {
                    cellElement.src = 'Minesweeper_LAZARUS_61x61_8.png'
                    break
                }
            }


        }
    }
}

















