const mongoose = require('mongoose');
const database = require('../settings/database.json');

const db = database['development'];

mongoose.connect(`mongodb+srv://${db.username}:${db.password}@${db.host}/?retryWrites=true&w=majority`);

module.exports = {
    connected: () => {
        const con = mongoose.connection.readyState;
        if(con === 1 || con === 2) {
            return true;
        }

        return false;
    }
}