import { fetchQuestions } from "./api.js";
import { showResults, saveQuizResult, showQuizHistory } from "./result.js";

const form = document.querySelector(".config-container");
const submitButton = document.querySelector("#submit-button");
const startContainer = document.querySelector(".start-container");
const nextButton = document.querySelector(".next-question-button");
const startButton = document.querySelector(".start-button");
const backButtons = document.querySelectorAll(".go-back-button");
const quizContainer = document.querySelector(".quiz-container");
const scoreStatus = document.querySelector(".score-status");
const timerDisplay = document.querySelector(".time-duration");
const historyContainer = document.querySelector(".quiz-history-container");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let confirmTimeout;
let timeLeft;
let selectedOption = null;

document.addEventListener("DOMContentLoaded", () => {
  showQuizHistory();
});

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  questions = [];
  currentQuestionIndex = 0;
  score = 0;
  selectedOption = null;

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

  if (questions.length > 0) {
    form.style.display = "none";
    historyContainer.style.display = "none";
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

    displayQuestion();
  }
});

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".start-container").style.display = "none";
    document.querySelector(".quiz-history-container").style.display = "block";
    document.querySelector(".quiz-container").style.display = "none";
    document.querySelector(".result-container").style.display = "none";
    document.querySelector(".config-container").style.display = "block";
  });
});

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showResults(score, questions.length);
    saveQuizResult(score, questions);
    showQuizHistory();
  }
});

function displayQuestion() {
  clearTimers();
  timeLeft = 20;

  const questionData = questions[currentQuestionIndex];
  const questionText = document.querySelector(".question-text");
  const answerOptions = document.querySelector(".answer-options");
  const questionStatus = document.querySelector(".question-status");

  scoreStatus.textContent = `Score: ${score} / ${questions.length}`;
  questionStatus.innerHTML = `<b>${currentQuestionIndex + 1}</b> of <b>${
    questions.length
  }</b> Questions`;
  nextButton.style.visibility = "hidden";

  questionText.textContent = questionData.question;
  answerOptions.innerHTML = "";
  selectedOption = null;

  const answers = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];
  answers.sort(() => Math.random() - 0.5);

  answers.forEach((answer) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = answer;
    li.addEventListener("click", () =>
      handleAnswerClick(li, questionData.correct_answer)
    );
    answerOptions.appendChild(li);
  });

  setQuestionTimer();
}

function handleAnswerClick(option, correctAnswer) {
  clearTimeout(confirmTimeout);
  document
    .querySelectorAll(".answer-option")
    .forEach((opt) => opt.classList.remove("selected-answer"));

  selectedOption = option;
  option.classList.add("selected-answer");
  confirmTimeout = setTimeout(() => {
    const isConfirmed = confirm("Confirm answer?");
    if (isConfirmed) {
      option.classList.remove("selected-answer");
      lockAnswer(correctAnswer);
    } else {
      option.classList.remove("selected-answer");
      selectedOption = null;
    }
  }, 2000);
}

function lockAnswer(correctAnswer) {
  clearTimers();

  const answerOptions = document.querySelectorAll(".answer-option");
  answerOptions.forEach((option) => (option.style.pointerEvents = "none"));

  if (selectedOption.textContent === correctAnswer) {
    selectedOption.classList.add("correct");
    score++;
  } else {
    selectedOption.classList.add("incorrect");

    answerOptions.forEach((option) => {
      if (option.textContent === correctAnswer) {
        option.classList.add("correct");
      }
    });
  }

  scoreStatus.textContent = `Score: ${score} / ${questions.length}`;
  nextButton.style.visibility = "visible";
}

function setQuestionTimer() {
  clearInterval(timerInterval);
  timerDisplay.textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;
    } else {
      clearTimers();
      autoFailQuestion();
    }
  }, 1000);
}

function clearTimers() {
  clearInterval(timerInterval);
  clearTimeout(confirmTimeout);
  timeLeft = 20;
  timerDisplay.textContent = `0s`;
}

function autoFailQuestion() {
  const answerOptions = document.querySelectorAll(".answer-option");
  const correctAnswer = questions[currentQuestionIndex].correct_answer;

  answerOptions.forEach((option) => (option.style.pointerEvents = "none"));

  answerOptions.forEach((option) => {
    if (option.textContent === correctAnswer) {
      option.classList.add("correct");
    }
  });

  scoreStatus.textContent = `Score: ${score} / ${questions.length}`;
  nextButton.style.visibility = "visible";
}
