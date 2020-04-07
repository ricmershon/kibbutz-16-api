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
    name: String,
    description: String,
    quantity: Number,
    memberId: String
  }
)

const Item = mongoose.model('Item', itemSchema)
module.exports = Item
