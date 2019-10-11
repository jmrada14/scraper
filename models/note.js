let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let NoteSchema = new Schema({
    author: {
        type: String
    },
    body: {
        type: String
    }
});

let Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
