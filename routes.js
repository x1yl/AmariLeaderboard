// routes.js
const { app } = require("./app");
const { renderLeaderboard, renderLeaderboard2 } = require("./render");
const { index } = require("./main")

const { AmariBot } = require("amaribot.js");
const client = new AmariBot(process.env.Amari_Key);

let guildLeaderboardData = null;
let start = 0;

async function getGuildLeaderboardData(server) {
  if (!guildLeaderboardData) {
    guildLeaderboardData = await client.getRawLeaderboard(server);
  }
  return guildLeaderboardData;
}

app.get("/", async (req, res) => {
  try {
    const server = req.query.server || process.env.server; // Use provided server or default
    if (server !== process.env.server) {
      let start = 0;
      let end = 50;
      const data = await getGuildLeaderboardData(server);
      res.send(renderLeaderboard(data, start, end, server).html); // Render initial leaderboard
      return;
    }
    res.send(index())
  } catch (error) {
    console.error("Error fetching guild leaderboard:", error);
  }
});

app.get("/loadMore", async (req, res) => {
  try {
    start += 50; // Increment start by 50
    end = start * 2;
    const server = req.query.server || process.env.server; // Use provided server or default
    const data = await getGuildLeaderboardData(server);
    res.send(renderLeaderboard(data, start, end).extra);
  } catch (error) {
    console.error("Error fetching guild leaderboard:", error);
    res.status(500).send("An error occurred while fetching guild leaderboard.");
  }
});

app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const server = req.query.server || process.env.server; // Use provided server or default
    const data = await getGuildLeaderboardData(server);
    const searchResults = data.data.filter((entry) =>
      entry.username.toLowerCase().includes(query.toLowerCase())
    );
    res.send(renderLeaderboard2(searchResults, 0, searchResults.length, server).html);
  } catch (error) {
    console.error("Error searching guild leaderboard:", error);
    res
      .status(500)
      .send("An error occurred while searching guild leaderboard.");
  }
});
