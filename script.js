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

    // FIX: Using the correct JSON key 'question_ja' for Japanese
    question.innerText = q.question_ja;

    // FIX: Using the correct JSON key 'question_bn' for Bangla
    if (q.question_bn) {
        bangla.innerText = q.question_bn;
        bangla.style.display = "block"; 
    } else {
        bangla.innerText = "";
    }

    options.innerHTML = "";

    // FIX: Rendering Japanese options (options_ja), but displaying the Bangla translation beneath it
    q.options_ja.forEach((optionJa, index) => {
        const div = document.createElement("div");
        div.className = "option";
        
        // This formats it nicely with Japanese text on top and Bangla text right below it
        const optionBn = q.options_bn[index] ? q.options_bn[index] : "";
        div.innerHTML = `<div><strong>${optionJa}</strong></div><div style="font-size: 0.9em; color: #555; margin-top: 4px;">${optionBn}</div>`;
        
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
