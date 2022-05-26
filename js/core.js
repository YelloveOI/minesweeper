let timer = 0
let timerInterval;

// creates matrix object
function createMatrix (size) {
    const matrix = []

    matrix.isGameover = false
    matrix.size = size
    matrix.closeCellsQuantity = size*size
    matrix.firstTurn = true
    matrix.firstCell = undefined

    matrix.getCell = getCell.bind(matrix)
    matrix.getCellById = getCellById.bind(matrix)
    matrix.print = printMatrix.bind(matrix)
    matrix.openCell = openCell.bind(matrix)
    matrix.cascadeOpen = cascadeOpen.bind(matrix)
    matrix.bombQuantity = calculateBombQuantity(size)
    matrix.flagQuantity = calculateBombQuantity(size)
    matrix.gameOver = gameOver.bind(matrix)
    matrix.prepareMatrix = prepareMatrix.bind(matrix)
    matrix.setMinesAround = setMinesAround.bind(matrix)
    matrix.getRandomFreeCell = getRandomFreeCell.bind(matrix)
    matrix.setRandomMine = setRandomMine.bind(matrix)
    matrix.calculateMinesAround = calculateMinesAround.bind(matrix)
    matrix.markCell = markCell.bind(matrix)
    matrix.update = () => {
        for(let row of matrix) {
            for(let cell of row) {
                updateCellTile(cell)
            }
        }
    }
    matrix.showBombs = showBombs.bind(matrix)

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

function setUpTimer() {
    timer = 0

    timerInterval = setInterval(() => {
        if(timer < 999) {
            timer++
            const timerElem = document.querySelector('.timer-digits')
            timerElem.innerHTML = timer
        }
    }, 1000)
}

function stopTimer() {
    clearInterval(timerInterval)
}

// quantity of bombs is defined by this function
function calculateBombQuantity(size) {
    return Math.floor(size*size/6)
}

// processing of the game ending
function gameOver(isWin) {
    console.log('gameover', isWin)
    this.gameover = true
    this.showBombs()
    stopTimer()

    if(isWin) {
        winSnd.play()
        popupTextElem.innerHTML = 'GREAT. YOU WIN'
    } else {
        looseSnd.play()
        popupTextElem.innerHTML = 'YOU DIED'
    }

    popupElem.classList.remove('hidden')
    popupElem.classList.add('visible')
}

// put flag on this cell
function markCell(cell) {
    if(this.gameover) return

    if(cell.isOpen) return

    if(cell.isFlag) {
        cell.isFlag = false
        this.flagQuantity++
    } else {
        contextSnd.play()
        if(this.flagQuantity <= 0) return

        cell.isFlag = true
        this.flagQuantity--

        if(this.closeCellsQuantity === calculateBombQuantity(size) && this.flagQuantity === 0) {
            this.gameOver(true)
        }
    }

    updateFlagQuantity(this.flagQuantity)
    updateCellTile(cell)
}

// updates flag quantity in DOM
function updateFlagQuantity(flagQuantity) {
    const flagQuantityElem = document.querySelector('.flag-quantity')
    flagQuantityElem.innerHTML = flagQuantity
}

// opens cells which have 0 bombs around + 1 "layer" more
// hard to explain, just try to open cell with 0 bombs around
function cascadeOpen(cell) {
    for(let dx = - 1; dx <= 1; dx++) {
        for(let dy = - 1; dy <= 1; dy++) {

            if(dx === 0 && dy === 0) {
                continue
            }

            let cll = this.getCell(cell.y+dy, cell.x+dx)

            if(cll === undefined || cll.isMine || cll.isOpen) {
                continue
            }

            if(cll.minesAround === 0) {
                this.openCell(cll)
                this.cascadeOpen(cll)
            } else {
                this.openCell(cll)
            }
        }
    }
}

// update cell model + re-render the screen
function openCell(cell) {
    if(this.gameover) return

    if(cell.isOpen || cell.isFlag) return;

    if(cell.isMine) {
        this.gameOver(false)
        return
    }

    cell.isOpen = true
    this.closeCellsQuantity--

    updateCellTile(cell)

    if(this.closeCellsQuantity === calculateBombQuantity(size)) {
        this.gameOver(true)
        return
    }
}

// assistant function, prints matrix in console
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

// shows all bombs on the screen
function showBombs() {
    for(let row of this) {
        for(let cell of row) {
            if(cell.isMine) {
                cell.isFlag = false
                cell.isOpen = true
                updateCellTile(cell)
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

// returns a random cell which is not bomb
function getRandomFreeCell() {
    const freeCells = []
    let index;

    for(let column of this) {
        for(let cell of column) {
            if(!cell.isMine) {
                freeCells.push(cell)
            }
        }
    }

    do {
        index = Math.floor(Math.random() * freeCells.length)
    } while (freeCells[index] === this.firstCell)

    return freeCells[index]
}

function setRandomMine() {
    const cell = this.getRandomFreeCell()
    cell.isMine = true
}

function prepareMatrix() {
    const bombQuantity = calculateBombQuantity(this.size)

    for(let i = 0; i < bombQuantity; i++) {
        this.setRandomMine()
    }

    this.setMinesAround()
}

// calculates quantity of mines around the cell
function calculateMinesAround(x, y) {
    let counter = 0;

    for(let dx = - 1; dx <= 1; dx++) {
        for(let dy = - 1; dy <= 1; dy++) {
            if(!(dx === 0 && dy === 0)) {

                let cell = this.getCell(x+dx, y+dy)
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

// call calculateMinesAround for each cell of the matrix
function setMinesAround() {
    for(let row of this) {
        for(let cell of row) {
            cell.minesAround = this.calculateMinesAround(cell.y, cell.x)
        }
    }
}

// re-renders cell on the screen
function updateCellTile(cell) {
    const cellElement = document.getElementById(cell.id)

    if(!cell.isOpen) {
        if(cell.isFlag) {
            cellElement.src = './tiles/flag.svg'
        } else {
            cellElement.src = './tiles/unexplored.svg'
        }
    } else {
        if(cell.isMine) {
            cellElement.src = './tiles/bomb.svg'
        } else {
            switch(cell.minesAround) {
                case 0: {
                    cellElement.src = './tiles/0.svg'
                    break
                }
                case 1: {
                    cellElement.src = './tiles/1.svg'
                    break
                }
                case 2: {
                    cellElement.src = './tiles/2.svg'
                    break
                }
                case 3: {
                    cellElement.src = './tiles/3.svg'
                    break
                }
                case 4: {
                    cellElement.src = './tiles/4.svg'
                    break
                }
                case 5: {
                    cellElement.src = './tiles/5.svg'
                    break
                }
                case 6: {
                    cellElement.src = './tiles/6.svg'
                    break
                }
                case 7: {
                    cellElement.src = './tiles/7.svg'
                    break
                }
                case 8: {
                    cellElement.src = './tiles/8.svg'
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

function cellToHtml(matrix, cell, size) {
    const cellElement = document.createElement('img')

    cellElement.onclick = () => {
        if(matrix.firstTurn) {
            setUpTimer()
            cell.isOpen = true
            matrix.firstTurn = false
            matrix.firstCell = cell
            matrix.prepareMatrix()
            matrix.closeCellsQuantity--
            updateCellTile(cell)
        }

        if(cell.minesAround === 0) {
            matrix.openCell(cell)
            matrix.cascadeOpen(cell)
        } else {
            matrix.openCell(cell)
        }
        clickSnd.play()
    }

    cellElement.oncontextmenu = (e) => {
        e.preventDefault()
        matrix.markCell(cell)
    }

    switch(size) {
        case 0: {
            cellElement.classList.add('gameCellSmall')
            break
        }
        case 1: {
            cellElement.classList.add('gameCellMedium')
            break
        }
        case 2: {
            cellElement.classList.add('gameCellBig')
        }
    }

    cellElement.setAttribute('id', cell.id)

    return cellElement
}

function matrixToHtml(matrix, size) {
    const gameElement = document.createElement('div')
    gameElement.classList.add('game')

    for(let row of matrix) {
        const rowElement = rowToHtml()

        for(let cell of row) {
            const imgElement = cellToHtml(matrix, cell, size)

            rowElement.appendChild(imgElement)
        }

        gameElement.appendChild(rowElement)
    }

    return gameElement
}

















