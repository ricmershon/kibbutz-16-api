# SEIR Final Project

## Kibbutz-16
An online community for people to find and share household necessities.

### Designer and Engineer
Ric Mershon

### Background

### Technologies Used

* [Express](https://expressjs.com/) - backend framework for Node.js.
* [method-override](https://www.npmjs.com/package/method-override) - to use HTTP verbs PUT and DELETE where not otherwise supported by the client.
* [MongoDB](https://www.mongodb.com/) - a general purpose, document-based, distributed database. Database deployed to [AWS](https://aws.amazon.com/) (Amazon Web Services) using MongoDB Atlats.
* [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js.
* [express-session](https://www.npmjs.com/package/express-session) - middleware for creating sessions.
* [dotenv](https://www.npmjs.com/package/dotenv) - for loading environment variables from a .env file into process.env.
* [ReactJS](https://reactjs.org/) - a JavaScript library for building user interfaces.
* [React Bootstrap](https://react-bootstrap.github.io/) for a responsive, mobile-first layout.
* [GraphQL](https://www.graphql.com/) - an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data.
* JSON Web Token (JWT) - an internet standard for creating JSON-based access tokens that assert some number of claims.
* [Trello board](https://trello.com/b/AKxShGdp/kibbutz-19)

### MongoDB Database Shemas

#### Member Shema
```
const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: false },
    contactMethod: {
      type: String,
      required: true,
      enum: ['text', 'email', 'phone'],
      default: 'text'
    },
    zipCode: { type: String, required: true }
  }
)
```
#### Item Schema
```
const itemSchema = new mongoose.Schema(
  {
    helpType: {
      type: String,
      required: true,
      enum: ['offering help', 'requesting help'],
      default: 'requesting help'
    },
    tag: {
      type: String,
      required: true,
      enum: [
        'Baby Supplies',
        'Business Support',
        'Food',
        'Supplies',
        'Toiletries',
        'Volunteer Work'
      ]
    },
    notes: String,
    quantity: Number,
    memberId: String
  }
)
```
#### User Schema
```
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
          throw new Error({error: 'Invalid Email address'})
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})
```
