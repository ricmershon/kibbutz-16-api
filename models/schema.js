/*
 ===============================================================================
 =
 = Members GraphQL Schema
 =
 ===============================================================================
 */

const graphql = require("graphql")
const _ = require("lodash")

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
          return _.filter(itemsArray, { memberId: parent.id })
        }
      }
    })
  }
)

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
          return _.find(membersArray, { id: parent.memberId })
        }
      }
    })
  }
)

// Define RootQuery

const RootQuery = new GraphQLObjectType ({
  name: "RootQueryType",
  fields: {
    member: {
      type: MemberType,
      args: { id: { type: GraphQLID } },
      resolve(parents, args) {
        return _.find(membersArray, { id: args.id })
      }
    },
    members: {
      type: new GraphQLList(MemberType),
      resolve(parent, args) {
        return membersArray
      }
    },
    item: {
      type: ItemType,
      args: { id: { type: GraphQLID } },
      resolve(parents, args) {
        return _.find(itemsArray, { id: args.id })
      }
    },
    items: {
      type: new GraphQLList(ItemType),
      resolve(parent, args) {
        return itemsArray
      }
    }
  }
})

module.exports = new GraphQLSchema({ query: RootQuery })
