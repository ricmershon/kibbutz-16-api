/*
 ===============================================================================
 ===============================================================================
 =
 = Final project: Kibbutz-19 API
 = Module: /schema/schema.js
 = Created: 07-Mar-2020
 = Created by: Ric Mershon
 =
 = Description: Define GraphQL schema and queries.
 =
 ===============================================================================
 ===============================================================================
 */

const graphql = require("graphql")
const _ = require("lodash")
const Item = require('../models/items')
const Member = require('../models/members')

// Get GraphQLObjectType function from graphql to define the data type
// structure of queries and their model type.

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema
} = graphql;

const itemsArray = require("./items_seed")
const membersArray = require("./members_seed")

// Define ItemType
const ItemType = new GraphQLObjectType(
  {
    name: "Item",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      quantity: { type: GraphQLInt },
      member: {
        type: MemberType,
        resolve(parent, args) {
          return Owner.findById(parent.memberId)
        }
      }
    })
  }
)

// Define MemberType
const MemberType = new GraphQLObjectType(
  {
    name: "Member",
    fields: () => ({
      id: { type: GraphQLID },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      email: { type: GraphQLString },
      zipCode: { type: GraphQLString },
      items: {
        type: new GraphQLList(ItemType),
        resolve(parent, args) {
          return Item.find({ memberId: parent.id })
        }
      }
    })
  }
)

// Define RootQuery

const RootQuery = new GraphQLObjectType(
  {
    name: "RootQueryType",
    fields: {
      item: {
        type: ItemType,
        args: { id: { type: GraphQLID } },
        resolve(parents, args) {
          return Item.findById(args.id)
        }
      },
      member: {
        type: MemberType,
        args: { id: { type: GraphQLID } },
        resolve(parents, args) {
          return Member.findById(args.id)
        }
      },
      items: {
        type: new GraphQLList(ItemType),
        resolve(parent, args) {
          return Item.find({})
        }
      },
      members: {
        type: new GraphQLList(MemberType),
        resolve(parent, args) {
          return Member.find({})
        }
      }
    }
  }
)

const RootMutation = new GraphQLObjectType(
  {
    name: "Mutation",
    fields: {
      addMember: {
        type: MemberType,
        args: {
          firstName: { type: GraphQLString },
          lastName: { type: GraphQLString },
          email: { type: GraphQLString },
          zipCode: { type: GraphQLString }
        },
        resolve(parent, args) {
          console.log("Member", args);
          Member.create(args, (error, createdMember) => {
            if (error) {
              console.log(`There was an error creating new member record: ${error}`);
            } else {
              console.log(`Member database record created successfully. ${createdMember}`);
            }
          })
        }
      },
      addItem: {
        type: ItemType,
        args: {
          name: { type: GraphQLString },
          description: { type: GraphQLString },
          quantity: { type: GraphQLInt },
          memberId: { type: GraphQLID }
        },
        resolve(parent, args) {
          console.log("Item", args);
          Item.create(args, (error, createdItem) => {
            if (error) {
              console.log(`There was an error creating new item record: ${error}`);
            } else {
              console.log(`Item database record created successfully. ${createdItem}`);
            }
          })
        }
      }
    }
  }
)

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
