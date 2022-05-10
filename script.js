let size = 10
let matrix = createMatrix(size)

let matrixElement = matrixToHtml(matrix)
const gameElement = document.querySelector('.game')

gameElement.appendChild(matrixElement)
matrix.update()

const easyLvlElem = document.querySelector('#easy-lvl')
const mediumLvlElem = document.querySelector('#medium-lvl')
const hardLvlElem = document.querySelector('#hard-lvl')
const flagQuantityElem = document.querySelector('.flag-quantity')

flagQuantityElem.innerHTML = calculateBombQuantity(size)

easyLvlElem.addEventListener('click', () => {
    size = 10
    matrix = createMatrix(size)
    flagQuantityElem.innerHTML = calculateBombQuantity(size)

    const gameElement = document.querySelector('.game')

    gameElement.removeChild(matrixElement)
    matrixElement = matrixToHtml(matrix)
    gameElement.appendChild(matrixElement)
    matrix.update()
})

mediumLvlElem.addEventListener('click', () => {
    size = 15
    matrix = createMatrix(size)
    flagQuantityElem.innerHTML = calculateBombQuantity(size)

    const gameElement = document.querySelector('.game')

    gameElement.removeChild(matrixElement)
    matrixElement = matrixToHtml(matrix)
    gameElement.appendChild(matrixElement)
    matrix.update()
})

hardLvlElem.addEventListener('click', () => {
    size = 20
    matrix = createMatrix(size)
    flagQuantityElem.innerHTML = calculateBombQuantity(size)

    const gameElement = document.querySelector('.game')

    gameElement.removeChild(matrixElement)
    matrixElement = matrixToHtml(matrix)
    gameElement.appendChild(matrixElement)
    matrix.update()
})