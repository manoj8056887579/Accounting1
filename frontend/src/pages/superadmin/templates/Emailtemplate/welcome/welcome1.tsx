import React from 'react';

const WelcomeEmailTemplate = () => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Accounting Platform</title>
      <style>
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
          }
          .content-block {
            padding: 10px !important;
          }
          .header-image {
            width: 120px !important;
          }
          .button {
            width: 100% !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f7f7f7;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f7;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <!-- Email Container -->
            <table class="email-container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <!-- Header Section -->
              <tr>
                <td align="center" style="padding: 30px 0; background-color: #2563eb; border-radius: 6px 6px 0 0;">
                  <img src="https://i.ibb.co/yLq6zXW/iSuit-1.png" alt="Company Logo" class="header-image" width="150" style="display: block; border: 0;">
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td class="content-block" style="padding: 30px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding-bottom: 20px; font-size: 24px; font-weight: bold; color: #333333;">
                        Welcome to Our Accounting Platform!
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 20px; font-size: 16px; line-height: 1.5; color: #666666;">
                        Hello {{name}},
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 20px; font-size: 16px; line-height: 1.5; color: #666666;">
                        Thank you for signing up for our accounting platform. We're excited to have you on board and help you manage your finances with ease.
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 20px; font-size: 16px; line-height: 1.5; color: #666666;">
                        Your account has been successfully created and is ready to use. Here's what you can do next:
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 20px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 10px 0; font-size: 16px; line-height: 1.5; color: #666666;">
                              &#8226; Set up your company profile
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; font-size: 16px; line-height: 1.5; color: #666666;">
                              &#8226; Connect your bank accounts
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; font-size: 16px; line-height: 1.5; color: #666666;">
                              &#8226; Create your first invoice
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 30px; font-size: 16px; line-height: 1.5; color: #666666;">
                        If you have any questions, our support team is here to help you get started.
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-bottom: 30px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" class="button" style="border-radius: 4px; background-color: #2563eb;">
                              <a href="{{loginUrl}}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;">Login to Your Account</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer Section -->
              <tr>
                <td style="background-color: #f7f7f7; border-radius: 0 0 6px 6px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="padding: 20px 0; font-size: 14px; color: #999999;">
                        © 2024 Accounting Platform. All rights reserved.
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 0 10px;">
                              <a href="#" style="color: #2563eb; text-decoration: none;">Facebook</a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="#" style="color: #2563eb; text-decoration: none;">Twitter</a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="#" style="color: #2563eb; text-decoration: none;">LinkedIn</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-bottom: 20px; font-size: 14px; line-height: 1.5; color: #999999;">
                        You're receiving this email because you signed up for an account on our platform.
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                        <a href="{{unsubscribeUrl}}" style="color: #999999; text-decoration: underline; font-size: 14px;">Unsubscribe</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return (
    <div>
     
      <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', marginTop: '20px' }}>
        <h3>Template Preview</h3>
        <iframe 
          srcDoc={htmlTemplate}
          title="Welcome Email Template Preview"
          width="100%"
          height="600"
          style={{ border: '1px solid #eee', borderRadius: '4px' }}
        />
      </div>
   
    </div>
  );
};

export default WelcomeEmailTemplate;
