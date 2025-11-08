document.addEventListener('DOMContentLoaded', () => {
    // Element Seçimleri
    const welcomeScreen = document.getElementById('welcome-screen');
    const selectionScreen = document.getElementById('selection-screen');
    const gameScreen = document.getElementById('game-screen');
    const scoreScreen = document.getElementById('score-screen');
    const startBtn = document.getElementById('start-btn');
    const startPracticeBtn = document.getElementById('start-practice-btn');
    const restartBtn = document.getElementById('restart-btn');
    const helpBtn = document.getElementById('help-btn');
    const passBtn = document.getElementById('pass-btn');
    const exitBtn = document.getElementById('exit-btn');
    const questionWordEl = document.getElementById('question-word');
    const answerButtons = document.querySelectorAll('.btn-answer');
    const scoreEl = document.getElementById('score');
    const questionCounterEl = document.getElementById('question-counter');
    const finalScoreEl = document.getElementById('final-score');
    const timerBar = document.getElementById('timer-bar');
    const helpModal = document.getElementById('help-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const ambientSound = document.getElementById('ambient-sound');
    const clickSound = document.getElementById('click-sound');
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');
    const endSound = document.getElementById('end-sound');

    // Genel Değişkenler
    const TOTAL_QUESTIONS = 10;
    const TIME_PER_QUESTION = 15;
    let score, questionIndex, shuffledQuestions, passUsed, timerInterval;
    let activeGameWords = [];

    // --- Fonksiyonlar ---
    function populateSelectionScreen() {
        const optionsContainer = document.getElementById('word-list-options');
        optionsContainer.innerHTML = '';
        if (window.wordLists && window.wordLists.length > 0) {
            window.wordLists.forEach(list => {
                const item = document.createElement('div');
                item.className = 'checkbox-item';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = list.id;
                checkbox.value = list.id;
                checkbox.addEventListener('change', checkSelection);
                const label = document.createElement('label');
                label.htmlFor = list.id;
                label.textContent = list.title;
                item.appendChild(checkbox);
                item.appendChild(label);
                optionsContainer.appendChild(item);
            });
        }
    }

    function checkSelection() {
        const anyChecked = document.querySelectorAll('#word-list-options input:checked').length > 0;
        startPracticeBtn.disabled = !anyChecked;
    }

    function playSound(sound) {
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Ses çalınamadı:", e));
        }
    }

    function exitGame() {
        clearTimeout(timerInterval);
        if (ambientSound) ambientSound.pause();
        gameScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
    }

    function startGame() {
        activeGameWords = [];
        const selectedIds = Array.from(document.querySelectorAll('#word-list-options input:checked')).map(cb => cb.id);
        selectedIds.forEach(id => {
            const listData = window.wordLists.find(list => list.id === id);
            if (listData) {
                activeGameWords.push(...listData.words);
            }
        });

        if (activeGameWords.length < 4) {
            alert("Lütfen en az 4 kelime içeren bir grup seçin!");
            return;
        }

        score = 0; questionIndex = 0; passUsed = false;
        shuffledQuestions = activeGameWords.sort(() => 0.5 - Math.random());
        if (shuffledQuestions.length > TOTAL_QUESTIONS) {
            shuffledQuestions = shuffledQuestions.slice(0, TOTAL_QUESTIONS);
        }

        scoreEl.innerText = score;
        passBtn.disabled = false;
        passBtn.innerText = "Passen (1)";

        selectionScreen.classList.add('hidden');
        scoreScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        if (ambientSound) {
            ambientSound.volume = 0.3;
            ambientSound.play().catch(e => console.log("Arkaplan sesi çalınamadı:", e));
        }
        showNextQuestion();
    }

    function showNextQuestion() {
        resetState();
        if (questionIndex >= shuffledQuestions.length) {
            return endGame();
        }

        const currentQuestion = shuffledQuestions[questionIndex];
        questionWordEl.innerText = currentQuestion.latin;
        questionCounterEl.innerText = `${questionIndex + 1} / ${shuffledQuestions.length}`;
        const options = generateOptions(currentQuestion);

        answerButtons.forEach((button, index) => {
            button.classList.remove('hidden');
            if (options[index]) {
                button.innerText = options[index].german;
                button.dataset.correct = options[index].correct;
            } else {
                button.classList.add('hidden');
            }
        });
        startTimer();
    }

    function generateOptions(correctAnswer) {
        let options = [{ ...correctAnswer, correct: true }];
        let wrongAnswers = activeGameWords.filter(word => word.latin !== correctAnswer.latin);
        wrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < 3; i++) {
            if (wrongAnswers[i]) {
                options.push({ ...wrongAnswers[i], correct: false });
            }
        }
        return options.sort(() => Math.random() - 0.5);
    }

    function startTimer() {
        clearTimeout(timerInterval);
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        timerBar.offsetHeight;
        timerBar.style.transition = `width ${TIME_PER_QUESTION}s linear`;
        timerBar.style.width = '0%';
        timerInterval = setTimeout(() => {
            questionIndex++;
            showNextQuestion();
        }, TIME_PER_QUESTION * 1000);
    }

    function resetState() {
        clearTimeout(timerInterval);
        answerButtons.forEach(button => {
            button.className = 'btn btn-answer';
            delete button.dataset.correct;
            button.disabled = false;
            button.blur();
        });
    }

    function selectAnswer(e) {
        clearTimeout(timerInterval);
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';

        if (isCorrect) {
            score += 10;
            playSound(correctSound);
        } else {
            score -= 5;
            playSound(wrongSound);
        }
        scoreEl.innerText = score;

        answerButtons.forEach(button => {
            button.disabled = true;
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            }
        });
        if (!isCorrect) {
            selectedBtn.classList.add('wrong');
        }

        setTimeout(() => {
            questionIndex++;
            showNextQuestion();
        }, 1500);
    }

    function passQuestion() {
        if (!passUsed) {
            passUsed = true;
            passBtn.disabled = true;
            passBtn.innerText = "Passen (0)";
            questionIndex++;
            showNextQuestion();
        }
    }

    function endGame() {
        gameScreen.classList.add('hidden');
        scoreScreen.classList.remove('hidden');
        finalScoreEl.innerText = score;
        if (ambientSound) ambientSound.pause();
        playSound(endSound);
    }

    // --- Olay Dinleyici Atamaları ---
    startBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
        populateSelectionScreen();
        checkSelection();
    });
    startPracticeBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', () => {
        scoreScreen.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
        populateSelectionScreen();
        checkSelection();
    });
    passBtn.addEventListener('click', passQuestion);
    exitBtn.addEventListener('click', exitGame);
    answerButtons.forEach(button => button.addEventListener('click', selectAnswer));
    document.querySelectorAll('.btn, .btn-icon').forEach(button => {
        button.addEventListener('click', () => playSound(clickSound));
    });
    helpBtn.addEventListener('click', () => {
        helpModal.classList.add('visible');
    });
    closeModalBtn.addEventListener('click', () => helpModal.classList.remove('visible'));
    window.addEventListener('click', (event) => {
        if (event.target == helpModal) {
            helpModal.classList.remove('visible');
        }
    });
    document.body.addEventListener('click', () => {
        if (welcomeScreen.classList.contains('hidden') === false && ambientSound) {
            ambientSound.volume = 0.3;
            ambientSound.play().catch(e => console.log("Otomatik oynatma engellendi:", e));
        }
    }, { once: true });
});