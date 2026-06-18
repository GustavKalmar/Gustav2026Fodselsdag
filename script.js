// ----------------------------------------------------
// 🎯 CUSTOMIZE YOUR QUESTIONS, ANSWERS & AUDIO HERE
// ----------------------------------------------------
const quizData = [
    {
        title: "Clue 1: The Code Riddle",
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? (Hint: Lowercase)",
        answer: "echo",
        audio: "" // Leave blank if you don't want music on this slide
    },
    {
        title: "Clue 2: Audio Identifier",
        question: "Listen to the music snippet below. What classic game console boot sound is this?",
        answer: "playstation",
        audio: "audio/ps1.mp3" // Put your mp3 inside an 'audio' folder in your repo
    },
    {
        title: "Clue 3: The Secret Vault",
        question: "Solve the math equation to unlock the coordinates: What is (12 * 4) - 6?",
        answer: "42",
        audio: ""
    }
];

// ----------------------------------------------------
// ⚙️ GAME ENGINE (No need to edit below unless curious)
// ----------------------------------------------------
let currentSlide = 0;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const victoryScreen = document.getElementById('victory-screen');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

const slideTitle = document.getElementById('slide-title');
const questionText = document.getElementById('question-text');
const audioContainer = document.getElementById('audio-container');
const gameAudio = document.getElementById('game-audio');
const audioSource = document.getElementById('audio-source');
const answerInput = document.getElementById('answer-input');
const feedbackMessage = document.getElementById('feedback-message');

// Event Listeners
startBtn.addEventListener('click', startGame);
submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', resetGame);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

function startGame() {
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    progressContainer.classList.remove('hidden');
    currentSlide = 0;
    loadSlide();
}

function loadSlide() {
    const currentData = quizData[currentSlide];
    
    // Set text elements
    slideTitle.innerText = currentData.title;
    questionText.innerText = currentData.question;
    
    // Clear old feedback and inputs
    answerInput.value = "";
    feedbackMessage.innerText = "";
    feedbackMessage.className = "";

    // Handle Audio Engine
    if (currentData.audio && currentData.audio !== "") {
        audioSource.src = currentData.audio;
        gameAudio.load(); // Reload the audio engine with new source
        audioContainer.classList.remove('hidden');
    } else {
        gameAudio.pause();
        audioContainer.classList.add('hidden');
    }

    updateProgressBar();
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = quizData[currentSlide].answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
        // Trigger intermediate celebration confetti
        confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 }
        });

        currentSlide++;

        if (currentSlide < quizData.length) {
            feedbackMessage.className = "correct";
            feedbackMessage.innerText = "Correct! Moving to next clue...";
            // Brief pause before sliding to next question
            setTimeout(loadSlide, 1200);
        } else {
            showVictory();
        }
    } else {
        feedbackMessage.className = "incorrect";
        feedbackMessage.innerText = "❌ That's not it! Try analyzing the clue again.";
        // Shake input effect
        answerInput.classList.add('shake');
        setTimeout(() => answerInput.classList.remove('shake'), 500);
    }
}

function updateProgressBar() {
    const percentage = (currentSlide / quizData.length) * 100;
    progressBar.style.width = `${percentage}%`;
}

function showVictory() {
    quizScreen.classList.add('hidden');
    progressContainer.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    
    // Big victory confetti explosion loop
    let duration = 4 * 1000;
    let end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function resetGame() {
    victoryScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
}

