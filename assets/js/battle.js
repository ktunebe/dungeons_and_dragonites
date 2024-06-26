/* ------------ SET DOM VARIABLES --------------------------------------------- */
// Top Header
const battleCountEl = document.getElementById('battleCountEl')
// Main Battle Screen
const mainContainer = document.getElementById('mainContainer')
// Buttons
const attackBtn = document.getElementById('attackBtn')
const healBtn = document.getElementById('healBtn')
const increaseAttackBtn = document.getElementById('increaseAttackBtn')
const increaseHpBtn = document.getElementById('increaseHpBtn')
const nextBattleButton = document.getElementById('nextBattleButton')
const continueAttackBtn = document.getElementById('continueAttack')
const fetchBtn = document.getElementById('fetchBtn')
const muteToggle = document.getElementById('muteToggle')
const quitToMainBtn = document.getElementById('quitBtn')
const playAgainBtn = document.getElementById('playAgainBtn')
const nowPlayingP = document.getElementById('now-playing')
// Dice Images
const rollTotalSpan = document.getElementById('rollTotal')
const diceRollingImage = document.getElementById('diceRollingImage')
const diceStillImage = document.getElementById('diceStillImage')
// Character Images
const pokemonImage = document.getElementById('pokemonImage')
const monsterImage = document.getElementById('monsterImage')
// Character Cards
const pokemonNameHeader = document.getElementById('pokemonNameHeader')
const pokemonCurrentHpSpan = document.getElementById('pokemonCurrentHp')
const pokemonTotalHpSpan = document.getElementById('pokemonTotalHp')
const pokemonHpBar = document.getElementById('pokemonHpBar')
const pokemonAttackHeader = document.getElementById('pokemonAttackHeader')
const monsterNameHeader = document.getElementById('monsterNameHeader')
const monsterCurrentHpSpan = document.getElementById('monsterCurrentHp')
const monsterTotalHpSpan = document.getElementById('monsterTotalHp')
const monsterHpBar = document.getElementById('monsterHpBar')
const monsterAttackHeader = document.getElementById('monsterAttackHeader')
// Roll Results
const rollTypeEl = document.getElementById('rollTypeEl')
const rollTotalEl = document.getElementById('rollTotalEl')
const damageModEl = document.getElementById('damageModEl')
const rollDamageEl = document.getElementById('rollDamageEl')
// Modals
const improvePokemonModal = document.getElementById('improvePokemonModal')
const improvementResultsModal = document.getElementById('improvementResultsModal')
const improvementResultsHeader = document.getElementById('improvementResultsHeader')
const damageModIncreaseHeader = document.getElementById('damageModIncreaseHeader')
const highScoreModal = document.getElementById('highScoreModal')
const lowScoreModal = document.getElementById('lowScoreModal')
const rollModal = document.getElementById('rollModal')
const highScoreForm = document.getElementById('highScoreForm')
const initialsInputs = document.querySelectorAll('.initials-input');
/* ---------------------------------------------------------------------------- */

/* ------------ OBJECTS, ARRAYS, VARIABLES ------------------------------------ */
// Total score
let score = 0
//Gets local high scores if any exist
let highScores = JSON.parse(localStorage.getItem('highScores')) || []
//Sets player turn
let isPlayerTurn = true
//Global objects to be populated by parseMonsterData/parsePokemonData
let pokemonData = {}
let monsterData = {}
let monsterDice = {}
// Background dungeon image array
const bgArray = [
    'assets/images/dungeon-bg-1.png',
    'assets/images/dungeon-bg-2.png',
    'assets/images/dungeon-bg-3.png',
    'assets/images/dungeon-bg-4.png',
    'assets/images/dungeon-bg-5.png',
    'assets/images/dungeon-bg-6.png'
]
// Attack Damage Increase Array
const attackIncreaseArray = [5, 5, 5, 10, 10]
// Heal Amount Array
const healArray = [20, 20, 20, 50, 50, 50, 50, 50, 200, 200]
// Max HP Increase Array
const maxHpIncreaseArray = [5, 10, 10, 10, 20]
// Function to pull random index from array
function getRandom(array) {
    const index = array[Math.floor(Math.random() * array.length)]
    return index
}
/* ---------------------------------------------------------------------------- */

