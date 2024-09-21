const mongoose = require("mongoose");

const schema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Books'
    },
    loan_date: {type: Date, required: true},
    return_date: {type: Date, required: true},
    returned_at: {type: String},
    status: {type: String, required: true, enum: ['active', 'returned', 'overdue'], default: 'active'}
},
{
    versionKey: false,
    timestamps: false
});

class Loans extends mongoose.Model {

}

schema.loadClass(Loans);
module.exports = mongoose.model("Loans", schema)