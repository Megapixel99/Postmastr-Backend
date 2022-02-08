const app = require('express').Router();
const connectDB = require("../../../../util/db.js");
const { Package } = require('../../../../models/models.js');
/*function search(query) {
  return models.Packages.find({ $or: [{ Key1: { $regex: `.*${query}.*` } }, { Key2: { $regex: `.*${query}.*` } }, { OtherKey: { $regex: `.*${query}.*` } }] }, null, { limit: 10 }).lean();
}*/

module.exports = app;
