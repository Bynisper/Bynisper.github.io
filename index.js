// HANGMAN v2

// Creates the initial and constant interactability of the page
//--------------------------------------------------------------
const hangmanSprite = document.getElementById("hangmanSprite");
const startGame = document.getElementById("startGame");
const restartGame = document.getElementById("restartGame");
const winScreen = document.getElementById("win");
const loseScreen = document.getElementById("lose");
const wordDisplay = document.getElementById('wordDisplay');
let chosenWord = "";
let wordStatus = "";
const attemptsMax = 6;
let attempts = attemptsMax;

// Fallback words used if the API is unavailable
const fallbackWords = [
    "APPLE", "BRAVE", "CRANE", "DRIVE", "EAGLE", "FLUTE", "GRAPE", "HOUSE",
    "IRONY", "JOKER", "KNEEL", "LEMON", "MANGO", "NIGHT", "OCEAN", "PIANO",
    "QUEEN", "RIVER", "STONE", "TIGER", "WATER", "BLAZE", "CLOWN", "EARTH",
    "FROST", "GLOBE", "HATCH", "LLAMA", "MONTH", "NERVE", "ORBIT", "PLACE",
    "QUIET", "REALM", "SHELF", "TRACK", "VENOM", "WHALE", "YEARN", "ALARM",
    "BLEND", "CHESS", "DELTA", "EMBER", "FABLE", "GHOST", "HUMID", "KARMA",
    "LEGAL", "MODEL", "NOBLE", "OLIVE", "PLUMB", "RAVEN", "SWAMP", "TROUT",
    "ULTRA", "VIVID", "WALTZ", "XEROX", "YIELD", "ZESTY", "ABRUPT", "BLIGHT",
    "CACTUS", "FELINE", "GOBLIN", "HUNTER", "INSECT", "JIGSAW", "KNIGHT",
    "LIQUID", "MORTAL", "NICKEL", "OYSTER", "PURPLE", "ROBBER", "SLEEPY",
    "TALENT", "UNIQUE", "VENDOR", "WALRUS", "ZIPPER", "BLANKET", "CABINET",
    "DOLPHIN", "EXCERPT", "FACTORY", "GRANITE", "HABITAT", "ICEBERG"
];

startGame.addEventListener('click', start);
restartGame.addEventListener('click', start);
//--------------------------------------------------------------




// FUNCTIONS
//--------------------------------------------------------------

// Creates the initial state of the game
async function start() {

    // Disable buttons while loading to prevent double-taps
    startGame.disabled = true;
    restartGame.disabled = true;

    // Try to fetch a random word from the API, fall back to local list on failure
    let word;
    try {
        const wordLength = Math.floor(Math.random() * (8 - 4 + 1) + 4);
        const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}&type=capitalized`);
        const data = await response.json();
        if (data && typeof data[0] === 'string' && data[0].length > 0) {
            word = data[0].toUpperCase();
        } else {
            throw new Error('Invalid API response');
        }
    } catch (e) {
        word = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    }

    // Re-enable buttons
    startGame.disabled = false;
    restartGame.disabled = false;

    // Sets the chosen word variable to be equal to the random word
    chosenWord = word;
    console.log(chosenWord);

    // Sets the word status equal to as many underscores as there are characters in chosen word
    wordStatus = "_".repeat(chosenWord.length)

    // Creates an array of all keyboard button elements, adds an event listener to each, and gives them the active button class to apply styling
    document.querySelectorAll(".keyboardButton").forEach((button) => {
        button.addEventListener('click', submitGuess, {once:true});
        button.classList.add("activeButton");
    })

    // Initializes/resets all of the initial game display settings
    startGame.style.display = "none";
    restartGame.style.display = "block";
    winScreen.style.display = "none";
    loseScreen.style.display = "none";
    wordDisplay.textContent = wordStatus;
    wordDisplay.style.color = "hsl(0, 0.00%, 100.00%)";
    hangmanSprite.src = `Sprites/HangmanSprite6.png`;
    document.querySelectorAll(".correctButton").forEach(button => button.classList.remove("correctButton"));
    document.querySelectorAll(".wrongButton").forEach(button => button.classList.remove("wrongButton"));
    attempts = attemptsMax;
}

// Event listener callback for keyboard buttons that checks the button text content against the chosen word
function submitGuess(event) {

    /* Loops through the chosen word
    Compares each character to the keyboard button text content
    Creates a temporary string to build the new word status given the submitted guess */
    let tempWord = "";
    let correctGuess = false;
    for (let i = 0; i < chosenWord.length; i++) {
        if (event.target.textContent == chosenWord[i].toUpperCase()) {
            tempWord += chosenWord[i];
            correctGuess = true;
        } else if (wordStatus[i] != "_") {
            tempWord += wordStatus[i];
        } else {
            tempWord += "_";
        }

    }

    // Sets the word status equal to the temporary string and updates the word display
    wordStatus = tempWord;
    wordDisplay.textContent = wordStatus;

    // Checks if the submitted guess was correct and updates accordingly
    if (!correctGuess) {
        attempts -= 1;
        event.target.classList.add("wrongButton");
        hangmanSprite.src = `Sprites/HangmanSprite${attempts}.png`
    } else {
        event.target.classList.add("correctButton");
    }

    // Checks if a win or lose condition is met and if either are met calls the game over function
    if (wordStatus == chosenWord) {
        gameOver(true);
    } else if (attempts <= 0) {
        gameOver(false);
    }
}

// Handles UI when the game status is over
function gameOver(win) {

    // Selects all button elements, loops through them and removes the event listener
    document.querySelectorAll("button").forEach(function (button) {
        button.removeEventListener('click', submitGuess, {once:true})
        button.classList.remove("activeButton");
    })

    // Displays the win screen
    if (win) {
        document.getElementById("win").style.display = "block";
        wordDisplay.style.color = "hsl(125, 100%, 80%)";

    // Displays the lose screen
    } else {
        document.getElementById("lose").style.display = "block";
        wordDisplay.textContent = chosenWord;
        wordDisplay.style.color = "hsl(0, 100%, 80%)";
    }
}
//--------------------------------------------------------------
