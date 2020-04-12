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

const Member = require('../../models/members.js')
const MemberType = require('./members')

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

module.exports = ItemType
