# SEIR Final Project

## Kibbutz-19
An online community for people to find and share household necessities.

### Designer and Engineer
Ric Mershon

### Background
Kibbutz-19 is a central resource for the finding and offering help during the Covid-19 crisis.

### Accessing the Application

Go to https://kibbutz-19-client.herokuapp.com/.

### Notable Features

Kibbutz-19 is built on a MERN model with GraphQL

#### API

1. MongoDB database with a relatonal model to associte items with members. See Database Schemas section below.
2. Backend developed with Express and Node.js frameworks.
3. API built on GraphQL for lightweight queries integrated with MongoDB via Mongoose.
4. Database deployed to AWS using MongoDB Atlas.
5. Deployed to Heroku.

#### Client

1. Responsive interface built with ReactJS and React Bootstrap.
2. React Router with React Router Dom for easy interface navigation.
3. GraphQL queries performed with Apollo Fetch.
4. Chart.js for data charts.

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
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }
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

### GraphQL Implementation
GraphQL is an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data.

GraphQL resolvers are available for UserType and MemberType.

#### Resolvers for Queries

GraphQL queries perform read funtions.

| Resolver | Description |
| -------- |-------------|
| user | returns a single user by ID |
| users | returns all users |
| member | returns a single member by ID |
| members | returns all members |

All of the items associated with a member can be returned with the following sample GraphQL query:

```
query {
  member(_id: "xxxx") {
    name
    email
    items {
      helpType
      tag
      notes
    }
  }
}
```

#### Resolvers for Mutations

GraphQL mutations peform create, update and delete functions.

| Resolver | Description |
| -------- |-------------|
| addMember | adds a member to the DB |
| updateMember | updates a member's information |
| deleteMember | delete's a member's record from the DB |
| addItem | adds an item to the DB |
| updateItem | updates an item's information |
| deleteItem | delete's an item's record from the DB |

Mutation to create a member:
```
mutation {
  addMember(name: "Peter Parker" email: "spiderman@theavengers.com" phone: "6786406926" zipCode: "41234") {
    _id name email phone zipCode
  }
}
```

### Technologies Used

* [Express](https://expressjs.com/) - backend framework for Node.js.
* [MongoDB](https://www.mongodb.com/) - a general purpose, document-based, distributed database. Database deployed to [AWS](https://aws.amazon.com/) (Amazon Web Services) using MongoDB Atlas.
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_americas_united%20states_search_brand_atlas_desktop&utm_term=mongodb%20atlas&utm_medium=cpc_paid_search&utm_ad=e&gclid=Cj0KCQjwm9D0BRCMARIsAIfvfIaIxOPcBQe1bbgFezxEHNG19vC0mGsB2KWV2SHkLaYK4bIB0M8suPgaAk7KEALw_wcB)- a Cloud-hosted MongoDB service on Amazon Web Services.* [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js.
* [dotenv](https://www.npmjs.com/package/dotenv) - for loading environment variables from a .env file into process.env.
* [ReactJS](https://reactjs.org/) - a JavaScript library for building user interfaces.
* [React Router](https://reacttraining.com/react-router/) - a collection of navigational components taht compose delaratively wiht a React application.
* [React Bootstrap](https://react-bootstrap.github.io/) - for a responsive, mobile-first layout.
* [GraphQL](https://www.graphql.com/) - an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data.
* [Trello board](https://trello.com/b/AKxShGdp/kibbutz-19) - for project management.
* [Chart.js](https://www.chartjs.org/) - a free open-source JavaScript library for data visualization

### Future Development
* User authentication with JSON Web Tokens.
* Search capabilities.
