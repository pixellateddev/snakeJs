const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const scoreBoard = document.getElementById('score')
const modal = document.getElementById('modal')


let snake, snakeHead, direction, nextDirection, moveInterval, cells, apple, score, currentInterval;



const controlSnake = e => {
    e.preventDefault()
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down')
                nextDirection = 'up'
            return
        
        case 'ArrowDown': 
            if (direction !== 'up')
                nextDirection = 'down'
            return
            
        case 'ArrowLeft':
            if (direction !== 'right')
                nextDirection = 'left'
            return
            
        case 'ArrowRight':
            if (direction !== 'left')
                nextDirection = 'right'
            return
    }
}

const createGrid  = () => {
    cells = []
    grid.innerHTML = ''
    grid.append(modal)
    for(let i = 0; i < 20; i++) {
        const row = []
        for (let j = 0; j < 20; j++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            row.push(cell)
            grid.appendChild(cell)
        }
        cells.push(row)
    }
}

const isGameOver = () => {
    return (snakeHead.x < 0 && direction === 'left') || (snakeHead.x >= 20 && direction === 'right') ||
            (snakeHead.y < 0 && direction === 'up') || (snakeHead.y >= 20 && direction === 'down') || 
            snake.filter(sn => sn.x === snakeHead.x && sn.y === snakeHead.y).length
}

const gameOver = () => {
    console.log('Game Over')
    document.removeEventListener('keyup', controlSnake)
    clearInterval(moveInterval)
    modal.classList.remove('hidden')
}

const moveSnake = () => {
    cells[snakeHead.y][snakeHead.x].classList.add('snake')

    snake.unshift(snakeHead)
    
    const currentHead = snakeHead

    direction = nextDirection
    
    switch(direction) {
        case 'left':
            snakeHead = {
                x: snakeHead.x - 1,
                y: snakeHead.y
            }
            break;
            
        case 'right':
            snakeHead = {
                x: snakeHead.x + 1,
                y: snakeHead.y
            }
            break;
            
        case 'up':
            snakeHead = {
                x: snakeHead.x,
                y: snakeHead.y - 1
            }
            break;
            
        default:
            snakeHead = {
                x: snakeHead.x,
                y: snakeHead.y + 1
            }
            break;
    }

    if(isGameOver()) {
        gameOver()
        return;
    }

    if(snakeHead.x === apple.x && snakeHead.y === apple.y) {
        cells[apple.y][apple.x].classList.remove('apple')
        getNewApple()
        incScore()
    }
    else {
        const tail = snake.pop()
        cells[tail.y][tail.x].classList.remove('snake')
    }
    cells[currentHead.y][currentHead.x].classList.remove('head')
    cells[snakeHead.y][snakeHead.x].classList.add('head')
}

const getNewApple = () => {
    while (true) {
        let appleX = Math.floor(Math.random() * 20)
        let appleY = Math.floor(Math.random() * 20)
        if(!((snakeHead.y === appleY && snakeHead.x === appleX) || snake.filter(sn => sn.x === appleX && sn.y === appleY).length)) {
            apple = {
                x: appleX,
                y: appleY
            }
            cells[appleY][appleX].classList.add('apple')
            return
        }
    }
}

const incScore = () => {
    score = score + 1
    scoreBoard.textContent = score
    if(score % 3 === 0 ) {
        clearInterval(moveInterval)
        currentInterval -= 12
        moveInterval = setInterval(moveSnake, currentInterval)
    }
}

const startGame = () => {
    startButton.textContent = 'Restart Game'
    modal.classList.add('hidden')
    document.removeEventListener('keyup', controlSnake)
    clearInterval(moveInterval)
    score = 0
    currentInterval = 500
    scoreBoard.textContent = score
    snake = [ { x: 11, y: 10 }, { x: 12, y: 10 } ]
    snakeHead = { x: 10, y: 10 }
    direction = 'left'
    nextDirection = 'left'
    createGrid()
    snake.forEach(p => cells[p.y][p.x].classList.add('snake'))
    cells[snakeHead.y][snakeHead.x].classList.add('head')

    getNewApple();
    moveInterval = setInterval(moveSnake, currentInterval)    
    document.addEventListener('keyup', controlSnake)
}



startButton.addEventListener('click', startGame)