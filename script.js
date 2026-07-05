let questions = [];
let currentQuestion = 0;
let score = 0;

const question = document.getElementById("question");
const bangla = document.getElementById("bangla");
const options = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    questions = data;

    document.getElementById("totalQuestions").innerText = questions.length;

    loadQuestion();
  });

function loadQuestion() {
    const q = questions[currentQuestion];

    document.getElementById("currentQuestion").innerText = currentQuestion + 1;

    question.innerText = q.question;

    // FIX: Only display bangla text if it exists in the JSON, otherwise clear it out
    if (q.bangla) {
        bangla.innerText = q.bangla;
        bangla.style.display = "block"; // Ensures it's visible if it has content
    } else {
        bangla.innerText = "";
        // Optional: bangla.style.display = "none"; // Un-comment this line if you want to completely collapse the HTML space when empty
    }

    options.innerHTML = "";

    q.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerText = option;
        div.onclick = () => checkAnswer(index, div);
        options.appendChild(div);
    });
}

function checkAnswer(selected, element) {
    const all = document.querySelectorAll(".option");

    all.forEach(btn => btn.onclick = null);

    if (selected === questions[currentQuestion].answer) {
        element.classList.add("correct");
        score++;
    } else {
        element.classList.add("wrong");
        all[questions[currentQuestion].answer].classList.add("correct");
    }

    document.getElementById("score").innerText = "Score: " + score;
}

nextBtn.onclick = function() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        document.querySelector(".question-box").innerHTML = `
            <h2>🎉 Exam Finished</h2>
            <h1>${score}/${questions.length}</h1>
            <h2>${Math.round(score / questions.length * 100)}%</h2>
        `;

        nextBtn.style.display = "none";
    }
}