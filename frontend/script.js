
const moodInput = document.getElementById("moodInput");
const analyseBtn = document.getElementById("analyseBtn");
const statusMessage = document.getElementById("statusMessage");
const results = document.getElementById("results");
const moodName = document.getElementById("moodName");
const moodExplanation = document.getElementById("moodExplanation");
const recommendationSource = document.getElementById("recommendationSource");
const songList = document.getElementById("songList");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const emojiButtons = document.querySelectorAll(".emoji-btn");

emojiButtons.forEach(button => {
  button.addEventListener("click", () => {
    const emoji = button.dataset.emoji;

    moodInput.value = `${moodInput.value} ${emoji}`.trim();

    emojiButtons.forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");

    moodInput.focus();
  });
});

analyseBtn.addEventListener("click", analyseMood);

moodInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    analyseMood();
  }
});

tryAgainBtn.addEventListener("click", () => {
  results.hidden = true;
  statusMessage.textContent = "";
  moodInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

async function analyseMood() {
  const text = moodInput.value.trim();

  if (!text) {
    statusMessage.textContent = "Please describe your mood or choose an emoji.";
    moodInput.focus();
    return;
  }

  analyseBtn.disabled = true;
  analyseBtn.textContent = "Analysing your mood...";
  statusMessage.textContent = "Finding music that matches your feelings...";
  results.hidden = true;

  try {
    const response = await fetch("/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to analyse your mood.");
    }

    displayResults(data);
    statusMessage.textContent = "Your recommendations are ready!";
    results.hidden = false;

    results.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    statusMessage.textContent =
      error.message || "Could not connect to the server. Please try again.";
  } finally {
    analyseBtn.disabled = false;
    analyseBtn.innerHTML = 'Find My Music <span>→</span>';
  }
}

function displayResults(data) {
  moodName.textContent =
    data.mood.charAt(0).toUpperCase() + data.mood.slice(1);

  moodExplanation.textContent = data.explanation || "";
  recommendationSource.textContent = `Source: ${data.source || "Recommendations"}`;

  songList.replaceChildren();

  data.songs.forEach(song => {
    const card = document.createElement("article");
    card.className = "song-card";

    const emoji = document.createElement("div");
    emoji.className = "song-emoji";
    emoji.textContent = song.emoji || "🎵";

    const title = document.createElement("h3");
    title.textContent = song.title;

    const artist = document.createElement("p");
    artist.textContent = song.artist || "Music recommendation";

    const link = document.createElement("a");
    link.textContent = "Listen on YouTube ↗";
    link.href = song.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    card.append(emoji, title, artist, link);
    songList.appendChild(card);
  });
}
