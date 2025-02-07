import { fetchQuestions } from "./api.js";

const form = document.querySelector(".config-container");
const submitButton = document.querySelector("#submit-button");
const startContainer = document.querySelector(".start-container");
const startButton = document.querySelector(".start-button");
const backButtons = document.querySelectorAll(".go-back-button");
const quizContainer = document.querySelector(".quiz-container");

let questions = [];

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const category = document.getElementById("category").value;
  const difficulty = document.getElementById("difficulty").value;
  const type = document.getElementById("game-type").value;

  const params = new URLSearchParams({
    amount: 5,
    difficulty: difficulty,
    type: type,
  });

  if (category) params.append("category", category);

  questions = await fetchQuestions(params);
  console.log(questions);

  if (questions.length > 0) {
    form.style.display = "none";
    startContainer.style.display = "block";
  } else {
    alert(
      "No questions found for the selected options. Try different settings."
    );
  }
});

startButton.addEventListener("click", () => {
  if (questions.length > 0) {
    startContainer.style.display = "none";
    quizContainer.style.display = "block";

    displayQuestion(questions[0], 0);
  }
});

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".start-container").style.display = "none";
    document.querySelector(".quiz-container").style.display = "none";
    document.querySelector(".result-container").style.display = "none";
    document.querySelector(".config-container").style.display = "block";
  });
});

function displayQuestion(questionData, index) {
  const questionText = document.querySelector(".question-text");
  const answerOptions = document.querySelector(".answer-options");

  questionText.textContent = questionData.question;
  answerOptions.innerHTML = "";

  const answers = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];
  answers.sort(() => Math.random() - 0.5);

  answers.forEach((answer) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = answer;
    answerOptions.appendChild(li);
  });
}
