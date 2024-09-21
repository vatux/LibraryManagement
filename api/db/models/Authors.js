const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: String,
    biography: String,
    birth_date: Date
},
{
    versionKey: false,
    timestamps: false
});

class Authors extends mongoose.Model {

}

schema.loadClass(Authors);
module.exports = mongoose.model("Authors", schema)