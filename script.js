const size = 10
const matrix = createMatrix(size)

// prepareMatrix(matrix)

const matrixElement = matrixToHtml(matrix)
const gameElement = document.querySelector('.game')

gameElement.appendChild(matrixElement)
matrix.update()