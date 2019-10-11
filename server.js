let express = require("express");
let mongoose = require("mongoose");
let exphbs = require("express-handlebars");

let app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine("handlebars", exphbs({ layout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/scraperhw", { useNewUrlParser: true });

// require("./routes/routes.js")(app);

app.listen(3000, function () {
    console.log("App running on port 3000!");
});
