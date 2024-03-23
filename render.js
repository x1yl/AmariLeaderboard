// render.js

function renderLeaderboard(leaderboard, start, end, server) {
  let extra = "";
  let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Guild Leaderboard</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Guild Leaderboard</h1>
                <form id="searchForm">
                    <input type="text" id="searchInput" placeholder="Search...">
                    <button type="submit">Search</button>
                    
                </form><button id="back">Back</button> <!-- Back button -->
                <p>Showing members ${start + 1} to ${end} out of ${
    leaderboard.data.length
  }</p>
                <ol id="leaderboardList">
                <div id="hidden" hidden>${server}</div>`;

  leaderboard.data.slice(start, end).forEach((entry) => {
    extra += `<li>${entry.username} - Level ${entry.level} (${entry.exp} EXP)</li>`;
  });
  html += extra;
  html += `
                </ol>
            </div>
            <div id="loading" class="loading">Loading...</div>
            <script src="/script.js"></script>
        </body>
        </html>`;

  return { html, extra };
}

function renderLeaderboard2(leaderboard, start, end, server) {
  let extra = "";
  let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Guild Leaderboard</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Guild Leaderboard</h1>
                <form id="searchForm">
                    <input type="text" id="searchInput" placeholder="Search...">
                    <button type="submit">Search</button>
                </form>
                <button id="back">Back</button>
                <p>Showing members ${start + 1} to ${end} out of ${
    leaderboard.length
  }</p>
                <ol id="leaderboardList">`;

  leaderboard.slice(start, end).forEach((entry) => {
    extra += `<li>${entry.username} - Level ${entry.level} (${entry.exp} EXP)</li>`;
  });
  html += extra;
  html += `
                </ol>
            </div>
            <div id="loading" class="loading">Loading...</div>
            <script src="/script.js"></script>
        </body>
        </html>
        <div id="hidden" hidden>${server}</div>`;

  return { html, extra };
}

module.exports = { renderLeaderboard, renderLeaderboard2 };
