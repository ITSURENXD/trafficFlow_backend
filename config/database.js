const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// database class
class Database {
  constructor(uri) {
    this.uri = uri;
  }

  // connection to the database
  async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log(
        `Connected to the database: ${mongoose.connection.db.databaseName}`
      );
    } catch (err) {
      throw err;
    }
  }

  // disconnect from the database
  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log(
        `Disconnected from the database: ${mongoose.connection.db.databaseName}`
      );
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Database;
