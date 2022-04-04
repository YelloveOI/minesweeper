const matrix = getMatrix(10, 10)

for(let i = 0; i < 10; i++) {
    setRandomMine(matrix)
}

setMinesAround(matrix)

const gameField = matrixToHtml(matrix)
const gameElement = document.querySelector('.game')

gameElement.appendChild(gameField)