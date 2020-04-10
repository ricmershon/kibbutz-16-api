/*
 ===============================================================================
 ===============================================================================
 =
 = Final project: Kibbutz-19 API
 = Module: /models/members.js
 = Created: 07-Mar-2020
 = Created by: Ric Mershon
 =
 = Description: Defines Member Mongoose schema.
 =
 ===============================================================================
 ===============================================================================
 */

const mongoose = require('mongoose')
const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    zipCode: { type: String, required: true },
    contactMethod: {
      type: String,
      required: true,
      enum: [ 'Email', 'Text' ],
      default: 'Email'
    }
  }
)

const Member = mongoose.model('Member', memberSchema)
module.exports = Member
