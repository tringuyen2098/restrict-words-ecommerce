class Singleton {
    constructor() { }

    // helper
    static instanceDatabase() {
        return require('./database');
    }
}

module.exports = Singleton;