
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    snip: {
        type: String,
        required: true
    },

    notes: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },
    saved: {
        type: Boolean,
        default: false
    },

    article: String


});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
