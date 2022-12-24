const {transporter} = require('./node_mailer_setup')
const adminEmail = process.env.EMAIL
const moment = require('moment')

const emailResetPassword = async(email, token) =>{
    const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}`;
    transporter.sendMail({
        to: email,
        from: adminEmail,
        subject: '[Warehouse Protection] - Email Reset Password.',
        text: `Chào ${email},
        Để đặt lại mật khẩu của bạn, vui lòng truy cập vào đường dẫn sau đây: \n ${resetPasswordUrl}
        Hạn đặt lại mật khẩu: ${moment().add(parseInt(process.env.RESET_PASSWORD_EXPIRATION_MINUTES), 'minutes').format('YYYY-MM-DD LTS')}
        Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
        
        Xin cảm ơn!
        Admin Warehouse Protection
        `
    }, 
    (error) => {
        if (error) {
          return console.log("There was an error: " + error);
        }
        console.log("Email sent successfully");
      }
    )
}

module.exports= {
    emailResetPassword
}