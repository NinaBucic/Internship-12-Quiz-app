function showResults(score, max) {
  const resultContainer = document.querySelector(".result-container");
  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  const resultMessage = document.querySelector(".result-message");
  resultMessage.innerHTML = `Final Score: ${score} / ${max}<br />`;

  if (score === max) {
    resultMessage.innerHTML += "Excellent!";
  } else if (score >= max / 2) {
    resultMessage.innerHTML += "Good job!";
  } else {
    resultMessage.innerHTML += "Better luck next time!";
  }
}

function saveQuizResult(score, questions) {
  const today = new Date();
  const quizResult = {
    score: score,
    total: questions.length,
    difficulty: questions[0].difficulty,
    category: questions[0].category,
    date: today.toDateString(),
  };

  let quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
  quizHistory.push(quizResult);
  localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
}

function showQuizHistory() {
  const historyContainer = document.querySelector(".quiz-history");
  historyContainer.innerHTML = "";

  let quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];

  if (quizHistory.length === 0) {
    historyContainer.innerHTML = "<p>No previous data found.</p>";
    return;
  }

  quizHistory.forEach((result) => {
    const resultItem = document.createElement("p");
    resultItem.textContent = `${result.date} - ${result.category} (${result.difficulty}) - Score: ${result.score}/${result.total}`;
    historyContainer.appendChild(resultItem);
  });
}

export { showResults, showQuizHistory, saveQuizResult };
