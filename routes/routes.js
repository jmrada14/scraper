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
            res.json(data);
        });
    });

    app.get("/saved", (req, res) => {
        db.Article.find({}, (err, data) => {
            let hbsObject = {
                articles: data
            };
            res.render("saved", hbsObject);
        });
    });

    app.get("/drop", (req, res) => {
        db.Article.deleteMany({}, () => {
        });
        res.send("Collection Dropped")

        db.Note.deleteMany({}, function (err, del) {
        });
        res.send("Collection Dropped")
    });

    app.put("/save/:id",  (req, res) => {
        db.Article.findByIdAndUpdate({ _id: req.params.id }, {
            $set: { saved: true }
        }).then( (data) => {
            res.json(data);
        });
    });

    app.put("/delete/:id", (req, res) => {
        db.Article.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: { saved: false }
            }).then((data) => {
            res.json(data);
        });
    });

    app.get("/notes", function (req, res) {
        db.Note.find({}, function (error, data) {
            console.log(data)
            res.json(data);
        });
    });

    app.put("/saved/:id", function (req, res) {
        db.Article.findByIdAndUpdate({ _id: req.params.id }, {
            $set: { saved: true }
        }).then(function (data) {
            res.json(data);
        });
    });

    app.delete("/delete-Article/:id", function (req, res) {
        db.Article.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: { saved: false }
            }).then(function (data) {
            res.json(data);
        });
    });

    //Post Note on saved article and create the Notes collection
    app.post("/articles/:id", function (req, res) {
        console.log(req.body);
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { Note: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("Note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
    //delete Note
    app.delete("/delete-Note/:id", function (req, res) {
        db.Note.findByIdAndRemove(req.params.id, (err, Note) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send();
        });

    });
};

