require('dotenv').config();
const axios = require("axios");

const nextFriday = new Date(); // この時点ではまだtoday
if (nextFriday.getDay() > 5) {
  nextFriday.setDate(nextFriday.getDate() - nextFriday.getDay() + 12); // 土曜日以降なら次の金曜
} else {
  nextFriday.setDate(nextFriday.getDate() - nextFriday.getDay() + 5); // 金曜日以前なら今週の金曜
}
const year = ("0000" + nextFriday.getFullYear().toString()).slice(-4);
const month = ("00" + (nextFriday.getMonth() + 1).toString()).slice(-2);
const date = ("00" + nextFriday.getDate().toString()).slice(-2);
const url = `https://kinro.ntv.co.jp/lineup/${year}${month}${date}`;
const slackUrl = 'https://slack.com/api/chat.postMessage';
const slackMessage = {
  "channel": process.env.FRIDAYSLACKCHANNEL,
  "text": url
}
const slackHeader = { headers: { authorization: `Bearer ${process.env.FRIDAYSLACKTOKEN}` } };
axios.post(slackUrl, slackMessage, slackHeader);