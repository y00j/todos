const app = require("./index");

app.listen(8080, () => console.log("app is running on port 8080"));
app.set('view engine', 'ejs');