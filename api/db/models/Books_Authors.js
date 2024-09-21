const mongoose = require("mongoose");

const schema = mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Books'
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Authors'
    },
},
{
    versionKey: false,
    timestamps: false
});

class Books_Authors extends mongoose.Model {

}

schema.loadClass(Books_Authors);
module.exports = mongoose.model("Books_Authors", schema)