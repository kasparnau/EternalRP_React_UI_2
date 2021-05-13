const { createConnection } = require("mysql2/promise");

class DB {
  // _connection = null
  // _initialized = null
  // _initializedResolver = null

  constructor() {
    this._initialized = new Promise((resolve) => {
      this._initializedResolver = resolve;
    });
    this.connect();
  }

  get connection() {
    return this._connection;
  }

  get initialized() {
    return this._initialized;
  }

  async connect() {
    this._connection = await createConnection(
      process.env.SQL_URI || "mysql://root:pass@127.0.0.1:3306/sitt"
    );
    this._initializedResolver();
  }
}

const instance = new DB();

module.exports = instance;
