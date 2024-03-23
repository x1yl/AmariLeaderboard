// guildSelection.js
document.getElementById('serverForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const server = document.getElementById('serverInput').value.trim();
    var regex = /^\d{17,}$/;
    if (server && regex.test(server)) {
        window.location = `/?server=${encodeURIComponent(server)}`;
        return;
    }
    alert('Please make sure to enter the correct guild id')
});

