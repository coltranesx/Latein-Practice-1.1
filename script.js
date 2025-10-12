document.addEventListener('DOMContentLoaded', () => {

    const wordList = [
        { latin: 'familia', german: 'Familie' }, { latin: 'dominus', german: 'Hausherr' },
        { latin: 'domina', german: 'Hausherrin' }, { latin: 'servus', german: 'Sklave' },
        { latin: 'serva', german: 'Sklavin' }, { latin: 'est', german: 'ist' },
        { latin: 'amicus', german: 'Freund' }, { latin: 'et', german: 'und' },
        { latin: 'amica', german: 'Freundin' }, { latin: 'ubi?', german: 'wo?' },
        { latin: 'cur?', german: 'warum?' }, { latin: 'nōn', german: 'nicht' },
        { latin: 'hic', german: 'hier' }, { latin: 'iam', german: 'schon' },
        { latin: 'venire', german: 'kommen' }, { latin: 'verbum', german: 'Wort' },
        { latin: 'prospere', german: 'beeilen' }, { latin: 'labōrāre', german: 'arbeiten' },
        { latin: 'pārēre', german: 'folgen' }, { latin: 'clāmāre', german: 'schreien, rufen' },
        { latin: 'cōgitāre', german: 'denken' }, { latin: 'gaudēre', german: 'freuen' },
        { latin: 'sunt', german: 'sind' }, { latin: 'nam', german: 'denn' },
        { latin: 'dēbēre', german: 'schulden' }, { latin: 'hodie', german: 'heute' },
        { latin: 'semper', german: 'immer' }, { latin: 'tum', german: 'dann' },
        { latin: 'sed', german: 'aber' }, { latin: 'nārrāre', german: 'erzählen' },
        { latin: 'placēre', german: 'gefallen' }, { latin: 'gaudium', german: 'Freude' },
        { latin: 'pēgnumen', german: 'Beinamen' }, { latin: 'forum', german: 'Marktplatz' },
        { latin: 'nōmen', german: 'Name' }, { latin: 'nōmen gentile', german: 'Familienname' },
        { latin: 'praenōmen', german: 'Vorname' }
    ];

    const welcomeScreen = document.getElementById('welcome-screen'), gameScreen = document.getElementById('game-screen'),
          scoreScreen = document.getElementById('score-screen'), startBtn = document.getElementById('start-btn'),
          restartBtn = document.getElementById('restart-btn'), helpBtn = document.getElementById('help-btn'),
          passBtn = document.getElementById('pass-btn'), exitBtn = document.getElementById('exit-btn'),
          questionWordEl = document.getElementById('question-word'), answerButtons = document.querySelectorAll('.btn-answer'),
          scoreEl = document.getElementById('score'), questionCounterEl = document.getElementById('question-counter'),
          finalScoreEl = document.getElementById('final-score'), timerBar = document.getElementById('timer-bar'),
          helpModal = document.getElementById('help-modal'), closeModalBtn = document.querySelector('.close-btn'),
          ambientSound = document.getElementById('ambient-sound'), clickSound = document.getElementById('click-sound'),
          correctSound = document.getElementById('correct-sound'), wrongSound = document.getElementById('wrong-sound'),
          endSound = document.getElementById('end-sound');

    const TOTAL_QUESTIONS = 10, TIME_PER_QUESTION = 15;
    let score, questionIndex, shuffledQuestions, passUsed, timerInterval;
    
    function playSound(sound) { if(sound) { sound.currentTime = 0; sound.play().catch(e => console.log("Ses çalınamadı:", e)); } }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    passBtn.addEventListener('click', passQuestion);
    exitBtn.addEventListener('click', exitGame);
    answerButtons.forEach(button => button.addEventListener('click', selectAnswer));
    document.querySelectorAll('.btn, .btn-icon').forEach(button => { button.addEventListener('click', () => playSound(clickSound)); });
    helpBtn.addEventListener('click', () => { helpModal.classList.add('visible'); });

    function closeModal() { helpModal.classList.remove('visible'); }
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { if (event.target == helpModal) { closeModal(); } });

    function exitGame() { clearTimeout(timerInterval); if(ambientSound) ambientSound.pause(); gameScreen.classList.add('hidden'); welcomeScreen.classList.remove('hidden'); }

    function startGame() {
        score = 0; questionIndex = 0; passUsed = false;
        shuffledQuestions = wordList.sort(() => 0.5 - Math.random()).slice(0, TOTAL_QUESTIONS);
        scoreEl.innerText = score;
        passBtn.disabled = false; passBtn.innerText = "Passen (1)";
        welcomeScreen.classList.add('hidden'); scoreScreen.classList.add('hidden'); gameScreen.classList.remove('hidden');
        if(ambientSound) { ambientSound.volume = 0.3; ambientSound.play().catch(e => console.log("Arkaplan sesi çalınamadı:", e)); }
        showNextQuestion();
    }

    function showNextQuestion() {
        resetState();
        if (questionIndex >= TOTAL_QUESTIONS) return endGame();
        const currentQuestion = shuffledQuestions[questionIndex];
        questionWordEl.innerText = currentQuestion.latin;
        document.getElementById('question-counter').innerText = `${questionIndex + 1} / ${TOTAL_QUESTIONS}`;
        const options = generateOptions(currentQuestion);
        answerButtons.forEach((button, index) => { button.innerText = options[index].german; button.dataset.correct = options[index].correct; });
        startTimer();
    }

    function generateOptions(correctAnswer) {
        let options = [{ ...correctAnswer, correct: true }];
        let wrongAnswers = wordList.filter(word => word.latin !== correctAnswer.latin);
        while (options.length < 4) {
            let randomIndex = Math.floor(Math.random() * wrongAnswers.length);
            let randomWrong = wrongAnswers.splice(randomIndex, 1)[0];
            options.push({ ...randomWrong, correct: false });
        }
        return options.sort(() => Math.random() - 0.5);
    }
    
    function startTimer() {
        clearTimeout(timerInterval); timerBar.style.transition = 'none'; timerBar.style.width = '100%';
        timerBar.offsetHeight; timerBar.style.transition = `width ${TIME_PER_QUESTION}s linear`; timerBar.style.width = '0%';
        timerInterval = setTimeout(() => { questionIndex++; showNextQuestion(); }, TIME_PER_QUESTION * 1000);
    }

    // === GÜNCELLENMİŞ FONKSİYON ===
    function resetState() {
        clearTimeout(timerInterval);
        answerButtons.forEach(button => {
            button.className = 'btn btn-answer'; // Stili sıfırla
            delete button.dataset.correct;
            button.disabled = false;
            button.blur(); // HER BİR BUTONDAN ODAKLANMAYI KALDIR
        });
    }

    function selectAnswer(e) {
        clearTimeout(timerInterval);
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';
        if (isCorrect) { score += 10; playSound(correctSound); } else { score -= 5; playSound(wrongSound); }
        scoreEl.innerText = score;
        answerButtons.forEach(button => {
            button.disabled = true;
            if(button.dataset.correct === 'true') { button.classList.add('correct'); }
        });
        selectedBtn.classList.add(isCorrect ? 'correct' : 'wrong');
        setTimeout(() => { questionIndex++; showNextQuestion(); }, 1500);
    }

    function passQuestion() {
        if (!passUsed) {
            passUsed = true; passBtn.disabled = true; passBtn.innerText = "Passen (0)";
            questionIndex++; showNextQuestion();
        }
    }
    
    function endGame() {
        gameScreen.classList.add('hidden'); scoreScreen.classList.remove('hidden'); finalScoreEl.innerText = score;
        if(ambientSound) ambientSound.pause(); playSound(endSound);
    }
    
    document.body.addEventListener('click', () => {
        if (welcomeScreen.classList.contains('hidden') === false && ambientSound) {
            ambientSound.volume = 0.3; ambientSound.play().catch(e => console.log("Otomatik oynatma engellendi:", e));
        }
    }, { once: true });
});