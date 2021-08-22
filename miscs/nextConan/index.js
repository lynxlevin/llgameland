require('dotenv').config();
const axios = require("axios");
const { JSDOM } = require("jsdom");

(async () => {
  // アニメ公式サイトから前回のタイトルを取得
  const url1 = `https://www.ytv.co.jp/conan/archive/k${getPrevSaturday()}.html`;
  const response1 = await axios.get(url1);
  const dom1 = new JSDOM(response1.data);
  const re10 = new RegExp(/「(.*)」/); // タイトル部分を取得する
  const re11 = new RegExp(/(.*)（/); // （前編）などを取り除く
  const re12 = new RegExp(/(.*)\(/); // (パーフェクトゲーム)などを取り除く
  const prevTitleForShowing = dom1.window.document.getElementsByClassName('oa_title')[0].textContent;
  let prevTitleForMatching = zenkaku2Hankaku(prevTitleForShowing.match(re10)[1]);
  if (prevTitleForMatching.match(re11)) prevTitleForMatching = prevTitleForMatching.match(re11)[1];
  if (prevTitleForMatching.match(re12)) prevTitleForMatching = prevTitleForMatching.match(re12)[1];

  // まとめサイトから、タイトルと重要度が記載された部分を取得
  const url2 = 'https://www.miyachiman.com/entry/conan-black';
  const response2 = await axios.get(url2);
  const dom2 = new JSDOM(response2.data);
  const importantTitles = dom2.window.document.getElementsByTagName("h4");

  // 前回のタイトルがまとめサイトに記載されているかを確認
  const titleMatch = Array.prototype.filter.call(importantTitles, function (el) {
    return el.textContent.match(prevTitleForMatching);
  });

  // 前回の放送の重要度を表示
  const re2 = new RegExp(/【(.*)】/);
  const importance = titleMatch.length === 0 ? "重要回ではありません" : '重要度' + titleMatch[0].textContent.match(re2)[0];
  const message = `前回のコナンは「${prevTitleForShowing}」${importance}`;
  sendSlack(message);
})();

function sendSlack(message) {
  const slackUrl = 'https://slack.com/api/chat.postMessage';
  const slackMessage = {
    "channel": process.env.CONANSLACKCHANNEL,
    "text": message
  }
  const slackHeader = { headers: { authorization: `Bearer ${process.env.CONANSLACKTOKEN}` } };
  axios.post(slackUrl, slackMessage, slackHeader);
}

function getPrevSaturday() {
  // return '20210814'
  return '20210501'
  const prevSaturday = new Date(); // この時点ではまだtoday
  prevSaturday.setDate(prevSaturday.getDate() - prevSaturday.getDay() - 1)
  const year = ("0000" + prevSaturday.getFullYear().toString()).slice(-4);
  const month = ("00" + (prevSaturday.getMonth() + 1).toString()).slice(-2);
  const date = ("00" + prevSaturday.getDate().toString()).slice(-2);
  return `${year}${month}${date}`;
}

function zenkaku2Hankaku(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}
