const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {type: String, required: true},
},
{
    versionKey: false,
    timestamps: false
});

class Genres extends mongoose.Model {

}

schema.loadClass(Genres);
module.exports = mongoose.model("Genres", schema)