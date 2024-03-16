// index.js
const { app, port } = require("./app");
require("./routes");

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
