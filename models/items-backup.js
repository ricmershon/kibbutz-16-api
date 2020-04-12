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
    description: { type: String, required: true },
    quantity: { type: Number, required: false },
    memberId: String
  }
)

const Item = mongoose.model('Item', itemSchema)
module.exports = Item
