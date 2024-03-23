// scripts.js
document.getElementById("back").addEventListener("click", function (event) {
  event.preventDefault();
  window.history.back();
});
function loadMore() {
  document.getElementById("loading").style.display = "block";
  fetch("/loadMore")
    .then((response) => response.text())
    .then((extra) => {
      document.getElementById("leaderboardList").innerHTML += extra;
      document.getElementById("loading").style.display = "none";
    });
}

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    console.log('e')
    const query = document.getElementById("searchInput").value;
    const server = document.getElementById("hidden").innerHTML;
    window.location = "/search?q=" + query + "&server=" + server;
  });
if (window.location.pathname == "/search") {
  document.getElementById("loading").style.display = "none";
}
window.addEventListener("scroll", function () {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight &&
    window.location.pathname !== "/search"
  ) {
    loadMore();
  }
});
