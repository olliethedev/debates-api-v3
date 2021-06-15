const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const { SQS } = require("aws-sdk");


const app = express()

const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000", process.env.FRONT_END_URL],
  credentials: true
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Query {
      hello: String
    }
  `),
  rootValue: {
    hello: () => {
      return 'Hello world!';
    },
  },
  graphiql: true, //process.env.IS_OFFLINE
}));

app.use("/enqueue", async function(req, res) {
  console.log("enqueue");
  let options = {};

  const sqs = new SQS(options);
  console.log(JSON.stringify(process.env.QUEUE_URL));
  let message;
  try {
    await sqs
      .sendMessage({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: "Hello, world!!!",
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      })
      .promise();

    message = "Message accepted!";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  res.status(200).json({status:message});
});

module.exports = app;