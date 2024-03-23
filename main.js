function index() {
    index = `<!-- index.html -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Guild Leaderboard</title>
        <link rel="stylesheet" href="/main.css">
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Guild Leaderboard</h1>
            <p>Please enter the server name:</p>
            <form id="serverForm">
                <input type="text" id="serverInput" placeholder="Enter Server Name...">
                <button type="submit">Enter</button>
            </form>
        </div>
        <script src="/guildSelection.js"></script>
    </body>
    </html>
    `
    return index;
}
module.exports = {index}