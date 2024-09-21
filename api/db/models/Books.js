const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    published_year: {type: Date, required: true},
    genre: {type: String, required: true},
    isbn: {type: String, required: true},
    quantity: {type: Number, required: true}
},
{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Books extends mongoose.Model {

}

schema.loadClass(Books);
module.exports = mongoose.model("Books", schema)