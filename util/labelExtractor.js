const connectDB = require('./db.js');
const path = require('path');
const app = require('express').Router();
const models = require('../models/models.js');

module.exports = async function (capsText) {
  let regex;
  let boxNum = 0;
  // # 1234
  let carrier;
  if (RegExp(/#[^\S\r\n][0-9]{4}/).test(capsText)) {
      regex = RegExp(/#\s[0-9]{4}/);
      boxNum = regex.exec(capsText).toString().substring(2);
  }
  // UNIT 1234
  else if (RegExp(/UNIT\s[0-9]{4}/).test(capsText)) {
      regex = RegExp(/UNIT\s[0-9]{4}/);
      boxNum = regex.exec(capsText).toString().substring(5);
  }
  // #1234
  else if (RegExp(/#[0-9]{4}\s/).test(capsText)) {
      regex = RegExp(/#[0-9]{4}\s/);
      boxNum = regex.exec(capsText).toString().substring(1, 5);
  }
  // PO BOX 1234
  else if (RegExp(/BOX [0-9]{4}/).test(capsText)) {
      regex = RegExp(/BOX [0-9]{4}/);
      boxNum = regex.exec(capsText).toString().substring(4);
  }
  else {
      console.log("box number is missing on label");
  }
  boxNum = Number(boxNum);
  let trackingNum;
  // USPS
  if (capsText.includes("USPS")) {
      //tracking number evals to null after fix, need to figure out a new if condition.
      regex = RegExp(/((\d{4})(\s?\d{4}){4}\s?\d{2})|((\d{2})(\s?\d{3}){2}\s?\d{2})|((\D{2})(\s?\d{3}){3}\s?\D{2})/);
      trackingNum = regex.exec(capsText);
      carrier = "USPS";
      console.log("The USPS tracking number is ".concat(trackingNum[0]));
  }
  // Amazon
  else if (RegExp(/TBA[0-9]{12}/).exec(capsText) != null) {
      regex = RegExp(/TBA[0-9]{12}/);
      trackingNum = regex.exec(capsText);
      carrier = "Amazon";
      console.log("The Amazon tracking number is ".concat(trackingNum));
  }
  // UPS
  else if (RegExp(/1Z.{16,21}/).exec(capsText) != null) {
      regex = RegExp(/1Z.{16,21}/);
      trackingNum = regex.exec(capsText);
      carrier = "UPS";
      console.log("UPS Tracking is ".concat(trackingNum));
  }
  //Fedex
  else if (RegExp(/[0-9]{4}\s[0-9]{4}\s[0-9]{4}|[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{3}/).exec(capsText) != null) {
      trackingNum = RegExp(/[0-9]{4}\s[0-9]{4}\s[0-9]{4}|[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{3}/).exec(capsText);
      console.log(trackingNum[0]);
      carrier = "FEDEX";
      console.log("Fedex Tracking is ".concat(trackingNum[0]));

  } else {
      trackingNum = '0000';
      carrier = "Unknown"
      console.log("Tracking number missing or unsupported");

  }
  console.log(boxNum);
  let trackNo = trackingNum[0].replace(/\s/g, '');;
  let matches = [];
  let match = await connectDB()
      .then(() => {
          return models.Recipient.find({ boxNumber: (Number(boxNum) === NaN ? null : boxNum) });
      }).then((recipient) => {
          console.log("test");
          console.log(typeof boxNum);
          if (!recipient || recipient.length === 0) {
              console.log('No box number was found');
              return matches;
          }
          for (let i = 0; i < recipient.length; i += 1) {
              if (boxNum === recipient[i].boxNumber) {
                  matches.push(recipient[i]);
                  console.log("matches: ".concat(matches));
                  //return recipient
              }
          }
      }).catch((err) => {
          console.error('Unexpected error occured:');
          console.error(err);
      })
  return {
      matches,
      carrier,
      trackNo
  };
};