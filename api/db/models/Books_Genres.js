const mongoose = require("mongoose");

const schema = mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Books'
    },
    genre_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Genres'
    },
},
{
    versionKey: false,
    timestamps: false
});

class Books_Genres extends mongoose.Model {

}

schema.loadClass(Books_Genres);
module.exports = mongoose.model("Books_Genres", schema)