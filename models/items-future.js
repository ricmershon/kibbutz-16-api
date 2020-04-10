/*
 ===============================================================================
 ===============================================================================
 =
 = Final project: Kibbutz-19 API
 = Module: /models/items.js
 = Created: 07-Mar-2020
 = Created by: Ric Mershon
 =
 = Description: Defines Item Mongoose schema.
 =
 ===============================================================================
 ===============================================================================
 */

const mongoose = require('mongoose')
const itemSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      required: true,
      enum: ['Requesting help', 'Need help'],
      default: 'Requesting help'
    },
    tag: {
      type: String,
      required: false,
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

const Item = mongoose.model('Item', itemSchema)
module.exports = Item
