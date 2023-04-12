const gameElements = {
    memoryContainer: document.querySelector('#memory-container'),
    memoryTiles: document.querySelector('#tiles-container'),
    memoryMoves: document.querySelector('#moves'),
    memoryTimer: document.querySelector('#timer'),
    memoryStartover: document.querySelector('#startover'),
    memoryWin: document.querySelector('#win')
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {

    const cardImages = [];

    cardImages.push('cards/1.png');
    cardImages.push('cards/2.png');
    cardImages.push('cards/3.png');
    cardImages.push('cards/4.png');
    cardImages.push('cards/5.png');
    cardImages.push('cards/6.png');
    cardImages.push('cards/7.png');
    cardImages.push('cards/8.png');

    const picks = pickRandom(cardImages, 8)

    const items = shuffle([...picks, ...picks])

    const cards = ` 
        <div id="tiles-container">
            ${items.map(item => `
            <div class="tile">
                <div class="front"></div>
                <div class="back"><img src="${item}" /></div>
            </div>
        `).join('')}
        </div>
        `

    const parser = new DOMParser().parseFromString(cards, 'text/html')

    gameElements.memoryTiles.replaceWith(parser.querySelector('#tiles-container'))

}

const startGame = () => {
    state.gameStarted = true
    gameElements.memoryStartover.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        gameElements.memoryMoves.innerText = `${state.totalFlips} kaarten gedraaid`
        gameElements.memoryTimer.innerText = `tijd: ${state.totalTime} seconden`
    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll('.tile:not(.matched)').forEach(tile => {
        tile.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipBackAllCards = () => {
    document.querySelectorAll('.flipped:not(.matched)')
    document.querySelectorAll('.flipped').forEach(tile => {
        tile.classList.remove('flipped')
        tile.classList.remove('matched')
    })

    state.flippedCards = 0
}

const resetGame = () => {
    gameElements.memoryContainer.classList.remove('flipped')
    document.getElementById('stats').style.display = "block"
    gameElements.memoryWin.innerHTML = `
            <div class="win-text"></div>
            `
    state.totalTime = 0
    state.gameStarted = false
    state.totalFlips = 0
    state.loop = null
}

const flipCard = tile => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        tile.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    if (!document.querySelectorAll('.tile:not(.flipped)').length) {
        setTimeout(() => {
            gameElements.memoryContainer.classList.add('flipped')
            gameElements.memoryStartover.classList.remove('disabled')
            document.getElementById('stats').style.display = "none"
            gameElements.memoryWin.innerHTML = `
            <div class="win-text">
                <h2>Yes, gewonnen!</h2>
                in <span class="hightlight">${state.totalFlips/2}</span> beurten<br>
                binnen <span class="hightlight">${state.totalTime}</span> seconden.
            </div>
            `
            clearInterval(state.loop)
        
        }, 1000)
    }
}

const errorLog = document.getElementById('error-log')

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement
        const anyTile = document.querySelector('.tile')

        console.log(anyTile)
        console.log(eventTarget)
        console.log(eventParent)

        if (eventTarget.className.includes('front') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.classList.contains('startover') && !eventTarget.className.includes('disabled') && !anyTile.className.includes('flipped')) {
            startGame()
        } else if (eventTarget.classList.contains('startover')  && !eventTarget.className.includes('disabled') && anyTile.className.includes('flipped')) {
            flipBackAllCards()
            resetGame()
            generateGame()
        } 
    })
}

generateGame()
attachEventListeners()