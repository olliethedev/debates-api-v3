const { composeMongoose } = require('graphql-compose-mongoose');
const { SchemaComposer } = require('graphql-compose');

module.exports.getSchema = () =>{
    const Account = require("../models/Account");
    const schemaComposer = new SchemaComposer();
    const customizationOptions = {
      schemaComposer,
    };
    const AccountTC = composeMongoose(Account, customizationOptions);

    //Set GraphQL Queries from mongoose
    schemaComposer.Query.addFields({
        accountOne: AccountTC.mongooseResolvers.findOne(),
    });

    //Set GraphQL Mutations from mongoose
    schemaComposer.Mutation.addFields({
        accountCreateOne: AccountTC.mongooseResolvers.createOne(),
    });
    return schemaComposer.buildSchema();
}