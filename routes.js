// routes.js
const { app } = require("./app");
const { renderLeaderboard, renderLeaderboard2 } = require("./render");

const { AmariBot } = require("amaribot.js");
const client = new AmariBot(
  process.env.Amari_Key
);

let guildLeaderboardData = null;
let start = 0;

async function getGuildLeaderboardData() {
  if (!guildLeaderboardData) {
    guildLeaderboardData = await client.getRawLeaderboard(
      process.env.server
    );
  }
  return guildLeaderboardData;
}

app.get("/", async (req, res) => {
  try {
    const data = await getGuildLeaderboardData();
    let start = 0;
    let end = 50;
    res.send(renderLeaderboard(data, start, end).html); // Render initial leaderboard
  } catch (error) {
    console.error("Error fetching guild leaderboard:", error);
    res.status(500).send("An error occurred while fetching guild leaderboard.");
  }
});

app.get("/loadMore", async (req, res) => {
  try {
    start += 50; // Increment start by 50
    end = start * 2;
    const data = await getGuildLeaderboardData(); // Fetch data again to ensure freshness
    res.send(renderLeaderboard(data, start, end).extra);
  } catch (error) {
    console.error("Error fetching guild leaderboard:", error);
    res.status(500).send("An error occurred while fetching guild leaderboard.");
  }
});

app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const data = await getGuildLeaderboardData();
    const searchResults = data.data.filter(entry =>
      entry.username.toLowerCase().includes(query.toLowerCase())
    );
    res.send(renderLeaderboard2(searchResults, 0, searchResults.length).html);
  } catch (error) {
    console.error("Error searching guild leaderboard:", error);
    res.status(500).send("An error occurred while searching guild leaderboard.");
  }
});
