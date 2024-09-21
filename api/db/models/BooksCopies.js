const mongoose = require("mongoose");

const schema = mongoose.Schema({
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Books'
    },
    copy_number: Number,
    is_available: {type: Boolean, default: true},
},
{
    versionKey: false,
    timestamps: false
});

class BooksCopies extends mongoose.Model {

}

schema.loadClass(BooksCopies);
module.exports = mongoose.model("BooksCopies", schema)