import React from 'react';

const Welcome3Template = () => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Accounting Platform</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
          }
          .content {
            padding: 20px !important;
          }
          .step {
            display: block !important;
            width: 100% !important;
          }
          .step-separator {
            display: none !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #eff2f7; color: #4a5568;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#eff2f7">
        <tr>
          <td align="center" style="padding: 30px 0;">
            <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0; overflow: hidden;">
              <!-- Header Image -->
              <tr>
                <td align="center" style="padding: 50px 30px;">
                  <img src="https://i.ibb.co/yLq6zXW/iSuit-1.png" alt="Logo" width="120" style="display: block; border-radius: 60px; border: 3px solid #ffffff;">
                  <h1 style="margin: 20px 0 0; font-size: 28px; font-weight: 700; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Welcome to Accounting</h1>
                  <p style="margin: 10px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">We're excited to have you on board!</p>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td class="content" bgcolor="#ffffff" style="padding: 40px; border-radius: 0 0 12px 12px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <!-- Welcome Message -->
                    <tr>
                      <td style="padding-bottom: 30px;">
                        <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #4a5568;">Hello {{name}},</h2>
                        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #4a5568;">Thank you for choosing our accounting platform for your business needs. We're committed to helping you manage your finances efficiently and effectively.</p>
                      </td>
                    </tr>
                    
                    <!-- Account Info -->
                    <tr>
                      <td style="padding-bottom: 30px; background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 15px;">
                              <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #4a5568;">Your Account Information</h3>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td width="30%" style="padding: 8px 0; font-size: 14px; color: #718096;">Email:</td>
                                  <td width="70%" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #4a5568;">{{email}}</td>
                                </tr>
                                <tr>
                                  <td width="30%" style="padding: 8px 0; font-size: 14px; color: #718096;">Account Type:</td>
                                  <td width="70%" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #4a5568;">{{accountType}}</td>
                                </tr>
                                <tr>
                                  <td width="30%" style="padding: 8px 0; font-size: 14px; color: #718096;">Subscription:</td>
                                  <td width="70%" style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #4a5568;">{{subscription}}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Getting Started Steps -->
                    <tr>
                      <td style="padding-bottom: 30px;">
                        <h3 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #4a5568;">Getting Started is Easy</h3>
                        
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td class="step" width="30%" align="center" valign="top" style="padding: 0 10px;">
                              <div style="background-color: #667eea; color: #ffffff; width: 40px; height: 40px; line-height: 40px; border-radius: 20px; margin: 0 auto 15px; font-size: 18px; font-weight: 600;">1</div>
                              <h4 style="margin: 0 0 10px; font-size: 16px; font-weight: 600; color: #4a5568;">Complete Profile</h4>
                              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #718096;">Add your business details and preferences</p>
                            </td>
                            
                            <td class="step-separator" width="5%" align="center" valign="top" style="padding-top: 20px;">
                              <div style="width: 100%; height: 2px; background-color: #e2e8f0;"></div>
                            </td>
                            
                            <td class="step" width="30%" align="center" valign="top" style="padding: 0 10px;">
                              <div style="background-color: #667eea; color: #ffffff; width: 40px; height: 40px; line-height: 40px; border-radius: 20px; margin: 0 auto 15px; font-size: 18px; font-weight: 600;">2</div>
                              <h4 style="margin: 0 0 10px; font-size: 16px; font-weight: 600; color: #4a5568;">Import Data</h4>
                              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #718096;">Connect your accounts or upload existing data</p>
                            </td>
                            
                            <td class="step-separator" width="5%" align="center" valign="top" style="padding-top: 20px;">
                              <div style="width: 100%; height: 2px; background-color: #e2e8f0;"></div>
                            </td>
                            
                            <td class="step" width="30%" align="center" valign="top" style="padding: 0 10px;">
                              <div style="background-color: #667eea; color: #ffffff; width: 40px; height: 40px; line-height: 40px; border-radius: 20px; margin: 0 auto 15px; font-size: 18px; font-weight: 600;">3</div>
                              <h4 style="margin: 0 0 10px; font-size: 16px; font-weight: 600; color: #4a5568;">Start Using</h4>
                              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #718096;">Create invoices, track expenses, and more</p>
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
                            <td align="center" bgcolor="#667eea" style="border-radius: 6px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
                              <a href="{{loginUrl}}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">Access Your Account</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Additional Resources -->
                    <tr>
                      <td style="border-top: 1px solid #e2e8f0; padding-top: 30px;">
                        <h3 style="margin: 0 0 15px; font-size: 18px; font-weight: 600; color: #4a5568;">Resources to Help You Succeed</h3>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="20" valign="top" style="padding: 5px 10px 5px 0;">
                              <img src="https://via.placeholder.com/20/667eea/ffffff?text=→" alt="" width="20" height="20" style="display: block;">
                            </td>
                            <td style="padding: 5px 0; font-size: 14px; line-height: 1.5; color: #4a5568;">
                              <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">Getting Started Guide</a> - A step-by-step walkthrough of key features
                            </td>
                          </tr>
                          <tr>
                            <td width="20" valign="top" style="padding: 5px 10px 5px 0;">
                              <img src="https://via.placeholder.com/20/667eea/ffffff?text=→" alt="" width="20" height="20" style="display: block;">
                            </td>
                            <td style="padding: 5px 0; font-size: 14px; line-height: 1.5; color: #4a5568;">
                              <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">Video Tutorials</a> - Watch and learn how to use the platform
                            </td>
                          </tr>
                          <tr>
                            <td width="20" valign="top" style="padding: 5px 10px 5px 0;">
                              <img src="https://via.placeholder.com/20/667eea/ffffff?text=→" alt="" width="20" height="20" style="display: block;">
                            </td>
                            <td style="padding: 5px 0; font-size: 14px; line-height: 1.5; color: #4a5568;">
                              <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">Support Center</a> - Find answers to common questions
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
                <td bgcolor="#f8fafc" style="padding: 30px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #718096;">
                  <p style="margin: 0 0 15px;">© 2024 Accounting Platform. All rights reserved.</p>
                  <p style="margin: 0 0 15px;">
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px;">Help Center</a>
                  </p>
                  <p style="margin: 0;">
                    You're receiving this email because you signed up for an account. 
                    <a href="{{unsubscribeUrl}}" style="color: #667eea; text-decoration: underline;">Unsubscribe</a>
                  </p>
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
        title="Welcome Email Template 3 Preview"
        width="100%"
        height="600"
        style={{ border: 'none', borderRadius: '4px' }}
      />
    </div>
  );
};

export default Welcome3Template;
