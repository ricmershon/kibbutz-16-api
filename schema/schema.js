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

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema
} = require("graphql")

const _ = require("lodash")
const Item = require('../models/items')
const Member = require('../models/members')

const itemsArray = require("./items_seed")
const membersArray = require("./members_seed")

// Define ItemType
const ItemType = new GraphQLObjectType(
  {
    name: "Item",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      quantity: { type: GraphQLInt },
      member: {
        type: MemberType,
        resolve(parent, args) {
          return Member.findById(parent.memberId)
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
          console.log(`Looking for item with id: ${args.id}`);
          return Item.findById(args.id)
        }
      },
      member: {
        type: MemberType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          console.log(`Looking for member with id: ${args.id}`);
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
          const member = new Member(args)
          return member.save()
        }
      },
      addItem: {
        type: ItemType,
        args: {
          name: { type: GraphQLString },
          quantity: { type: GraphQLInt },
          memberId: { type: GraphQLID }
        },
        resolve(parent, args) {
          console.log("Item", args);
          const item = new Item(args)
          return item.save()
        }
      },
      updateMember: {
        type: MemberType,
        args: {
          id: { type: GraphQLID },
          firstName: { type: GraphQLString },
          lastName: { type: GraphQLString },
          email: { type: GraphQLString },
          zipCode: { type: GraphQLString }
        },
        resolve(parent, args) {
          console.log(`Updating member: ${args.id}`);
          return Member.findByIdAndUpdate(args.id, args, { new: true })
        }
      },
      updateItem: {
        type: ItemType,
        args: {
          id: { type: GraphQLID },
          name: { type: GraphQLString },
          quantity: { type: GraphQLInt }
        },
        resolve(parent, args) {
          console.log(`Updating item: ${args.id}`);
          return Item.findByIdAndUpdate(args.id, args, { new: true })
        }
      },
      deleteMember: {
        type: MemberType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          console.log(`Deleting member with id: ${args.id}`);
          return Member.findByIdAndRemove(args.id)
        }
      },
      deleteItem: {
        type: ItemType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          console.log(`Deleting item with id: ${args.id}`);
          return Item.findByIdAndRemove(args.id)
        }
      }
    }
  }
)

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
