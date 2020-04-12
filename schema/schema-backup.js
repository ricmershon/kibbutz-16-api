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
  = Pull in GraphQL dependencies
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
 = Pull in MonogoDB schemas
 ===============================================================================
 */

const Item = require('../models/items')
const Member = require('../models/members')

/*
 ===============================================================================
 = GraphQL Types
 ===============================================================================
 */

/*
 = Define ItemType
 */

const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    _id: { type: GraphQLID },
    description: { type: GraphQLString },
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
        description: { type: GraphQLString },
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
        description: { type: GraphQLString },
        quantity: { type: GraphQLInt }
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
