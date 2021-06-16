const { connect } = require('../helpers/databaseHelper');

  module.exports =  async function mongoMiddleware(req, res, next) {
    const connection = await connect(process.env.MONGO_DB_URL);
    console.log("got db")
    const account = require("../models/Account");
    req.dbClient = connection.getClient();
    req.dbConnection = connection;
    req.models = {account};
    return next();
}