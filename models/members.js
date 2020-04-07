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
    firstName: String,
    lastName: String,
    email: String,
    zipCode: String,
  }
)

const Member = mongoose.model('Member', memberSchema)
module.exports = Member
