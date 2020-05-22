const monk = require("monk");
const db = monk("localhost/note");

module.exports = db;
