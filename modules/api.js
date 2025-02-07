async function fetchQuestions(params) {
  const url = `https://opentdb.com/api.php?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error("No questions available for the selected options.");
    }

    return data.results;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export { fetchQuestions };
