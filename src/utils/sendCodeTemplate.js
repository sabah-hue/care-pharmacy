export const sendCodeTemplate = (forgetCode) => {
    return `
    <head>
        <title>Care+ Password Reset</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f9f9f9;
                color: #333333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #7289DA 0%, #5865F2 100%);
                padding: 30px 0;
                text-align: center;
            }
            .logo {
                max-width: 180px;
                margin-bottom: 15px;
            }
            .header-title {
                color: white;
                font-size: 28px;
                font-weight: 600;
                margin: 0;
                padding: 0 20px;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .message {
                font-size: 16px;
                line-height: 1.6;
                color: #555555;
                margin-bottom: 30px;
            }
            .code-container {
                background-color: #f5f7ff;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
                border-left: 4px solid #7289DA;
            }
            .code {
                font-size: 32px;
                font-weight: bold;
                color: #7289DA;
                letter-spacing: 2px;
            }
            .note {
                font-size: 14px;
                color: #888888;
                margin-top: 30px;
            }
            .footer {
                background-color: #f5f7ff;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #888888;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-link {
                display: inline-block;
                margin: 0 8px;
            }
            .button {
                display: inline-block;
                background-color: #7289DA;
                color: white;
                text-decoration: none;
                padding: 12px 30px;
                border-radius: 4px;
                font-weight: 600;
                margin-top: 15px;
                transition: background-color 0.3s;
            }
            .button:hover {
                background-color: #5865F2;
            }
            .divider {
                height: 1px;
                background-color: #eeeeee;
                margin: 30px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://i.ibb.co/Ld2FZzb/care-logo.png" alt="Care+" class="logo">
                <h1 class="header-title">Password Reset Code</h1>
            </div>
            
            <div class="content">
                <p class="message">Hello,</p>
                <p class="message">We received a request to reset your password for your Care+ account. To complete the process, please use the verification code below:</p>
                
                <div class="code-container">
                    <div class="code">${forgetCode}</div>
                </div>
                
                <p class="message">This code will expire in 15 minutes for security reasons. If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
                
                <a href="http://localhost:5173/reset-password" class="button">Reset Password</a>
                
                <p class="note">If the button above doesn't work, you can copy the code and enter it on the password reset page.</p>
                
                <div class="divider"></div>
                
                <p class="message">Thank you for choosing Care+, your trusted healthcare partner.</p>
            </div>
            
            <div class="footer">
                <div class="social-links">
                    <a href="#" class="social-link"><img src="https://i.ibb.co/YPxSFvs/facebook.png" alt="Facebook" width="24"></a>
                    <a href="#" class="social-link"><img src="https://i.ibb.co/Wnxq2Nq/twitter.png" alt="Twitter" width="24"></a>
                    <a href="#" class="social-link"><img src="https://i.ibb.co/VC8vzB3/instagram.png" alt="Instagram" width="24"></a>
                </div>
                <p>© 2023 Care+ Pharmacy. All rights reserved.</p>
                <p>49 Dokki Street, Cairo, Egypt</p>
                <p>
                    <a href="http://localhost:5173/" style="color:#7289DA;text-decoration:none;">Visit our website</a> | 
                    <a href="mailto:support@carepharmacy.com" style="color:#7289DA;text-decoration:none;">Contact Support</a>
                </p>
            </div>
        </div>
    </body>
    `;
}
