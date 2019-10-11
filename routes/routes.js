let axios = require("axios");
let cheerio = require("cheerio");
let db = require("../models");


module.exports = function (app) {

    app.get("/scrape",  (req, res) => {
        axios.get("https://www.nytimes.com/section/world").then( (response) => {
            let $ = cheerio.load(response.data);
            $("article").each( (i, element) => {
                let result = {};
                result.title = $(element).children().children("h2").text();
                result.link = $(element).find("a").attr("href");
                result.snip = $(element).children().children("p").text();
                db.Article.create(result)
                    .then(dbArticle => {
                        console.log(dbArticle)
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            res.send("Scrape Complete");
        });
    });

    app.get("/", (req, res) => {
        db.Article.find({}, () => {
            res.render("index");
        })
    });

    app.get("/articles", (req, res) => {
        db.Article.find({}, (err, data) => {
            if(err){return err
            }
            console.log(data)
            res.json(data);
        });
    });

    app.get("/saved", (req, res) => {
        db.Article.find({}, (err, data) => {
            let hbsObject = {
                articles: data
            };
            console.log(data);
            res.render("saved", hbsObject);
        });
    });

    app.get("/drop", (req, res) => {
        db.Article.deleteMany({}, () => {
        });
        res.send("Collection Dropped")
    });

};
