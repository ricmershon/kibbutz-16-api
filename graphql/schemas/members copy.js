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

 const Item = require('../../models/item.js')
 const ItemType = require('./items')

/*
 ===============================================================================
 = GraphQL Types
 ===============================================================================
 */


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

module.exports = MemberType
