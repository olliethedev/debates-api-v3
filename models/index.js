const { composeMongoose } = require('graphql-compose-mongoose');
const { SchemaComposer } = require('graphql-compose');

module.exports.getSchema = () =>{
    const Account = require("../models/Account");
    const Post = require("../models/Post");
    const schemaComposer = new SchemaComposer();
    const customizationOptions = {
      schemaComposer,
    };
    const AccountTC = composeMongoose(Account, customizationOptions);
    const PostTC = composeMongoose(Post, customizationOptions);

    //Set GraphQL Queries from mongoose
    schemaComposer.Query.addFields({
        accountOne: AccountTC.mongooseResolvers.findOne(),
        postOne: PostTC.mongooseResolvers.findOne(),
        postChildMany: PostTC.mongooseResolvers.findMany(),
    });

    //Set GraphQL Mutations from mongoose
    schemaComposer.Mutation.addFields({
        accountCreateOne: AccountTC.mongooseResolvers.createOne(),
        postCreateOne: PostTC.mongooseResolvers.createOne(),
    });
    return schemaComposer.buildSchema();
}