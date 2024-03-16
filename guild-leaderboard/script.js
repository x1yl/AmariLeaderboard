// scripts.js

function loadMore() {
    document.getElementById('loading').style.display = 'block';
    fetch('/loadMore')
        .then(response => response.text())
        .then(extra => {
            document.getElementById('leaderboardList').innerHTML += extra;
            document.getElementById('loading').style.display = 'none';
        });
}

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value;
    window.location = '/search/?q=' + query
});
if (window.location.pathname == "/search/") {
    document.getElementById('loading').style.display = 'none';
}
window.addEventListener('scroll', function() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && window.location.pathname !== "/search/") {
        loadMore();
    }
});
