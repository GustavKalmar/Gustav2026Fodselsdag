const quizData = [
    {
        title: "1.1: Gennem årene",
        question: "e",
        answer: "echo",
        audio: "" 
    },
    {
        title: "2.1: Movie Quotes",
        question: "Listen to the music snippet below. What classic game console boot sound is this?",
        answer: "playstation",
        audio: "audio/ps1.mp3" 
    },
    {
        title: "3.1: Hvad var det?",
        question: "Hvilken film kommer dette fra",
        answer: "42",
        audio: ""
    },
    {
        title: "4.1: Ikke alt",
        question: "Hvor kommer dette billede fra?",
        answer: "42",
        audio: ""
    },
    {
        title: "4.1: AKTIVITET",
        question: "Hohahe... Nu er I nået til en aktivitet",
        answer: "42",
        audio: ""
    },
    {
        title: "5.1: Nemt, de sagde",
        question: "Solve the math equation to unlock the coordinates: What is (12 * 4) - 6?",
        answer: "42",
        audio: ""
    },
];

let currentSlide = 0;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const victoryScreen = document.getElementById('victory-screen');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const scoreCounter = document.getElementById('score-counter');
const finalScoreText = document.getElementById('final-score-text');

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
    
    slideTitle.innerText = currentData.title;
    questionText.innerText = currentData.question;
    
    answerInput.value = "";
    feedbackMessage.innerText = "";
    feedbackMessage.className = "";

    if (currentData.audio && currentData.audio !== "") {
        audioSource.src = currentData.audio;
        gameAudio.load(); 
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
        confetti({
            particleCount: 300,
            spread: 100,
            origin: { y: 0.8 }
        });

        currentSlide++;

        if (currentSlide < quizData.length) {
            feedbackMessage.className = "correct";
            feedbackMessage.innerText = "Correct! Moving to next clue...";
            setTimeout(loadSlide, 1200);
        } else {
            showVictory();
        }
    } else {
        feedbackMessage.className = "incorrect";
        feedbackMessage.innerText = "øvsi døvsi.. Det var desværre forkrt :(";
        answerInput.classList.add('shake');
        setTimeout(() => answerInput.classList.remove('shake'), 500);
    }
}

function updateProgressBar() {
    // Update numerical indicator text
    scoreCounter.innerText = `Score: ${currentSlide} / ${quizData.length}`;
    
    // Update structural width
    const percentage = (currentSlide / quizData.length) * 100;
    progressBar.style.width = `${percentage}%`;
}

function showVictory() {
    quizScreen.classList.add('hidden');
    progressContainer.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    
    // Set the final summary score text dynamically
    finalScoreText.innerHTML = `You successfully cracked all the codes!<br><strong>Final Score: ${currentSlide} / ${quizData.length} ⭐</strong>`;
    
    let duration = 4 * 1000;
    let end = Date.now() + duration;

    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function resetGame() {
    victoryScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
}
