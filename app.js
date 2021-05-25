const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let width = 15
let currentShooterIndex = 202
let direction = 1
let invadersID = null
let goingRight = true
let aliensRemoved = []
let results = 0

// Audio
const bgm = document.getElementById('bgm')
bgm.loop = true
bgm.status = true
bgm.volume= 0.75
bgm.play()

const boomSound = document.getElementById('boom_sound')
boomSound.volume = 0.5
boomSound.loop = false

const winSound = document.getElementById('win_sound')
// winSound.volume = 0.5
// winSound.loop = true

const laserSound = document.getElementById('boom_sound')
// laserSound.volume = 0.5
laserSound.loop = false



for (let i =0; i<255; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [0,1,2,3,4,5,6,7,8,9,
                    15,16,17,18,19,20,21,22,23,24,
                    30,31,32,33,34,35,36,37,38,39]

function draw() {
    for(let i =0; i<alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)){

            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}

function remove() {
    for(let i =0; i<alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

draw()

squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch (e.key) {
        case 'ArrowLeft':
            if(currentShooterIndex%width !==0) currentShooterIndex-=1
            break;
            
            case 'ArrowRight':
                if(currentShooterIndex%width <width-1) currentShooterIndex += 1
                
                default:
                    break;
                }
    squares[currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown', moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0]%width === 0
    const rightEdge = alienInvaders[alienInvaders.length -1]%width === width-1
    remove()

    if(rightEdge && goingRight) {
        for(let i =0; i<alienInvaders.length; i++) {
            alienInvaders[i] += width+1
            goingRight = false
        }
        direction = -1
    }

    if(leftEdge && !goingRight) {
        for(let i =0; i<alienInvaders.length; i++) {
            alienInvaders[i] += width-1
            goingRight = true
        }
        direction = 1
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
        
    }

    draw()
    
    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {console.log("GAME OVER!")
    resultsDisplay.innerHTML = 'GAME OVER'
    clearInterval(invadersID)
    bgm.pause()}
    
    for(let i=0; i<alienInvaders.length; i++) {
        if(alienInvaders[i] > squares.length) {
            resultsDisplay.innerHTML = 'GAME OVER'
            clearInterval(invadersID)
            bgm.stop()}
        }
    
    if(aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN'
        clearInterval(invadersID)
        bgm.pause()
        clearInterval(bgm)
        winSound.play()
    }
}

invadersID = setInterval(moveInvaders, 500)

function shoot(e) {
    let laserID
    let currentLaserIndex = currentShooterIndex
    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if(squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')
            boomSound.play()

            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 100)
            clearInterval(laserID)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results

        }
    }
    switch(e.key) {
        case 'ArrowUp':
            laserSound.play()
            laserID = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keyup', shoot)