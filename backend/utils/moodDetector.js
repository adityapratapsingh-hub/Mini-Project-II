
const Sentiment = require("sentiment");

const sentiment = new Sentiment();

const moodKeywords = {
  happy: [
    "happy", "happiness", "joy", "joyful", "love",
    "excited", "great", "wonderful", "awesome",
    "smile", "cheerful", "good", "amazing",
    "khush", "maza", "accha", "mast"
  ],

  sad: [
    "sad", "sadness", "cry", "crying", "lonely",
    "alone", "depressed", "heartbroken", "upset",
    "unhappy", "miss", "pain", "dukhi", "udaas"
  ],

  calm: [
    "calm", "peace", "peaceful", "relaxed",
    "relax", "quiet", "meditation", "stress-free",
    "tired", "sleepy", "chill", "shant", "sukoon"
  ],

  energetic: [
    "energetic", "energy", "active", "motivated",
    "motivation", "powerful", "gym", "workout",
    "dance", "party", "focus", "ready", "josh"
  ],

  angry: [
    "angry", "anger", "mad", "furious", "annoyed",
    "irritated", "frustrated", "hate", "rage",
    "gussa", "naraz"
  ]
};

const emojiPatterns = {
  happy: /😀|😃|😄|😁|😊|🥰|😍|😂|🤣|😎|❤️|❤|🥳|🙂/,
  sad: /😢|😭|😞|😔|🥺|💔|☹|🙁/,
  calm: /😌|🧘|🌿|🍃|🌙|😴|🕊/,
  energetic: /⚡|🔥|💪|🏃|🎉|💃|🕺|🚀/,
  angry: /😡|😠|🤬|💢/
};

function detectMood(text) {
  const input = String(text || "").toLowerCase().trim();

  const scores = {
    happy: 0,
    sad: 0,
    calm: 0,
    energetic: 0,
    angry: 0
  };

  // Check emojis first.
  for (const mood of Object.keys(emojiPatterns)) {
    if (emojiPatterns[mood].test(input)) {
      scores[mood] += 5;
    }
  }

  // Check mood-related words.
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    for (const keyword of keywords) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`\\b${escaped}\\b`, "i");

      if (pattern.test(input)) {
        scores[mood] += 2;
      }
    }
  }

  // Use sentiment analysis to help classify unclear text.
  const result = sentiment.analyze(input);

  if (result.score > 0) {
    scores.happy += Math.min(result.score, 3);
  } else if (result.score < 0) {
    scores.sad += Math.min(Math.abs(result.score), 3);
  }

  const maxScore = Math.max(...Object.values(scores));
  let mood = "calm";

  if (maxScore > 0) {
    mood = Object.keys(scores).find(
      key => scores[key] === maxScore
    );
  } else if (result.score > 0) {
    mood = "happy";
  } else if (result.score < 0) {
    mood = "sad";
  }

  return {
    mood,
    sentimentScore: result.score,
    explanation: `Your input was analysed and classified as ${mood}.`
  };
}

module.exports = { detectMood };
