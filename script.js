// ==========================================
// 🛠️ CUSTOMIZABLE CATEGORIES & QUESTIONS DATA
// ==========================================
const categoriesData = {
    "Riddles": [
        { title: "Riddles - Clue 1", question: "I speak without a mouth... What am I?", answer: "echo", audio: "" },
        { title: "Riddles - Clue 2", question: "What falls but never breaks?", answer: "night", audio: "" }
    ],
    "Music": [
        { title: "Music - Clue 1", question: "What classic console boot sound is this?", answer: "playstation", audio: "audio/ps1.mp3" },
        { title: "Music - Clue 2", question: "Identify this instrument track.", answer: "piano", audio: "audio/piano.mp3" }
    ],
    "Math & Logic": [
        { title: "Math - Clue 1", question: "What is (12 * 4) - 6?", answer: "42", audio: "" },
        { title: "Math - Clue 2", question: "Next number in pattern: 2, 4, 8, 16...", answer: "32", audio: "" }
    ],
    "History": [
        { title: "History - Clue 1", question: "In what year did the Titanic sink?", answer: "1912", audio: "" },
        { title: "History - Clue 2", question: "Who was the first president of the USA?", answer: "washington", audio: "" }
    ],
    "Geoguessr": [
        { title: "Geography - Clue 1", question: "What is the capital city of France?", answer: "paris", audio: "" },
        { title: "Geography - Clue 2", question: "Which ocean is the largest on Earth?", answer: "pacific", audio: "" }
    ]
};

// The physical codes you hand out to pass each round break.
// Break 1 needs code 1, Break 2 needs code 2... up to 4 breaks total for 5 categories.
const BREAK_UNLOCK_CODES = ["pass1", "unlock2", "stage3", "final4"];

// ==========================================
// ⚙️ CATEGORY ENGINE LOGIC
// ==========================================
let categoryOrder = [];    // Order of categories for the selected team
let currentCategoryIndex = 0; // Tracking current category block
let currentQuestionIndex = 0; // Tracking question within that category
let totalQuestionsCount = 0;
let totalCorrectAnswers = 0;

// Gather DOM targets
const welcomeScreen = document.getElementById('welcome-screen');
const quizScreen = document.getElementById('quiz-screen');
const breakScreen = document.getElementById('break-screen');
const victoryScreen = document.getElementById('victory-screen');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const scoreCounter = document.getElementById('score-counter');
const categoryIndicator = document.getElementById('category-indicator');
const finalScoreText = document.getElementById('final-score-text');
const feedbackMessage = document.getElementById('feedback-message');
const breakFeedback = document.getElementById('break-feedback');
const answerInput = document.getElementById('answer-input');
const breakCodeInput = document.getElementById('break-code-input');

// Calculate total scope size for progress tracking bar
totalQuestionsCount = Object.values(categoriesData).reduce((acc, cat) => acc + cat.length, 0);

// Setup buttons
document.querySelectorAll('.team-btn').forEach(button => {
    button.addEventListener('click', () => {
        const teamNum = parseInt(button.getAttribute('data-team'), 10);
        calculateCategoryRotation(teamNum);
        startGame();
    });
});

document.getElementById('submit-btn').addEventListener('click', checkAnswer);
document.getElementById('unlock-btn').addEventListener('click', unlockCategoryBreak);
document.getElementById('restart-btn').addEventListener('click', resetGame);
answerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
breakCodeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') unlockCategoryBreak(); });

// Offsets keys sequentially so Teams don't share the same active topics concurrently
function calculateCategoryRotation(teamNumber) {
    const keys = Object.keys(categoriesData); // Array of category strings
    const shift = (teamNumber - 1) % keys.length;
    
    // Rotate array order based on team selection offset
    categoryOrder = [...keys.slice(shift), ...keys.slice(0, shift)];
}

function startGame() {
    welcomeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    progressContainer.classList.remove('hidden');
    currentCategoryIndex = 0;
    currentQuestionIndex = 0;
    totalCorrectAnswers = 0;
    loadQuestion();
}

function loadQuestion() {
    const activeCategoryName = categoryOrder[currentCategoryIndex];
    const targetCategoryQuestions = categoriesData[activeCategoryName];
    const currentQuestionData = targetCategoryQuestions[currentQuestionIndex];

    categoryIndicator.innerText = `📂 Category: ${activeCategoryName}`;
    document.getElementById('slide-title').innerText = `${currentQuestionData.title} (${currentQuestionIndex + 1}/${targetCategoryQuestions.length})`;
    document.getElementById('question-text').innerText = currentQuestionData.question;
    
    answerInput.value = "";
    feedbackMessage.innerText = "";
    feedbackMessage.className = "";

    // Load Audio Logic
    const audioContainer = document.getElementById('audio-container');
    const gameAudio = document.getElementById('game-audio');
    if (currentQuestionData.audio && currentQuestionData.audio !== "") {
        document.getElementById('audio-source').src = currentQuestionData.audio;
        gameAudio.load();
        audioContainer.classList.remove('hidden');
    } else {
        gameAudio.pause();
        audioContainer.classList.add('hidden');
    }

    updateProgressUI();
}

function checkAnswer() {
    const activeCategoryName = categoryOrder[currentCategoryIndex];
    const currentCategoryQuestions = categoriesData[activeCategoryName];
    const activeQuestion = currentCategoryQuestions[currentQuestionIndex];

    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = activeQuestion.answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        currentQuestionIndex++;
        totalCorrectAnswers++;

        if (currentQuestionIndex < currentCategoryQuestions.length) {
            feedbackMessage.className = "correct";
            feedbackMessage.innerText = "Correct! Loading next clue...";
            setTimeout(loadQuestion, 1000);
        } else {
            // Category completed! Check if it was the final category
            if (currentCategoryIndex + 1 < categoryOrder.length) {
                setTimeout(showCategoryBreakScreen, 1000);
            } else {
                setTimeout(showVictory, 1000);
            }
        }
    } else {
        feedbackMessage.className = "incorrect";
        feedbackMessage.innerText = "❌ Incorrect answer. Keep analyzing the clues!";
    }
}

function showCategoryBreakScreen() {
    document.getElementById('game-audio').pause();
    quizScreen.classList.add('hidden');
    breakScreen.classList.remove('hidden');
    breakCodeInput.value = "";
    breakFeedback.innerText = "";
    updateProgressUI();
}

function unlockCategoryBreak() {
    const enteredCode = breakCodeInput.value.trim();
    const neededCode = BREAK_UNLOCK_CODES[currentCategoryIndex];

    if (enteredCode === neededCode) {
        currentCategoryIndex++;
        currentQuestionIndex = 0; // reset inner pointer
        breakScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        loadQuestion();
    } else {
        breakFeedback.innerText = "❌ Master Key invalid. Ask your Game Master for the correct bypass phrase!";
    }
}

function updateProgressUI() {
    scoreCounter.innerText = `Score: ${totalCorrectAnswers} / ${totalQuestionsCount}`;
    const percentage = (totalCorrectAnswers / totalQuestionsCount) * 100;
    progressBar.style.width = `${percentage}%`;
}

function showVictory() {
    quizScreen.classList.add('hidden');
    progressContainer.classList.add('hidden');
    victoryScreen.classList.remove('hidden');
    finalScoreText.innerHTML = `Spectacular achievement! Every category deciphered successfully!<br><strong>Final Score: ${totalCorrectAnswers} / ${totalQuestionsCount} ⭐</strong>`;
    
    let duration = 5 * 1000;
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
}
