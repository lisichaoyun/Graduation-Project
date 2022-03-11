/* mail.js文件，发送邮件模块*/
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  secureConnection: true, // use SSL
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: "1364546652@qq.com", //其他的不要动，更改邮箱
    pass: "tqpfzqkpuaymhaic", // QQ邮箱需要使用的授权码
  },
});
function sendMail(mail, code) {
  // 设置邮件内容（谁发送什么给谁）
  let mailOptions = {
    from: '" 作者 " <1364546652@qq.com>', // 发件人
    to: mail, // 收件人
    subject: "邮箱验证", // 主题
    text: `您的验证码是 ${code},有效期5分钟。`, // 直接发送文本
    //html: "<b>验证功能</b>",       // 也可以发送html格式文本
    // 下面是发送附件，不需要就注释掉
    /*     attachments: [
        {
          filename: "test.md",
          path: "./test.md",
        },
        {
          filename: "content",
          content: "发送内容",
        },
      ], */
  };

  //这里返回一个异步操作
  return new Promise((resolve, reject) => {
    // 使用先前创建的传输器的 sendMail 方法传递消息对象
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject(new Error('发送邮件模块出现错误'));
      else {
        // console.log(`Message: ${info.messageId}`);
        // console.log(`sent: ${info.response}`);
        resolve();
      }
    });
  });
}
module.exports = { sendMail }; //最后暴露一个sendMail方法