/* ------------ GLOBAL SOUND VARIABLES ---------------------------------------- */
// Mute Statuses
let muted = JSON.parse(localStorage.getItem('muted')) || false
let canUnmute = false
// Background Music
const bgMusic1 = new Audio('assets/sounds/Through-the-Door.mp3')
const bgMusic2 = new Audio('assets/sounds/Bold-Kobolds.mp3')
const bgMusic3 = new Audio('assets/sounds/Down-Down-Again.mp3')
const bgMusic4 = new Audio('assets/sounds/Alone-in-the-Dark.mp3')
const bgMusic5 = new Audio('assets/sounds/Mare-Trogloditum.mp3')
const bgMusic6 = new Audio('assets/sounds/The-Legend-of-Nodwic-O-Bodwick.mp3')
const bgMusicArray = [bgMusic1, bgMusic2, bgMusic3, bgMusic4, bgMusic5, bgMusic6]
// Attack Sounds
const attackSound1 = new Audio('assets/sounds/8-bit-explosion-95847.mp3')
const attackSound2 = new Audio('assets/sounds/kick-hard-8-bit-103746.mp3')
const attackSound3 = new Audio('assets/sounds/punch-41105.mp3')
const attackSoundArray = [attackSound1, attackSound2, attackSound3]
/* ---------------------------------------------------------------------------- */

/* ------------ SOUND FUNCTIONS ----------------------------------------------- */
function setMuteToggle() {
    if (muted) {
        muteToggle.textContent = '🔇'
    } else {
        muteToggle.textContent = '🔊'
    }
}
//Displays current playing song to the HTML page
function nowPlaying(track) {
    let trackSplit = track.split('/',).pop()
    trackNoFile = trackSplit.split('.')[0]
    finaltrack = trackNoFile.replaceAll('-',' ')
    nowPlayingP.innerHTML =  `Now Playing: 
     ${finaltrack} <br>
      By: Fenmos`
}

function playBgMusic() {
    const track = bgMusicArray[Math.floor(Math.random() * bgMusicArray.length)]
    nowPlaying(track.src)
    if (!muted) {
        track.volume = 0.1
        track.play()
        track.addEventListener('ended', playBgMusic)
    }
}

function toggleBgMusic() {
    const track = bgMusicArray.find(track => !track.paused)
    if (!track && muted && canUnmute) {
        muted = false
        playBgMusic()
        setMuteToggle()
    } else if (!track && muted) {
        muted = false
        setMuteToggle()
    } else if (!track && !muted) {
        muted = true
        setMuteToggle()
    } else if (track && !muted) {
        track.muted = true
        muted = true
        setMuteToggle()
    } else if (track && muted) {
        track.muted = false
        muted = false
        setMuteToggle()
    }
    localStorage.setItem('muted', JSON.stringify(muted))
}

function playAttackSound() {
    const sound = attackSoundArray[Math.floor(Math.random() * attackSoundArray.length)]
    if (!muted) {
        sound.play()
        sound.volume = 0.6
    }    
}

function playPokemonCry() {
    if (!muted) {
        pokemonData.pokemonAudio.play()
        pokemonData.pokemonAudio.volume = 0.3
    }
}
/* ---------------------------------------------------------------------------- */

/* ------------ MODAL POP-UPS ------------------------------------------------- */
// Improve Pokemon Modal
function showImproveModal() {
    improvePokemonModal.showModal()
    function stopEscape(e) {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
        }
    }
    document.addEventListener('keydown', stopEscape)
}
// Improvement Results Modal
function showimprovementResultsModal() {
    improvementResultsModal.showModal()
    function stopEscape(e) {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
        }
    }
    document.addEventListener('keydown', stopEscape)
}
// High Score Entry Modal
function showHighScoreModal() {
    highScoreModal.showModal()
    function stopEscape(e) {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
        }
    }
    document.addEventListener('keydown', stopEscape)
}
// Jump to next input when a character is entered, jump to previous input when backspaced (USED CHAT GPT)
function handleInitialsInput() {
    initialsInputs.forEach((input, index) => {
        // Focus to next input when character is entered
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < initialsInputs.length - 1) {
                    initialsInputs[index + 1].focus();
                }
            }
        });
        // Focus to previous input when backspace to 0 characters
        input.addEventListener('keyup', function(event) {    
            if (event.key === 'Backspace' && this.value.length === 0) {        
                if (index > 0) {            
                    initialsInputs[index - 1].focus();
                }
            }
        });
    });
}

