import React from 'react';

const Welcome2Template = () => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Accounting Platform</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
          }
          .header {
            padding: 20px 15px !important;
          }
          .content {
            padding: 20px 15px !important;
          }
          .cta-button {
            display: block !important;
            width: 100% !important;
          }
          .feature-item {
            display: block !important;
            width: 100% !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f8f9fa">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <!-- Header -->
              <tr>
                <td class="header" align="center" bgcolor="#10b981" style="padding: 40px 30px; color: #ffffff;">
                  <img src="https://i.ibb.co/yLq6zXW/iSuit-1.png" alt="Accounting" width="180" style="display: block; margin-bottom: 20px;">
                  <h1 style="margin: 0; font-size: 30px; font-weight: 600; letter-spacing: -0.5px;">Welcome to Accounting</h1>
                  <p style="margin: 10px 0 0; font-size: 18px; font-weight: 300;">Your financial management just got easier</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 40px 30px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding-bottom: 20px; font-size: 17px; line-height: 1.5; color: #333333;">
                        <p style="margin: 0 0 20px;">Hi {{name}},</p>
                        <p style="margin: 0 0 20px;">We're thrilled to welcome you to Accounting! Your account has been successfully created and you're all set to start managing your finances like a pro.</p>
                        <p style="margin: 0 0 20px;">Here are a few things you can do right away:</p>
                      </td>
                    </tr>
                    
                    <!-- Features -->
                    <tr>
                      <td style="padding-bottom: 30px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td class="feature-item" width="33%" align="center" valign="top" style="padding: 0 10px;">
                              <img src="https://via.placeholder.com/80/10b981/ffffff?text=1" alt="" width="80" height="80" style="display: block; margin: 0 auto 15px; border-radius: 50%;">
                              <h3 style="margin: 0 0 10px; font-size: 16px; color: #10b981;">Set Up Your Profile</h3>
                              <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #666666;">Complete your company details and preferences</p>
                            </td>
                            <td class="feature-item" width="33%" align="center" valign="top" style="padding: 0 10px;">
                              <img src="https://via.placeholder.com/80/10b981/ffffff?text=2" alt="" width="80" height="80" style="display: block; margin: 0 auto 15px; border-radius: 50%;">
                              <h3 style="margin: 0 0 10px; font-size: 16px; color: #10b981;">Connect Bank</h3>
                              <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #666666;">Link your accounts for automatic transaction import</p>
                            </td>
                            <td class="feature-item" width="33%" align="center" valign="top" style="padding: 0 10px;">
                              <img src="https://via.placeholder.com/80/10b981/ffffff?text=3" alt="" width="80" height="80" style="display: block; margin: 0 auto 15px; border-radius: 50%;">
                              <h3 style="margin: 0 0 10px; font-size: 16px; color: #10b981;">Create Invoice</h3>
                              <p style="margin: 0; font-size: 14px; line-height: 1.4; color: #666666;">Start billing your clients professionally</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                      <td align="center" style="padding-bottom: 30px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td class="cta-button" align="center" bgcolor="#10b981" style="border-radius: 4px;">
                              <a href="{{loginUrl}}" target="_blank" style="display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">Get Started Now</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Help Section -->
                    <tr>
                      <td style="padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="font-size: 16px; line-height: 1.5; color: #333333;">
                              <h3 style="margin: 0 0 10px; font-size: 18px; color: #333333;">Need Help Getting Started?</h3>
                              <p style="margin: 0 0 15px;">Our support team is here to help you every step of the way:</p>
                              <ul style="margin: 0; padding: 0 0 0 20px; list-style-type: disc;">
                                <li style="margin-bottom: 5px;"><a href="#" style="color: #10b981; text-decoration: none;">Watch our getting started video</a></li>
                                <li style="margin-bottom: 5px;"><a href="#" style="color: #10b981; text-decoration: none;">Browse our knowledge base</a></li>
                                <li><a href="#" style="color: #10b981; text-decoration: none;">Contact support</a></li>
                              </ul>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #333333; color: #ffffff;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 0 10px;">
                              <a href="#"><img src="https://via.placeholder.com/30/ffffff/333333?text=f" alt="Facebook" width="30" height="30" style="display: block; border-radius: 50%;"></a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="#"><img src="https://via.placeholder.com/30/ffffff/333333?text=t" alt="Twitter" width="30" height="30" style="display: block; border-radius: 50%;"></a>
                            </td>
                            <td style="padding: 0 10px;">
                              <a href="#"><img src="https://via.placeholder.com/30/ffffff/333333?text=in" alt="LinkedIn" width="30" height="30" style="display: block; border-radius: 50%;"></a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-bottom: 20px; font-size: 13px; line-height: 1.5;">
                        <p style="margin: 0 0 10px;">© 2024 Accounting Platform. All rights reserved.</p>
                        <p style="margin: 0;">123 Accounting St., Finance City, FC 12345</p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 0 10px; font-size: 13px;">
                              <a href="#" style="color: #ffffff; text-decoration: none;">Privacy Policy</a>
                            </td>
                            <td style="padding: 0 10px; font-size: 13px;">
                              <a href="#" style="color: #ffffff; text-decoration: none;">Terms of Service</a>
                            </td>
                            <td style="padding: 0 10px; font-size: 13px;">
                              <a href="{{unsubscribeUrl}}" style="color: #ffffff; text-decoration: none;">Unsubscribe</a>
                            </td>
                          </tr>
                        </table>
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
      <iframe 
        srcDoc={htmlTemplate}
        title="Welcome Email Template 2 Preview"
        width="100%"
        height="600"
        style={{ border: 'none', borderRadius: '4px' }}
      />
    </div>
  );
};

export default Welcome2Template;
