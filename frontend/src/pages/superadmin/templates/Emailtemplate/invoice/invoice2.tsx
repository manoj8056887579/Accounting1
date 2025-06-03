import React from 'react';

const Invoice2Template = () => {
  return (
    <div className="invoice-template" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", backgroundColor: '#f4f5f7', padding: '30px', color: '#333333' }}>
      <div className="invoice-container" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        {/* Header with logo and invoice label */}
        <div className="header" style={{ padding: '30px', backgroundColor: '#10b981', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="header-left" style={{ marginBottom: '10px' }}>
            <img src="https://i.ibb.co/yLq6zXW/iSuit-1.png" alt="Company Logo" width="150" style={{ display: 'block' }} />
          </div>
          <div className="header-right" style={{ color: '#ffffff', textAlign: 'right' }}>
            <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>INVOICE</h1>
            <p style={{ margin: '5px 0 0', fontSize: '14px' }}>#INV-20240526</p>
          </div>
        </div>
        
        {/* Invoice Content */}
        <div className="invoice-container" style={{ padding: '40px' }}>
          {/* Invoice Info */}
          <div style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: '#666666', fontWeight: '600' }}>FROM:</h3>
              <p style={{ margin: '0 0 5px', fontSize: '16px', fontWeight: '600', color: '#333333' }}>Accounting Platform Inc.</p>
              <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#666666' }}>123 Financial Street</p>
              <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#666666' }}>New York, NY 10001</p>
              <p style={{ margin: '0', fontSize: '14px', color: '#666666' }}>accounts@accounting-platform.com</p>
            </div>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: '#666666', fontWeight: '600' }}>BILL TO:</h3>
              <p style={{ margin: '0 0 5px', fontSize: '16px', fontWeight: '600', color: '#333333' }}>Client Solutions LLC</p>
              <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#666666' }}>456 Commerce Avenue</p>
              <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#666666' }}>Boston, MA 02108</p>
              <p style={{ margin: '0', fontSize: '14px', color: '#666666' }}>finance@client-solutions.com</p>
            </div>
          </div>
          
          {/* Invoice Meta */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
              <div style={{ flex: '1', minWidth: '100px', padding: '15px', borderRight: '1px solid #e9ecef' }}>
                <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#666666' }}>INVOICE DATE</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333333' }}>May 26, 2024</p>
              </div>
              <div style={{ flex: '1', minWidth: '100px', padding: '15px', borderRight: '1px solid #e9ecef' }}>
                <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#666666' }}>DUE DATE</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#333333' }}>June 25, 2024</p>
              </div>
              <div style={{ flex: '1', minWidth: '100px', padding: '15px' }}>
                <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#666666' }}>AMOUNT DUE</p>
                <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#10b981' }}>$2,475.00</p>
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div style={{ marginBottom: '30px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 15px', fontSize: '14px', fontWeight: '600', color: '#666666', borderBottom: '2px solid #e9ecef', textAlign: 'left' }}>DESCRIPTION</th>
                  <th style={{ padding: '12px 15px', fontSize: '14px', fontWeight: '600', color: '#666666', borderBottom: '2px solid #e9ecef', textAlign: 'center' }}>QTY</th>
                  <th style={{ padding: '12px 15px', fontSize: '14px', fontWeight: '600', color: '#666666', borderBottom: '2px solid #e9ecef', textAlign: 'right' }}>UNIT PRICE</th>
                  <th style={{ padding: '12px 15px', fontSize: '14px', fontWeight: '600', color: '#666666', borderBottom: '2px solid #e9ecef', textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333333', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Monthly Accounting Services</td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333333', borderBottom: '1px solid #e9ecef', textAlign: 'center' }}>1</td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333333', borderBottom: '1px solid #e9ecef', textAlign: 'right' }}>$1,500.00</td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333333', borderBottom: '1px solid #e9ecef', textAlign: 'right' }}>$1,500.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333333', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Tax Preparation Services</td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333333', borderBottom: '1px solid #e9ecef', textAlign: 'center' }}>3</td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333333', borderBottom: '1px solid #e9ecef', textAlign: 'right' }}>$250.00</td>
                  <td style={{ padding: '15px', fontSize: '14px', color: '#333333', borderBottom: '1px solid #e9ecef', textAlign: 'right' }}>$750.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Invoice Summary */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '40%', minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px' }}>
                  <span style={{ color: '#666666' }}>Subtotal:</span>
                  <span style={{ color: '#333333' }}>$2,250.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px' }}>
                  <span style={{ color: '#666666' }}>Tax (10%):</span>
                  <span style={{ color: '#333333' }}>$225.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0 5px', fontSize: '16px', fontWeight: '600', borderTop: '2px solid #e9ecef' }}>
                  <span style={{ color: '#333333' }}>Total:</span>
                  <span style={{ color: '#10b981' }}>$2,475.00</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Button */}
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <button style={{ 
              backgroundColor: '#10b981', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '15px 30px', 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#ffffff',
              cursor: 'pointer'
            }}>
              Pay Invoice
            </button>
          </div>
          
          {/* Payment Info */}
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '6px', fontSize: '14px', color: '#666666' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '600', color: '#333333' }}>Payment Details</h3>
            <p style={{ margin: '0 0 5px' }}>Bank: First National Bank</p>
            <p style={{ margin: '0 0 5px' }}>Account Name: Accounting Platform Inc.</p>
            <p style={{ margin: '0 0 5px' }}>Account Number: 87654321</p>
            <p style={{ margin: '0' }}>Reference: INV-20240526</p>
          </div>
          
          {/* Notes */}
          <div style={{ padding: '30px 0 0' }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#666666', fontStyle: 'italic' }}>Thank you for your business. Please make payment by the due date.</p>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '20px 0', fontSize: '12px', color: '#666666', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px' }}>© 2024 Accounting Platform Inc. All rights reserved.</p>
          <div>
            <a href="#" style={{ color: '#10b981', textDecoration: 'none', margin: '0 10px' }}>Terms</a>
            <a href="#" style={{ color: '#10b981', textDecoration: 'none', margin: '0 10px' }}>Privacy</a>
            <a href="#" style={{ color: '#10b981', textDecoration: 'none', margin: '0 10px' }}>Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice2Template;
