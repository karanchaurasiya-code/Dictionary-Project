const form = document.querySelector("form");
const resultDiv = document.querySelector(".result");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const word = form.elements[0].value.trim();
  if (word) {
    getWordInfo(word.toLowerCase());
  } else {
    resultDiv.innerHTML = `<p style="color:red;">Please enter a word.</p>`;
  }
});

const getWordInfo = async (word) => {
  try {
    resultDiv.innerHTML = "<p>🔎 Searching...</p>";

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    
    if (!response.ok) {
      throw new Error("Word not found");
    }
    
    const data = await response.json();
    
    if (!data[0]?.meanings?.length) {
      throw new Error("No definition found.");
    }

    let definitionData = data[0].meanings[0].definitions[0];

    let phoneticText = data[0].phonetics.find(p => p.text)?.text || "Not available";
    let audioUrl = data[0].phonetics.find(p => p.audio)?.audio;


    resultDiv.innerHTML = `
      <h3><strong>Word:</strong> ${data[0].word}</h3>
      <p><strong>Meaning:</strong> ${definitionData.definition || "Not available"}</p>
      <p><strong>Example:</strong> ${definitionData.example || "No example available"}</p>
      <p><strong>Part of Speech:</strong> ${data[0].meanings[0].partOfSpeech}</p>

    `;
    if (audioUrl) {
      resultDiv.innerHTML += `
        <button class="btn-audio" onclick="playAudio('${audioUrl}')">🔊 Play Sound</button>
      `;
    }

    if (data[0].sourceUrls?.length) {
      resultDiv.innerHTML += `<p><a href="${data[0].sourceUrls[0]}" target="_blank">🔗 Read More</a></p>`;
    }

  } catch (error) {
    resultDiv.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
    console.error(error);
  }
};

const playAudio = (url) => {
  const audio = new Audio(url);
  audio.play();
};