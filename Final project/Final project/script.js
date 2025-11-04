// Character data (icons + GIFs)
const characterAPI = [
  { name: "your character", icon: "https://api.dicebear.com/7.x/bottts/svg?seed=Male1",
    gif: { dance: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif", sad: "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif" } },
  { name: "your character", icon: "https://api.dicebear.com/7.x/adventurer/svg?seed=Male2",
    gif: { dance: "https://media.giphy.com/media/YTbZzCkRQCEJa/giphy.gif", sad: "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif" } },
  { name: "your character", icon: "https://api.dicebear.com/7.x/micah/svg?seed=Male3",
    gif: { dance: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif", sad: "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" } },
  { name: "your character", icon: "https://api.dicebear.com/7.x/avataaars/svg?seed=Female1",
    gif: { dance: "https://media.giphy.com/media/YTbZzCkRQCEJa/giphy.gif", sad: "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" } },
  { name: "your character", icon: "https://api.dicebear.com/7.x/lorelei/svg?seed=Female3",
    gif: { dance: "https://media.giphy.com/media/YTbZzCkRQCEJa/giphy.gif", sad: "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" } }
];

// State
let deckId = "";
let score = 0;
const targetScore = 4;
let chosenCharacterIdx = null;
let gameActive = false;
let currentCard = null;
let nextCard = null;

// Refs
const characterSelectionDiv = document.getElementById("character-selection");
const gameAreaDiv = document.getElementById("game-area");
const scoreSpan = document.getElementById("score");
const messageDiv = document.getElementById("message");
const playerMetaDiv = document.getElementById("player-meta");
const fullscreenOverlay = document.getElementById("fullscreen-overlay");
const cardImg1 = document.getElementById("card-img-1");
const flipInner2 = document.getElementById("flip-inner-2");
const card2Back = document.getElementById("card2-back");
const card2Face = document.getElementById("card2-face");
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");
const tieSound = document.getElementById("tie-sound");
const gameTitle = document.getElementById("game-title");
const ingameHint = document.getElementById("ingame-hint");


const startModal = document.getElementById("start-modal");
const startBtn = document.getElementById("start-btn");


function getCardBack() {
  return "https://deckofcardsapi.com/static/img/back.png"; 
} 

function cardValue(val) {
  if (val === "ACE") return 1;
  if (val === "JACK") return 11;
  if (val === "QUEEN") return 12;
  if (val === "KING") return 13;
  return parseInt(val);
}



function enableGuessButtons(enabled) {
  document.getElementById("higher-btn").disabled = !enabled;
  document.getElementById("lower-btn").disabled = !enabled;
}

function setThemeFromModalSelection() {
  const sel = document.querySelector('input[name="theme"]:checked');
  const chosen = sel ? sel.value : "dark";
  document.body.setAttribute("data-theme", chosen);
}

function openStartModalOnce() {
  startModal.style.display = "flex";
  startBtn.onclick = () => {
    setThemeFromModalSelection(); 
    startModal.style.display = "none";
    characterSelectionDiv.style.display = "block";
    showCharacters();
  };
}

//  grid
function showCharacters() {
  characterSelectionDiv.innerHTML = "<h2>Select Your Character</h2><div id='characters'></div>";
  const charsContainer = document.getElementById("characters");
  charsContainer.style.display = "flex";
  charsContainer.style.justifyContent = "center";
  charsContainer.style.flexWrap = "wrap";

  characterAPI.forEach((char, i) => {
    const img = document.createElement("img");
    img.src = char.icon;
    img.alt = char.name;
    img.title = char.name;
    img.id = "char" + i;
    img.style.cursor = "pointer";
    img.onclick = () => selectCharacter(i);
    charsContainer.appendChild(img);
  });
}

function selectCharacter(index) {
  chosenCharacterIdx = index;
  document.querySelectorAll("#characters img").forEach(img => img.classList.remove("selected"));
  document.getElementById(`char${index}`).classList.add("selected");

  // Show game
  characterSelectionDiv.style.display = "none";
  startGame();
}

// Start game
function startGame() {
  score = 0;
  gameActive = true;

  scoreSpan.textContent = "Score: 0";
  messageDiv.textContent = "";
  ingameHint.style.display = "block";
  gameAreaDiv.style.display = "block";
  gameTitle.style.display = "block";

 
  playerMetaDiv.innerHTML = `
    <img src="${characterAPI[chosenCharacterIdx].icon}" alt="${characterAPI[chosenCharacterIdx].name}" />
    <span>${characterAPI[chosenCharacterIdx].name}</span>
  `;

  fullscreenOverlay.style.display = "none";

  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => res.json())
    .then(data => {
      deckId = data.deck_id;
      drawTwoCards();
    });
}

// Deal two cards
function drawTwoCards() {
  // Reset hidden card state
  flipInner2.classList.remove("revealed");
  card2Back.src = getCardBack();
  card2Face.src = getCardBack();

  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
      if (!data || !data.cards || data.cards.length < 2) {
        showFullscreenWin();
        return;
      }
      currentCard = data.cards[0];
      nextCard = data.cards[1];

      cardImg1.src = currentCard.image;
      card2Back.src = getCardBack();
      card2Face.src = nextCard.image;

      messageDiv.textContent = "Will the hidden card be higher or lower than the shown card?";
      enableGuessButtons(true);
    })
    .catch(() => {
      messageDiv.textContent = "Network issue. Retrying...";
      setTimeout(drawTwoCards, 1000);
    });
}


function playerGuess(isHigher) {
  if (!gameActive) return;
  enableGuessButtons(false);

  // Flip to reveal
  void flipInner2.offsetWidth;
  flipInner2.classList.add("revealed");

  setTimeout(() => {
    const v1 = cardValue(currentCard.value);
    const v2 = cardValue(nextCard.value);

    if (v2 === v1) {
      try { tieSound?.play?.(); } catch {}
      showTie();
      return;
    }

    const won = (isHigher && v2 > v1) || (!isHigher && v2 < v1);
    const charImg = playerMetaDiv.querySelector("img");

    if (won) {
      score++;
      scoreSpan.textContent = "Score: " + score;
      messageDiv.textContent = " +1 point!";
      try { winSound?.play?.(); } catch {}

     
      const original = characterAPI[chosenCharacterIdx].icon;
      charImg.src = characterAPI[chosenCharacterIdx].gif.dance;
      setTimeout(() => { charImg.src = original; }, 1100);

      if (score >= targetScore) {
        setTimeout(showFullscreenWin, 900);
      } else {
        setTimeout(drawTwoCards, 900);
      }
    } else {
      try { loseSound?.play?.(); } catch {}
      setTimeout(showFullscreenLoss, 600);
    }
  }, 600);
}

function showTie() {
  gameActive = false;
  messageDiv.textContent = " Tie! Both cards have the same value. New round!";
  setTimeout(() => { gameActive = true; drawTwoCards(); }, 1200);
}

// Overlays
function showFullscreenWin() {
  gameActive = false;
  const danceGifUrl = characterAPI[chosenCharacterIdx]?.gif?.dance || "";
  const winMsg = `You Win! ${characterAPI[chosenCharacterIdx]?.name || "Player"} celebrates!`;

  gameTitle.style.display = "none";
  gameAreaDiv.style.display = "none";

  fullscreenOverlay.innerHTML = `
    <div class="overlay-card" role="dialog" aria-modal="true" aria-labelledby="win-title" tabindex="0">
      <img src="${danceGifUrl}" alt="Celebration animation" />
      <div id="win-title" class="fullscreen-message">${winMsg}</div>
      <div class="fullscreen-score">Score: ${score}</div>
      <div>
        <button onclick="restart()" aria-label="Play Again">Play Again</button>
      </div>
    </div>
  `;
  fullscreenOverlay.style.display = "flex";
  fullscreenOverlay.focus();
}

function showFullscreenLoss() {
  gameActive = false;
  const sadGif = characterAPI[chosenCharacterIdx]?.gif?.sad || "";
  const loseMsg = `Oops! ${characterAPI[chosenCharacterIdx]?.name || "Player"}'s luck ran out. Try again!`;

  gameTitle.style.display = "none";
  gameAreaDiv.style.display = "none";

  fullscreenOverlay.innerHTML = `
    <div class="overlay-card" role="dialog" aria-modal="true" aria-labelledby="lose-title" tabindex="0">
      <img src="${sadGif}" alt="Sad animation" />
      <div id="lose-title" class="fullscreen-message">${loseMsg}</div>
      <div class="fullscreen-score">Final Score: ${score}</div>
      <div>
        <button onclick="restart()" aria-label="Restart Game">Restart</button>
      </div>
    </div>
  `;
  fullscreenOverlay.style.display = "flex";
  fullscreenOverlay.focus();
}


function restart() {
  fullscreenOverlay.style.display = "none";
  messageDiv.textContent = "";
  gameTitle.style.display = "block";
  gameAreaDiv.style.display = "none";
  ingameHint.style.display = "none";
  scoreSpan.textContent = "Score: 0";

  deckId = "";
  score = 0;
  currentCard = null;
  nextCard = null;
  gameActive = false;


  characterSelectionDiv.style.display = "block";
  showCharacters();
  enableGuessButtons(false);
}


document.getElementById("higher-btn").onclick = () => playerGuess(true);
document.getElementById("lower-btn").onclick = () => playerGuess(false);
document.getElementById("restart-btn").onclick = () => restart();


window.addEventListener("load", () => {
  characterSelectionDiv.style.display = "none";
  gameAreaDiv.style.display = "none";
  ingameHint.style.display = "none";

  document.body.setAttribute("data-theme", "dark");
  openStartModalOnce();
});


