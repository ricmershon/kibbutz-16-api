/*
 ===============================================================================
 ===============================================================================
 =
 = Final project: Kibbutz-19 API
 = Module: schema.js
 = Created: 07-Apr-2020
 = Created by: Ric Mershon
 =
 = Description: Defines GraphQL schema, queries and mutations.
 =
 ===============================================================================
 ===============================================================================
 */

/*
  ===============================================================================
  = GraphQL dependencies
  ===============================================================================
  */

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = require("graphql")

/*
 ===============================================================================
 = MonogoDB schemas
 ===============================================================================
 */

const User = require('../models/users')
const Item = require('../models/items')
const Member = require('../models/members')

/*
 ===============================================================================
 = GraphQL Types
 ===============================================================================
 */

const TokenType = new GraphQLObjectType({
  name: "Token",
  fields: () => ({
    _id: { type: GraphQLID },
    token: { type: GraphQLString },
  })
})

  /*
   = Define UserType
   */

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    tokens: {
      type: GraphQLList (TokenType),

      // This resolve method find and returns and array
      // of all the tokens associated with a user
      resolve(parent, args) {
        console.log("resolving tokens");
        user = User.findById(parent)
      }
    }
  })  // End fields
})    // End ItemType


/*
 = Define ItemType
 */

const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    _id: { type: GraphQLID },
    helpType: { type: GraphQLString },
    tag: { type: GraphQLString },
    notes: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    member: {
      type: MemberType,

      // This resolve method returns the member
      // that owns the item.
      resolve(parent, args) {
        return Member.findById(parent.memberId)
      }
    }
  })  // End fields
})    // End ItemType

/*
 = Define MemberType
 */

const MemberType = new GraphQLObjectType({
  name: "Member",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    password: { type: GraphQLString},
    zipCode: { type: GraphQLString },
    items: {
      type: new GraphQLList(ItemType),

      // This resolve() method finds and returns an array
      // of all the items associated with the member
      resolve(parent, args) {
        return Item.find({ memberId: parent._id })
      }
    }
  })  // End fields
})    // End MemberType

/*
 ===============================================================================
 = GraphQL RootQuery for Read operations
 ===============================================================================
 */

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {

    // Returns tokens
    tokens: {
      type: TokenType,
      args: { _id: { type: GraphQLID }},
      resolve(parents, args) {
        const user = User.findById(args._id)
        console.log(user);
      }
    },

    // Returns a single user
    user: {
      type: UserType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args._id)
      }
    },

    // Returns a single item
    item: {
      type: ItemType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return Item.findById(args._id)
      }
    },

    // Returns a single member
    member: {
      type: MemberType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return Member.findById(args._id)
      }
    },

    // Returns all items
    items: {
      type: new GraphQLList(ItemType),
      resolve(parent, args) {
        return Item.find({})
      }
    },

    // Returns all members
    members: {
      type: new GraphQLList(MemberType),
      resolve(parent, args) {
        return Member.find({})
      }
    }
  } // End fields
})  // End RouteQuery

/*
 ===============================================================================
 = GraphQL Mutation for Create, Update and Delete operations
 ===============================================================================
 */

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {

    // Adds a user
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent,args) {
        try {
          const user = new User(args)
          const data = await user.save()
          const token = await user.generateAuthToken(data)
          console.log(token);
          console.log(data.tokens);
          return (data)
        } catch (error) {
          console.log(error);
        }
      }
    },

    // Logs in a user
    loginUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parents, args) {
        try {
          const user = await User.findByCredentials(args.email, args.password)
          if (!user) {
            console.log('Login failed! Check authenticare credentials');
            return('Login failed.')
          }
          const token = await user.generateAuthToken()
          return({user, token})
        } catch (error) {
          console.log(error);
        }
      }
    },

    // Adds a member
    addMember: {
      type: MemberType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        password: { type: GraphQLString },
        zipCode: { type: GraphQLString }
      },
      resolve(parent, args) {
        const member = new Member(args)
        return member.save()
      }
    },

    // Add an item
    addItem: {
      type: ItemType,
      args: {
        helpType: { type: GraphQLString },
        tag: { type: GraphQLString },
        notes: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        memberId: { type: GraphQLID }
      },
      resolve(parent, args) {
        const item = new Item(args)
        return item.save()
      }
    },

    // Update a member
    updateMember: {
      type: MemberType,
      args: {
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        zipCode: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log(`Updating member: ${args._id}`);
        return Member.findByIdAndUpdate(args._id, args, { new: true })
      }
    },

    // Update an item
    updateItem: {
      type: ItemType,
      args: {
        _id: { type: GraphQLID },
        helpType: { type: GraphQLString },
        tag: { type: GraphQLString },
        notes: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        memberId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Item.findByIdAndUpdate(args._id, args, { new: true })
      }
    },

    // Delete a member
    deleteMember: {
      type: MemberType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return Member.findByIdAndRemove(args._id)
      }
    },

    // Delete an item
    deleteItem: {
      type: ItemType,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return Item.findByIdAndRemove(args._id)
      }
    }
  } // End fields
})  // End Mutation

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
