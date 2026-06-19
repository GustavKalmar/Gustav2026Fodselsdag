// ==========================================
// 🛠️ CONFIGURATION GAME SETUP
// ==========================================
const GAME_TIME_LIMIT = 180; // Time in seconds for EACH round (e.g., 180 = 3 minutes)

// List of break codes to unlock successive breaks. 
// If a team hits multiple breaks, they use code 1, then code 2, etc.
const BREAK_UNLOCK_CODES = ["pass123", "secret99", "gold77", "winner1"]; 

const masterQuestionsList = [
    { title: "Clue A: The Code Riddle", question: "I speak without a mouth... What am I?", answer: "echo", audio: "" },
    { title: "Clue B: Audio Identifier", question: "What classic console boot sound is this?", answer: "playstation", audio: "audio/ps1.mp3" },
    { title: "Clue C: The Secret Vault", question: "What is (12 * 4) - 6?", answer: "42", audio: "" },
    { title: "Clue D: Nature Study", question: "What falls, but never breaks?", answer: "night", audio: "" },
    { title: "Clue E: History Check", question: "In what year did the Titanic sink?", answer: "1912", audio: "" }
];

// ==========================================
// ⚙️ GAME SYSTEM INFRASTRUCTURE
// ==========================================
let activeQuizArray = [];
let currentSlide = 0;
let timerInterval = null;
let secondsLeft = GAME_TIME_LIMIT;
let breaksEncountered = 0;

// Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const breakScreen = document.getElementById('break-screen');
const victoryScreen = document.getElementById('victory-screen');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const scoreCounter = document.getElementById('score-counter');
const timerCounter = document.getElementById('timer-counter');
const finalScoreText = document.getElementById('final-score-text');
const feedbackMessage = document.getElementById('feedback-message');
const breakFeedback = document.getElementById('break-feedback');
const answerInput = document.getElementById('answer-input');
const breakCodeInput = document.getElementById('break-code-input');

// Initialize Team Selection Buttons
document.querySelectorAll('.team-btn').forEach(button => {
    button.addEventListener('click', () => {
        const teamNum = parseInt(button.getAttribute('data-team'), 10);
        generateTeamPath(teamNum);
        startGame();
    });
});

document.getElementById('submit-btn').addEventListener('click', checkAnswer);
document.getElementById('unlock-btn').addEventListener('click', unlockBreak);
document.getElementById('restart-btn').addEventListener('click', resetGame);
answerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
breakCodeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') unlockBreak(); });

// Shifts array order depending on team pick so teams start at different segments
function generateTeamPath(teamNumber) {
    activeQuizArray = [...masterQuestionsList];
    const shiftAmount = (teamNumber - 1) % activeQuizArray.length;
    for (let i = 0; i < shiftAmount; i++) {
        activeQuizArray.push(activeQuizArray.shift());
    }
}

function startGame() {
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    progressContainer.classList.remove('hidden');
    currentSlide = 0;
    breaksEncountered = 0;
    loadSlide();
    startTimer();
}

function loadSlide() {
    const currentData = activeQuizArray[currentSlide];
    document.getElementById('slide-title').innerText = currentData.title;
    document.getElementById('question-text').innerText = currentData.question;
    
    answerInput.value = "";
    feedbackMessage.innerText = "";
    feedbackMessage.className = "";

    const audioContainer = document.getElementById('audio-container');
    const gameAudio = document.getElementById('game-audio');
    if (currentData.audio && currentData.audio !== "") {
        document.getElementById('audio-source').src = currentData.audio;
        gameAudio.load();
        audioContainer.classList.remove('hidden');
    } else {
        gameAudio.pause();
        audioContainer.classList.add('hidden');
    }
    updateProgressUI();
}

function startTimer() {
    clearInterval(timerInterval);
    secondsLeft = GAME_TIME_LIMIT;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        secondsLeft--;
        updateTimerDisplay();

        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            triggerBreakLockout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    timerCounter.innerText = `⏰ Time Left: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function triggerBreakLockout() {
    document.getElementById('game-audio').pause();
    quizScreen.classList.add('hidden');
    breakScreen.classList.remove('hidden');
    breakCodeInput.value = "";
    breakFeedback.innerText = "";
}

function unlockBreak() {
    const enteredCode = breakCodeInput.value.trim();
    // Wrap selection index to prevent crashing if they trigger more timeouts than defined codes
    const currentRequiredCode = BREAK_UNLOCK_CODES[breaksEncountered % BREAK_UNLOCK_CODES.length];

    if (enteredCode === currentRequiredCode) {
        breaksEncountered++;
        breakScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        startTimer();
        loadSlide();
    } else {
        breakFeedback.innerText = "❌ Invalid Unlock Code. Try again!";
    }
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = activeQuizArray[currentSlide].answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        currentSlide++;

        if (currentSlide < activeQuizArray.length) {
            feedbackMessage.className = "correct";
            feedbackMessage.innerText = "Correct! Loading next clue...";
            setTimeout(loadSlide, 1000);
        } else {
            clearInterval(timerInterval);
            showVictory();
        }
    } else {
        feedbackMessage.className = "incorrect";
        feedbackMessage.innerText = "❌ Incorrect answer. Keep looking!";
    }
}

function updateProgressUI() {
    scoreCounter.innerText = `Score: ${currentSlide} / ${activeQuizArray.length}`;
    const percentage = (currentSlide / activeQuizArray.length) * 100;
    progressBar.style.width = `${percentage}%`;
}

function showVictory() {
    quizScreen.classList.add('hidden');
    progressContainer.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    finalScoreText.innerHTML = `Amazing job! You finished every single riddle!<br><strong>Final Score: ${currentSlide} / ${activeQuizArray.length} ⭐</strong>`;
    
    let duration = 4 * 1000;
    let end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function resetGame() {
    victoryScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    clearInterval(timerInterval);
}