// Game Over with no High Score Modal
function showLowScoreModal() {
    lowScoreModal.showModal()
    function stopEscape(e) {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
        }
    }
    document.addEventListener('keydown', stopEscape)
}
// Roll Summary Modal
function showrollModal() {
    rollModal.showModal()
    function stopEscape(e) {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
        }
    }
    document.addEventListener('keydown', stopEscape)
}
/* ---------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR COMBAT ------------------------------------------ */
// Pokemon attack
function playerTurn(){
    const thisRoll = rollDice(20)
    const attackDamage = thisRoll * pokemonData.damageModifier
    resultsReset()
    rollRender(thisRoll)
    setTimeout(function() {
        pokemonHits()
        resultsRender('1d20', thisRoll, pokemonData.damageModifier, attackDamage)
        setMonsterCard()
    }, 1500)
    monsterData.currentHp -= attackDamage
    isPlayerTurn = false
    setTimeout(showrollModal, 3000)
}
// Monster attack
function monsterTurn(){
    const thisRoll = damageRoll(monsterDice.numberOfRolls, monsterDice.diceMax, monsterDice.additionalDamage)
    const thisRollNoMod = thisRoll - monsterDice.additionalDamage
    const attackDamage = thisRoll
    resultsReset()
    rollRender(thisRollNoMod)
    setTimeout(function() {
        monsterHits()
        resultsRender(monsterData.damageDice, (thisRoll - monsterDice.additionalDamage), monsterDice.additionalDamage, attackDamage)
        setPokemonCard()
    }, 1500)
    pokemonData.currentHp -= attackDamage
    isPlayerTurn = true
    setTimeout(showrollModal, 3000)
}
// Victory
function victory() {
    score++
    showImproveModal()
    attackBtn.classList.add('hidden')
}
// Defeat
function defeat() {
    checkHighScores()
}
// Take health potion
function healthPotion() {
    const prevCurrentHp = pokemonData.currentHp
    const healAmount = getRandom(healArray) 
    pokemonData.currentHp += healAmount
    if (pokemonData.currentHp > pokemonData.hp) {
        pokemonData.currentHp = pokemonData.hp
    }
    improvementResultsHeader.innerHTML = `Current HP: ${prevCurrentHp} &rarr; ${pokemonData.currentHp}`
    showimprovementResultsModal()
}
// Increase pokemon attack
function increaseAttack() {
    const attackIncrease = getRandom(attackIncreaseArray)
    pokemonData.baseAttack += attackIncrease
    pokemonData.damageModifier = Math.round(pokemonData.baseAttack / 20)
    const prevBaseAttack = pokemonData.baseAttack - attackIncrease
    improvementResultsHeader.innerHTML = `Base Attack: ${pokemonData.baseAttack - attackIncrease} &rarr; ${pokemonData.baseAttack}`
    if (Math.round(prevBaseAttack / 20) !== pokemonData.damageModifier) {
        damageModIncreaseHeader.innerHTML = `Damage Modifier: ${pokemonData.damageModifier - 1} &rarr; ${pokemonData.damageModifier}`
    }
    showimprovementResultsModal()
}
// Increase max HP
function increaseHp() {
    const prevHp = pokemonData.hp
    hpIncrease = getRandom(maxHpIncreaseArray)
    pokemonData.hp += hpIncrease
    pokemonData.currentHp += hpIncrease
    improvementResultsHeader.innerHTML = `Max HP: ${prevHp} &rarr; ${pokemonData.hp}`
    showimprovementResultsModal()
}
// Start next battle
function nextBattle() {
    damageModIncreaseHeader.innerHTML = ''
    setPokemonCard()
    displayBattleCount()
    getRandomMonster()
}
/* ---------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR DICE ROLLS -------------------------------------- */
//Split monster damageDice string
function splitDamageDice() {
    const damageDice = monsterData.damageDice
    const numberOfRolls = parseInt(damageDice.split('d')[0])
    const damageDice2 = damageDice.split('d')[1]
    const diceMax = parseInt(damageDice2.split('+')[0])
    const additionalDamage = parseInt(damageDice2.split('+')[1])
    monsterDice.numberOfRolls = numberOfRolls
    monsterDice.diceMax = diceMax
    monsterDice.additionalDamage = additionalDamage
}
// One roll of a specified numbered die
function rollDice(number) {
    let result = Math.ceil(Math.random() * number)
    return result
}
// Multiple rolls of the same numbered die
function damageRoll(numberofRolls, diceMax, additionalDamage) {
    let result = 0;
    for (let i = 0; i < numberofRolls; i++) {
        result += rollDice(diceMax)
    }
    result += additionalDamage
    return result
}
/* ---------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR BATTLE ANIMATIONS ------------------------------- */

