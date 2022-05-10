function createMatrix (size) {
    const matrix = []

    matrix.gameover = false
    matrix.size = size
    matrix.closeCellsQuantity = size*size
    matrix.firstTurn = true
    matrix.getCell = getCell.bind(matrix)
    matrix.getCellById = getCellById.bind(matrix)
    matrix.print = printMatrix.bind(matrix)
    matrix.open = openCell.bind(matrix)
    matrix.flagsQuantity = calculateBombQuantity(size)
    matrix.update = () => {
        for(let row of matrix) {
            for(let cell of row) {
                updateCellTile(cell)
            }
        }
    }
    matrix.showBombs = () => {
        for(let row of matrix) {
            for(let cell of row) {
                if(cell.isMine) {
                    cell.isFlag = false
                    cell.isOpen = true
                    updateCellTile(cell)
                }
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
    const bombQuantity = calculateBombQuantity(matrix.size)

    for(let i = 0; i < bombQuantity; i++) {
        setRandomMine(matrix)
    }

    setMinesAround(matrix)
}

function calculateBombQuantity(size) {
    return Math.floor(size/3*size/3)
}

function gameOver(matrix, isWin) {
    console.log('gameover', isWin)
    matrix.gameover = true
    matrix.showBombs()
    alert('GAMEOVER', isWin)
}


function markCell(matrix, cell) {
    if(!matrix.gameover) {
        if(!cell.isOpen) {
            if(cell.isFlag) {
                cell.isFlag = false
                matrix.flagsQuantity++
            } else {
                cell.isFlag = true
                matrix.flagsQuantity--

                if(matrix.closeCellsQuantity === calculateBombQuantity(size) && matrix.flagsQuantity === 0) {
                    gameOver(matrix, true)
                }
            }

            updateFlagsQuantity(matrix)
            updateCellTile(cell)
        }
    }
}

function updateFlagsQuantity(matrix) {
    const flagQuantityElem = document.querySelector('.flag-quantity')
    flagQuantityElem.innerHTML = matrix.flagsQuantity
}

function openCell(matrix, cell) {
    if(!matrix.gameover) {
        if(!cell.isOpen && !cell.isFlag) {
            cell.isOpen = true
            matrix.closeCellsQuantity--

            if(matrix.closeCellsQuantity === calculateBombQuantity(size)) {
                gameOver(matrix,true)
            }

            updateCellTile(cell)

            if(cell.isMine) {
                gameOver(matrix,false)
            } else {
                for(let dx = - 1; dx <= 1; dx++) {
                    for(let dy = - 1; dy <= 1; dy++) {
                        if(!(dx === 0 && dy === 0)) {

                            let cll = matrix.getCell(cell.y+dy, cell.x+dx)

                            if(cll !== undefined && !cll.isMine) {
                                if(cll.minesAround === 0) {
                                    openCell(matrix, cll)
                                } else {
                                    if(!cll.isOpen) {
                                        matrix.closeCellsQuantity--
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

function rowToHtml() {
    const rowElement = document.createElement('div')
    rowElement.classList.add('gameRow')

    return rowElement
}

function cellToHtml(matrix, cell) {
    const cellElement = document.createElement('img')

    cellElement.onclick = () => {
        if(matrix.firstTurn) {
            cell.isOpen = true
            matrix.firstTurn = false
            prepareMatrix(matrix)
            matrix.closeCellsQuantity--
            updateCellTile(cell)

            for(let dx = - 1; dx <= 1; dx++) {
                for(let dy = - dx; dy <= 1; dy++) {
                    if(!(dx === 0 && dy === 0)) {

                        let cll = matrix.getCell(cell.y+dy, cell.x+dx)

                        if(cll !== undefined && !cll.isMine) {
                            if(cll.minesAround === 0) {
                                openCell(matrix, cll)
                            } else {
                                cll.isOpen = true
                                matrix.closeCellsQuantity--
                                updateCellTile(cll)
                            }
                        }
                    }
                }
            }
        }

        openCell(matrix, cell)
    }

    cellElement.oncontextmenu = (e) => {
        e.preventDefault()
        markCell(matrix, cell)
    }

    cellElement.classList.add('gameCell')
    cellElement.setAttribute('id', cell.id)

    return cellElement
}

function matrixToHtml(matrix) {
    const gameElement = document.createElement('div')
    gameElement.classList.add('game')

    for(let row of matrix) {
        const rowElement = rowToHtml()

        for(let cell of row) {
            const imgElement = cellToHtml(matrix, cell)

            rowElement.appendChild(imgElement)
        }

        gameElement.appendChild(rowElement)
    }

    return gameElement
}

















