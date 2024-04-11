/* ------------ SET DOM VARIABLES --------------------------------------------- */
// Top Header
const battleCountEl = document.getElementById('battleCountEl')
// Buttons
const attackBtn = document.getElementById('attackBtn')
const healthPotionBtn = document.getElementById('healthBtn')
const increaseAttackBtn = document.getElementById('increaseAttackBtn')
const postFightButtons = document.querySelectorAll('.post-fight-btn')
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
const monsterNameHeader = document.getElementById('monsterNameHeader')
const monsterCurrentHpSpan = document.getElementById('monsterCurrentHp')
const monsterTotalHpSpan = document.getElementById('monsterTotalHp')
// Roll Results
const rollTypeEl = document.getElementById('rollTypeEl')
const rollTotalEl = document.getElementById('rollTotalEl')
const damageModEl = document.getElementById('damageModEl')
const rollDamageEl = document.getElementById('rollDamageEl')
// Modals
const improvePokemonModal = document.getElementById('improvePokemonModal')
const highScoreModal = document.getElementById('highScoreModal')
/* ---------------------------------------------------------------------------- */

/* ------------ MODAL POP-UPS ------------------------------------------------- */

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
/* ---------------------------------------------------------------------------- */

/* ------------ OBJECTS, ARRAYS, VARIABLES ------------------------------------ */
// Total score
let score = 0
//Global objects to be populated by parseMonsterData/parsePokemonData
let pokemonData = {}
let monsterData = {}
let monsterDice = {}
//Array for the current monsters added to the game
const monsterArray = [
    'mimic',
    'minotaur',
    'mammoth',
    'ghost',
    'zombie',
    'flying-sword',
    'awakened-tree'
]
// Background dungeon image array
const bgArray = [
    'assets/images/dungeon-bg-1.png',
    'assets/images/dungeon-bg-2.png',
    'assets/images/dungeon-bg-3.png',
    'assets/images/dungeon-bg-4.png',
    'assets/images/dungeon-bg-5.png',
    'assets/images/dungeon-bg-6.png'
]
/* ---------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR COMBAT ------------------------------------------ */
// Pokemon attacks first, then monster if monster is still alive, then check for pokemon hp
function combatFunction(){
    playerTurn()
    
    setTimeout(function(){    
    if (monsterData.currentHp <= 0) {
        victory()
    } else {
        monsterTurn()
        
        if (pokemonData.currentHp <= 0) {
            defeat()
        }
    }}, 2000)
}
// Pokemon attack
function playerTurn(){
    const dmgModifier = Math.round(pokemonData.attack / 20)
    const thisRoll = rollDice(20)
    const attackDmg = thisRoll * dmgModifier
    resultsReset()
    rollRender(thisRoll)
    setTimeout(function() {
        pokemonHits()
        resultsRender('1d20', thisRoll, dmgModifier, attackDmg)
        setMonsterCard()
    }, 1500)
    monsterData.currentHp -= attackDmg
    console.log('Damage: ' + attackDmg);
    console.log('Damage mod: ' + dmgModifier);
}
// Monster attack
function monsterTurn(){
    const thisRoll = damageRoll(monsterDice.numberOfRolls, monsterDice.diceMax, monsterDice.additionalDmg)
    const attackDmg = thisRoll
    resultsReset()
    rollRender(thisRoll)
    setTimeout(function() {
        monsterHits()
        resultsRender(monsterData.dmgDice, (thisRoll - monsterDice.additionalDmg), monsterDice.additionalDmg, attackDmg)
        setPokemonCard()
    }, 1500)
    pokemonData.currentHp -= attackDmg
    console.log('Damage: ' + attackDmg)
}
// Victory
function victory() {
    console.log('You have done it')
    score++
    showImproveModal()
}
// Defeat
function defeat() {
    console.log('You kind of smell')
    // Need to add function to check if score is high score
    showHighScoreModal()
}
// Take health potion
function healthPotion() {
    pokemonData.currentHp += 20
    if (pokemonData.currentHp > pokemonData.hp) {
        pokemonData.currentHp = pokemonData.hp
    }
    setPokemonCard()
    displayBattleCount()
    getRandomMonster()
    console.log(pokemonData.currentHp)
}
// Increase pokemon attack
function increaseAttack() {
    pokemonData.attack += 2
    displayBattleCount()
    getRandomMonster()
    console.log(pokemonData.attack)
}
/* ---------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR DICE ROLLS -------------------------------------- */
//Split monster damageDice string
function splitDamageDice() {
    const dmgDice = monsterData.dmgDice
    const numberOfRolls = parseInt(dmgDice.split('d')[0])
    const dmgDice2 = dmgDice.split('d')[1]
    const diceMax = parseInt(dmgDice2.split('+')[0])
    const additionalDmg = parseInt(dmgDice2.split('+')[1])
    monsterDice.numberOfRolls = numberOfRolls
    monsterDice.diceMax = diceMax
    monsterDice.additionalDmg = additionalDmg
}
// One roll of a specified numbered die
function rollDice(number) {
    let result = Math.ceil(Math.random() * number)
    console.log(result)
    return result
}
// Multiple rolls of the same numbered die
function damageRoll(numberofRolls, diceMax, additionalDmg) {
    let result = 0;
    for (let i = 0; i < numberofRolls; i++) {
        result += rollDice(diceMax)
    }
    result += additionalDmg
    console.log("Total: " + result)
    return result
}
/* ------------------------------------------------------------------------- */

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
        }
    }, 50)
    setTimeout(function() {
        pokemonImage.classList.remove('translate-y-[25%]')
        pokemonImage.classList.add('translate-x-[100%]')
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
        togglePokemonVisibility()
    }, 150)
    setTimeout(function() {
        monsterImage.classList.remove('-translate-x-[100%]')
    }, 200)
    setTimeout(togglePokemonVisibility, 400)
    setTimeout(togglePokemonVisibility, 600)
    setTimeout(togglePokemonVisibility, 800)
}
// Get random number between -150 and 150 for dice bounces
function randomNumber() {
    const posOrNeg = Math.round(Math.random()) * 2 -1
    const randomInt = Math.ceil(Math.random() * 150)
    const randomNumber = posOrNeg * randomInt
    return randomNumber
}
// Set random translations for dice bounces
function randomBounce() {
    const randomX = randomNumber();
    const randomY = randomNumber();
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
/* ------------------------------------------------------------------------------- */

/* ------------ FUNCTIONS FOR GETTING AND FETCHING CHARACTERS ----------------- */
//Get random characters
function getRandomMonster() {
    const randomIndex = Math.floor(Math.random() * (monsterArray.length))
    console.log(monsterArray[randomIndex])
    fetchDNDMonster(monsterArray[randomIndex])
}

function getRandomPokemon() {
    const randomIndex = Math.floor(Math.random() * 151)
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

/* ---------------------------------------------------------------------------------------------*/

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
    pokemonImage.classList.remove('origin-bottom','rotate-90', '-translate-x-[25%]', '-translate-y-[25%]')
}
function setMonsterCard() {
    let monsterName = monsterData.name.charAt(0).toUpperCase() + monsterData.name.slice(1)
    monsterNameHeader.innerText = monsterName
    if (monsterData.currentHp <= 0) {
        monsterData.currentHp = 0
    }
    monsterCurrentHpSpan.innerText = `HP: ${monsterData.currentHp}/`
    monsterTotalHpSpan.innerText = monsterData.hp
    monsterImage.classList.remove('origin-bottom','rotate-90', '-translate-x-[25%]', '-translate-y-[25%]')
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
    const monsterName = data.index
    monsterData.name = monsterName
    monsterData.hp = data.hit_points
    monsterData.currentHp = data.hit_points
    monsterData.dmgDice = data.actions[0].damage[0].damage_dice
    monsterData.imgUrl = `assets/images/${monsterName}.png`
    setMonsterImage()
    setMonsterCard()
    splitDamageDice()

}
// Parse Pokemon Fetch Data
function parsePokemonData(data) {
    pokemonData.name = data.name
    pokemonData.hp = data.stats[0].base_stat
    pokemonData.currentHp = data.stats[0].base_stat
    pokemonData.attack = data.stats[1].base_stat
    pokemonData.sprite = data.sprites.other.showdown.front_default
    setPokemonImage()
    setPokemonCard()
    console.log(pokemonData.name)

}
/* ---------------------------------------------------------------------------- */

/* ------------ INIT ---------------------------------------------------------- */
// Render characters and background on start
setBackground()
displayBattleCount()
getRandomMonster()
getRandomPokemon()

// Event listeners
attackBtn.addEventListener('click', function(e) {
    combatFunction()
})

healthPotionBtn.addEventListener('click', function(e) {
    healthPotion()
})

increaseAttackBtn.addEventListener('click', function(e) {
    increaseAttack()
})
/* ---------------------------------------------------------------------------- */