// Toggle whether pokemon image is visible so it can flash in and out
function togglePokemonVisibility() {
    pokemonImage.classList.toggle('invisible');
};
// Toggle whether monster image is visible so it can flash in and out
function toggleMonsterVisibility() {
    monsterImage.classList.toggle('invisible');
};
// Pokemon hits monster
function pokemonHits() {
    pokemonImage.classList.add('translate-y-[25%]')
    
    setTimeout(function() {
        if (monsterData.currentHp <= 0) {
            monsterImage.classList.add('origin-bottom','rotate-90', '-translate-x-[25%]', '-translate-y-[25%]')
            playPokemonCry()
        }
    }, 50)
    setTimeout(function() {
        pokemonImage.classList.remove('translate-y-[25%]')
        pokemonImage.classList.add('translate-x-[100%]')
        playAttackSound()
        toggleMonsterVisibility()
    }, 150)
    setTimeout(function() {
        pokemonImage.classList.remove('translate-x-[100%]')
    }, 200)
    setTimeout(toggleMonsterVisibility, 400)
    setTimeout(toggleMonsterVisibility, 600)
    setTimeout(toggleMonsterVisibility, 800)
}
// Monster hits pokemon
function monsterHits() {
    monsterImage.classList.add('translate-y-[25%]')
    
    setTimeout(function() {
        if (pokemonData.currentHp <= 0) {
            pokemonImage.classList.add('origin-bottom','rotate-90', '-translate-x-[25%]', '-translate-y-[25%]')
        }
    }, 50)
    setTimeout(function() {
        monsterImage.classList.remove('translate-y-[25%]')
        monsterImage.classList.add('-translate-x-[100%]')
        playAttackSound()
        togglePokemonVisibility()
    }, 150)
    setTimeout(function() {
        monsterImage.classList.remove('-translate-x-[100%]')
    }, 200)
    setTimeout(togglePokemonVisibility, 400)
    setTimeout(togglePokemonVisibility, 600)
    setTimeout(togglePokemonVisibility, 800)
}
// Get random positive or negative number for dice bounces
function randomPosOrNeg(num) {
    const posOrNeg = Math.round(Math.random()) * 2 -1
    const randomInt = Math.ceil(Math.random() * num)
    const randomNumber = posOrNeg * randomInt
    return randomNumber
}
// Set random translations for dice bounces
function randomBounce() {
    const randomX = randomPosOrNeg(150);
    const randomY = randomPosOrNeg(150);
    diceRollingImage.classList.add(`translate-x-[${randomX}%]`)
    diceRollingImage.classList.add(`translate-y-[${randomY}%]`)
}
// Reset both dice images
function diceImageReset() {
    diceRollingImage.className = 'h-[25%] w-[25%] object-fill transition ease-in-out'
    diceStillImage.className = 'h-[75%] w-[75%] object-fill transition ease-in-out hidden'
}
// Toggle dice gif visibility
function diceRollingVisibility() {
    diceRollingImage.classList.toggle('hidden');
};
// Toggle dice image visibility
function diceStillVisibility() {
    diceStillImage.classList.toggle('hidden');
};
// Roll dice gif then display roll result on dice image
function rollRender(roll) {
    rollTotalSpan.innerText = ''
    diceImageReset()
    randomBounce()
    setTimeout(randomBounce, 200)
    setTimeout(randomBounce, 400)
    setTimeout(randomBounce, 600)
    setTimeout(randomBounce, 800)
    setTimeout(function() {
        diceRollingVisibility()
        diceStillVisibility()
        rollTotalSpan.innerText = roll
    }, 1200)
}
/* ---------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR GETTING AND FETCHING CHARACTERS ----------------- */
//Get random monster by current level
function getRandomMonster() {
    let monster = ''
    const lvlOneToNineArray = [
        'giant-crab',
        'mimic',
        'ghost',
        'zombie',
        'flying-sword',
        'nightmare',
        'awakened-tree'
    ]
    const lvlElevenToFifteen = [
        'mammoth',
        'clay-golem',
        'minotaur',
        'fire-giant',
        'berserker'
    ]
    const lvlSixteentoNinteen = [
        'pit-fiend',
        'giant-ape',
        'hydra',
        'tyrannosaurus-rex'
    ]
    const lvlTwentyandBeyond = [
        'kraken',
        'pit-fiend',
        'tyrannosaurus-rex',
        'ancient-black-dragon'

    ]
    if (score < 9) {
        monster = getRandom(lvlOneToNineArray)
    } else if (score == 9) {
        monster = 'archmage'
    } else if (score >= 10 && score < 14){
        monster = getRandom(lvlElevenToFifteen)
    } else if (score == 14){
        monster = 'ancient-black-dragon'
    } else if (score == 19){
        monster = 'kraken'
    } else if (score >= 15 && score < 20) {
        monster = getRandom(lvlSixteentoNinteen)
    } else {
        monster = getRandom(lvlTwentyandBeyond)
    }
    fetchDNDMonster(monster)
}
// Get random Pokemon
function getRandomPokemon() {
    const randomIndex = Math.ceil(Math.random() * 151)
    fetchPokemon(randomIndex)
}

