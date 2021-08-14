require('dotenv').config();
const axios = require("axios");
const { JSDOM } = require("jsdom");

(async () => {
  // アニメ公式サイトから次回のタイトルを取得
  const url1 = 'https://www.ytv.co.jp/conan/trailer/index.html';
  const response1 = await axios.get(url1);
  const dom1 = new JSDOM(response1.data);
  const re1 = new RegExp('「(.*)」');
  const nextTitle = dom1.window.document.getElementsByClassName('oa_title')[0].textContent.match(re1)[1];

  // まとめサイトから、タイトルと重要度が記載された部分を取得
  const url2 = 'https://www.miyachiman.com/entry/conan-black';
  const response2 = await axios.get(url2);
  const dom2 = new JSDOM(response2.data);
  const importantTitles = dom2.window.document.getElementsByTagName("h4");

  // 次回のタイトルがまとめサイトに記載されているかを確認
  const titleMatch = Array.prototype.filter.call(importantTitles, function (el) {
    return el.textContent.match(nextTitle);
  });

  // 次回の放送の重要度を表示
  const re2 = new RegExp('【(.*)】');
  const importance = titleMatch.length === 0 ? "重要回ではありません" : '重要度' + titleMatch[0].textContent.match(re2)[0];
  const message = `次回のコナンは「${nextTitle}」${importance}`;
  const slackUrl = 'https://slack.com/api/chat.postMessage';
  const slackMessage = {
    "channel": process.env.CONANSLACKCHANNEL,
    "text": message
  }
  const slackHeader = { headers: { authorization: `Bearer ${process.env.CONANSLACKTOKEN}` } };
  axios.post(slackUrl, slackMessage, slackHeader);
})();
