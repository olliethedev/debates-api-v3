const { graphqlHTTP } = require('express-graphql');
const {getSchema} = require('../models');

module.exports = graphqlHTTP(async(req) =>{
    const context = {db:req.dbClient};
    const graphqlSchema = await getSchema();
    console.log("got schema...")
    return {
      schema: graphqlSchema,
      contextValue: context,
      graphiql: true, //process.env.IS_OFFLINE
    }
})