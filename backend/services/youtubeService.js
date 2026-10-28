
async function searchYouTube(mood) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return null;
  }

  const searches = {
    happy: "happy mood uplifting songs",
    sad: "sad emotional songs",
    calm: "relaxing calm music",
    energetic: "high energy motivational songs",
    angry: "rock music for anger release"
  };

  const query = searches[mood] || "popular music";

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: "6",
    q: query,
    key: apiKey,
    safeSearch: "moderate"
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.error?.message || "YouTube API request failed"
    );
  }

  const data = await response.json();

  return (data.items || []).map(item => ({
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    thumbnail: item.snippet.thumbnails?.medium?.url || "",
    emoji: "🎵",
    source: "YouTube API"
  }));
}

module.exports = { searchYouTube };
