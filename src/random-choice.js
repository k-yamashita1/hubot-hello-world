# Description
#   A Hubot script that random choice
#
# Configuration:
#   None
#
# Author:
#   k-yamashita

import request from 'request';

module.exports = (robot) => {
  robot.respond(/.*(random|抽選|選ぶ).*/, (msg) => {
    const url = 'https://slack.com/api/channels.list?token=' + process.env.HUBOT_SLACK_TOKEN;

    // チャンネル一覧を取得
    request(url, (err, res, body) => {
      // msg.message.room で現在の channel 名が取れる
      const channel = findChannel(JSON.parse(body).channels, msg.message.room);
      console.log('Channel found');
      console.log(channel);

      // bot 自身を除外して抽選
      const botId = robot.adapter.self.id;
      const filterdMembers = channel.members.filter((member) => {
        return member !== botId;
      });
      console.log(filterdMembers);
      const member = msg.random(filterdMembers);

      msg.send('選ばれたのは、 <@' + member + '> でした :tea:');
    });
  });
}

function findChannel(channels, targetName) {
  for (const channel of channels) {
    if (channel.name === targetName) {
      return channel;
    }
  }
  return null;
};