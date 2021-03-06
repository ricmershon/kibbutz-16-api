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


const Item = mongoose.model('Item', itemSchema)
module.exports = Item