// Fetch from APIs
function fetchDNDMonster(monster) {
    fetch(`https://www.dnd5eapi.co/api/monsters/${monster}`)
        .then(function (response){
            return response.json()
        })
        .then(function (data){
            parseMonsterData(data)
        })
}

function fetchPokemon(pokemon) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        .then(function (response){
            return response.json()
        })
        .then(function (data){
            parsePokemonData(data)
        })
}

/* -----------------------------------------------------------------------------*/

/* ------------ FUNCTIONS FOR RENDERING CHARACTERS AND BG --------------------- */
// Set Background
function setBackground() {
    const choice = Math.floor(Math.random() * bgArray.length)
    document.body.style = `background-image: url(${bgArray[choice]});`
}
// Set Character Images
function setPokemonImage() {
    pokemonImage.src = pokemonData.sprite
}
function setMonsterImage(){
    monsterImage.src = monsterData.imgUrl
}
// Set Character Cards
function setPokemonCard() {
    let pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
    pokemonNameHeader.innerText = pokemonName
    if (pokemonData.currentHp <= 0) {
        pokemonData.currentHp = 0
    }
    pokemonCurrentHpSpan.innerText = `HP: ${pokemonData.currentHp}/`
    pokemonTotalHpSpan.innerText = pokemonData.hp
    pokemonAttackHeader.innerText = `Base Attack: ${pokemonData.baseAttack}`
    pokemonImage.classList.remove('origin-bottom','rotate-90', '-translate-x-[25%]', '-translate-y-[25%]')
    pokemonHpBar.value = pokemonData.currentHp
    pokemonHpBar.max = pokemonData.hp
}
function setMonsterCard() {
    let monsterName = monsterData.name.charAt(0).toUpperCase() + monsterData.name.slice(1)
    monsterNameHeader.innerText = monsterName
    if (monsterData.currentHp <= 0) {
        monsterData.currentHp = 0
    }
    monsterCurrentHpSpan.innerText = `HP: ${monsterData.currentHp}/`
    monsterTotalHpSpan.innerText = monsterData.hp
    monsterAttackHeader.innerText = `Attack: ${monsterData.damageDice}`
    monsterImage.classList.remove('origin-bottom','rotate-90', '-translate-x-[25%]', '-translate-y-[25%]')
    monsterHpBar.value = monsterData.currentHp
    monsterHpBar.max = monsterData.hp
}
// Render Roll Results
function resultsRender(type, total, modifier, damage) {
    rollTypeEl.innerText = `Roll Type: ${type}`
    rollTotalEl.innerText = `Roll Total: ${total}`
    damageModEl.innerText = `Damage Mod: ${modifier}`
    rollDamageEl.innerText = `Damage: ${damage}`
}
// Reset Roll Results 
function resultsReset() {
    rollTypeEl.innerText = ''
    rollTotalEl.innerText = ''
    damageModEl.innerText = ''
    rollDamageEl.innerText = ''
}
// Render Battle Count Header
function displayBattleCount() {
    battleCountEl.innerText = `Battle ${score + 1}`
}
/* ---------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR CREATING CHARACTERS ----------------------------- */
//Parse Monster Fetch Data
function parseMonsterData(data) {
    const damageDice = data.actions[0].name == 'Multiattack'? data.actions[1].damage[0].damage_dice : data.actions[0].damage[0].damage_dice
    const monsterIndex = data.index
    const monsterName = data.name
    monsterData.name = monsterName
    monsterData.hp = data.hit_points
    monsterData.currentHp = data.hit_points
    monsterData.damageDice = damageDice
    monsterData.imgUrl = `assets/images/${monsterIndex}.png`
    monsterData.armor = data.armor_class[0].value
    monsterData.strength = data.strength
    setMonsterImage()
    setMonsterCard()
    splitDamageDice()
    attackBtn.classList.remove('hidden')
}
// Parse Pokemon Fetch Data
function parsePokemonData(data) {
    pokemonData.name = data.name
    pokemonData.hp = data.stats[0].base_stat
    pokemonData.currentHp = data.stats[0].base_stat
    pokemonData.attack = data.stats[1].base_stat
    pokemonData.spAttack = data.stats[3].base_stat
    pokemonData.defense = data.stats[2].base_stat
    if (pokemonData.spAttack > pokemonData.attack) {
        pokemonData.baseAttack = pokemonData.spAttack
    } else {
        pokemonData.baseAttack = pokemonData.attack
    }
    pokemonData.damageModifier = Math.round(pokemonData.baseAttack / 20)
    pokemonData.sprite = data.sprites.other.showdown.front_default
    pokemonData.cry = data.cries.legacy
    pokemonData.pokemonAudio = new Audio(pokemonData.cry);
    setPokemonImage()
    setPokemonCard()
    attackBtn.classList.remove('hidden')
}
/* ---------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR HIGH SCORES ------------------------------------- */
function checkHighScores() {
    if (highScores.length < 10){
        showHighScoreModal()
    } else if (score > highScores[9].score){
        showHighScoreModal()
    } else {
        showLowScoreModal()
    }
}

