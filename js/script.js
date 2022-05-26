let size = 10 // default matrix size
let gameMatrix = createMatrix(size)


let matrixElement = matrixToHtml(gameMatrix, 2)
const mainElement = document.querySelector('.main')

mainElement.appendChild(matrixElement)
gameMatrix.update()

const easyLvlElem = document.querySelector('#easy-lvl')
const mediumLvlElem = document.querySelector('#medium-lvl')
const hardLvlElem = document.querySelector('#hard-lvl')
const flagQuantityElem = document.querySelector('.flag-quantity')
const timerDigitsElem = document.querySelector('.timer-digits')
const popupRestartElem = document.querySelector('.popup-restart')
const popupElem = document.querySelector('.popup')
const popupTextElem = document.querySelector('.popup-text')

popupRestartElem.addEventListener('click', () => {
    popupElem.classList.remove('visible')
    popupElem.classList.add('hidden')

    restart.apply(10)
})

flagQuantityElem.innerHTML = calculateBombQuantity(size)

easyLvlElem.addEventListener('click', restart.bind(10))

mediumLvlElem.addEventListener('click', restart.bind(15))

hardLvlElem.addEventListener('click', restart.bind(20))


// function re-render whole matrix depends on
// context *this* parameter
function restart() {
    size = this
    gameMatrix = createMatrix(size)
    flagQuantityElem.innerHTML = calculateBombQuantity(size)

    const gameElement = document.querySelector('.main')

    stopTimer()
    timerDigitsElem.innerHTML = '0'

    gameElement.removeChild(matrixElement)

    if(size == 10) matrixElement = matrixToHtml(gameMatrix, 2)

    if(size == 15) matrixElement = matrixToHtml(gameMatrix, 1)

    if(size == 20) matrixElement = matrixToHtml(gameMatrix, 0)


    gameElement.appendChild(matrixElement)
    gameMatrix.update()
}