function setHighScores(scoreObject) {
    if (highScores.length < 10){
        highScores.push(scoreObject)
    } else {
        if (highScores[9].score < scoreObject.score){
            highScores.pop()
            highScores.push(scoreObject)
        }
    }
    highScores.sort((a, b) => b.score - a.score)
    localStorage.setItem('highScores', JSON.stringify(highScores))
    window.location.href = 'scores.html'
}
/* ---------------------------------------------------------------------------- */

/* ------------ INIT ---------------------------------------------------------- */ 
// Render characters and background on start
function init() {
    setBackground()
    displayBattleCount()
    getRandomMonster()
    getRandomPokemon()
    setMuteToggle()
    handleInitialsInput()
}

// Event listeners
fetchBtn.addEventListener('click', function(e) {
    mainContainer.classList.remove('hidden')
    fetchBtn.parentElement.classList.add('hidden')
    playPokemonCry()
    playBgMusic()
    canUnmute = true
})

muteToggle.addEventListener('click', function(e) {
    toggleBgMusic()
})

attackBtn.addEventListener('click', function(e) {
    playerTurn()
    attackBtn.classList.add('hidden')
})

continueAttackBtn.addEventListener('click', function(e) {
    if (monsterData.currentHp <= 0) {
        victory()
    } else if (pokemonData.currentHp <= 0) {
        defeat()
    } else if (isPlayerTurn === false) {
        monsterTurn()
    } else {
        attackBtn.classList.remove('hidden')
        return
    }
})

healBtn.addEventListener('click', function(e) {
    healthPotion()
})

increaseAttackBtn.addEventListener('click', function(e) {
    increaseAttack()
})

increaseHpBtn.addEventListener('click', function(e) {
    increaseHp()
})

nextBattleButton.addEventListener('click', function(e) {
    nextBattle()
})

quitToMainBtn.addEventListener('click', function(e) {
    window.location.href = 'index.html'
})

playAgainBtn.addEventListener('click', function(e){
    score = 0
    init()
    lowScoreModal.close()
})

highScoreForm.addEventListener('submit', function(e) {
    e.preventDefault()
    const init1 = document.getElementById('init1').value
    const init2 = document.getElementById('init2').value
    const init3 = document.getElementById('init3').value
    const highScoreName = (init1 + init2 + init3).toUpperCase()
    const scoreObject = {'name': highScoreName, 'pokemon': pokemonData.name, 'score': score}
    setHighScores(scoreObject)
    highScoreForm.reset()
    highScoreModal.style.display = 'none'
})
/* ---------------------------------------------------------------------------- */

init()
