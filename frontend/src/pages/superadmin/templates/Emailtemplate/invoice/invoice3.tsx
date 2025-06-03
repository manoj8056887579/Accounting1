import React from 'react';

const Invoice3Template = () => {
  return (
    <div className="invoice-template" style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f0f4f8', 
      padding: '40px 20px', 
      color: '#2d3748' 
    }}>
      <div className="invoice-container" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div className="header" style={{ 
          background: 'linear-gradient(to right, #4f46e5, #7c3aed)', 
          padding: '30px', 
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <img src="https://i.ibb.co/yLq6zXW/iSuit-1.png" alt="Accounting" width="180" style={{ display: 'block', margin: '0 auto 20px' }} />
          <h1 style={{ margin: '0', fontSize: '28px', fontWeight: '700', letterSpacing: '1px' }}>INVOICE</h1>
          <p style={{ margin: '10px 0 0', fontSize: '16px', opacity: '0.9' }}>Professional accounting services</p>
        </div>
        
        {/* Main Content */}
        <div className="main-container" style={{ padding: '40px' }}>
          {/* Invoice Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ flex: '1', minWidth: '200px', marginRight: '20px', marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 5px', fontSize: '20px', color: '#4f46e5', fontWeight: '600' }}>Invoice #INV-87426</h2>
              <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                Issued: <strong style={{ color: '#2d3748' }}>May 27, 2024</strong><br />
                Due: <strong style={{ color: '#2d3748' }}>June 26, 2024</strong>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#7c3aed', fontWeight: '600' }}>AMOUNT DUE</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: '700', color: '#2d3748' }}>$3,520.00</p>
            </div>
          </div>
          
          {/* Addresses */}
          <div style={{ 
            marginBottom: '30px', 
            padding: '20px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h3 style={{ margin: '0 0 15px', fontSize: '16px', color: '#4f46e5', fontWeight: '600' }}>FROM</h3>
                <p style={{ margin: '0 0 5px', fontSize: '15px', fontWeight: '600', color: '#2d3748' }}>Accounting Solutions Inc.</p>
                <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.6', color: '#64748b' }}>
                  789 Finance Avenue<br />
                  San Francisco, CA 94103<br />
                  Phone: (415) 555-7890<br />
                  Email: billing@accountingsolutions.com
                </p>
              </div>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <h3 style={{ margin: '0 0 15px', fontSize: '16px', color: '#4f46e5', fontWeight: '600' }}>TO</h3>
                <p style={{ margin: '0 0 5px', fontSize: '15px', fontWeight: '600', color: '#2d3748' }}>Enterprise Technologies LLC</p>
                <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.6', color: '#64748b' }}>
                  321 Corporate Plaza<br />
                  Chicago, IL 60601<br />
                  Phone: (312) 555-2345<br />
                  Email: accounts@enterprise-tech.com
                </p>
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px', fontSize: '18px', color: '#2d3748', fontWeight: '600' }}>Invoice Items</h3>
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '12px 15px', fontSize: '14px', fontWeight: '600', color: '#4f46e5', border: '1px solid #e2e8f0', borderRight: 'none', borderLeft: 'none', textAlign: 'left' }}>Item</th>
                    <th style={{ padding: '12px 15px', fontSize: '14px', fontWeight: '600', color: '#4f46e5', border: '1px solid #e2e8f0', borderRight: 'none', textAlign: 'center' }}>Quantity</th>
                    <th style={{ padding: '12px 15px', fontSize: '14px', fontWeight: '600', color: '#4f46e5', border: '1px solid #e2e8f0', borderRight: 'none', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '12px 15px', fontSize: '14px', fontWeight: '600', color: '#4f46e5', border: '1px solid #e2e8f0', borderRight: 'none', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Financial Audit Services</td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>1</td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>$2,500.00</td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>$2,500.00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>Financial Consulting (hours)</td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>8</td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>$120.00</td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2d3748', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>$960.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Invoice Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
            <table style={{ width: '40%', minWidth: '250px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '5px 0', fontSize: '14px', color: '#64748b' }}>Subtotal:</td>
                  <td style={{ padding: '5px 0', fontSize: '14px', fontWeight: '600', color: '#2d3748', textAlign: 'right' }}>$3,460.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '5px 0', fontSize: '14px', color: '#64748b' }}>Tax (5%):</td>
                  <td style={{ padding: '5px 0', fontSize: '14px', fontWeight: '600', color: '#2d3748', textAlign: 'right' }}>$173.00</td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ padding: '0', borderBottom: '2px solid #e2e8f0' }}></td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 0', fontSize: '16px', fontWeight: '600', color: '#2d3748' }}>Total:</td>
                  <td style={{ padding: '10px 0', fontSize: '16px', fontWeight: '700', color: '#4f46e5', textAlign: 'right' }}>$3,633.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Call to Action */}
          <div style={{ padding: '0 0 40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <button style={{ 
                backgroundColor: '#4f46e5', 
                padding: '16px 36px', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#ffffff', 
                border: 'none',
                borderRadius: '6px', 
                boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)',
                cursor: 'pointer'
              }}>
                Pay Now
              </button>
            </div>
            
            <div style={{ padding: '0 0 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '18px', color: '#2d3748', fontWeight: '600' }}>Payment Instructions</h3>
              <p style={{ margin: '0 0 15px', fontSize: '14px', lineHeight: '1.6', color: '#64748b' }}>
                Please make payment by the due date using one of the following methods:
              </p>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '15px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#64748b' }}><strong style={{ color: '#2d3748' }}>Bank Transfer:</strong></p>
                <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#64748b' }}>Bank: First National Bank</p>
                <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#64748b' }}>Account Name: Accounting Solutions Inc.</p>
                <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#64748b' }}>Account Number: 123456789</p>
                <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>Reference: INV-87426</p>
              </div>
            </div>
            
            <div style={{ padding: '20px 0 0', textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.6', color: '#64748b' }}>
                If you have any questions about this invoice, please contact us at<br />
                <a href="mailto:billing@accountingsolutions.com" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>billing@accountingsolutions.com</a> or call (415) 555-7890.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ 
          backgroundColor: '#2d3748', 
          padding: '30px', 
          textAlign: 'center', 
          color: '#ffffff' 
        }}>
          <p style={{ margin: '0 0 10px', fontSize: '14px', opacity: '0.9' }}>© 2024 Accounting Solutions Inc. All rights reserved.</p>
          <p style={{ margin: '0', fontSize: '13px', opacity: '0.7' }}>
            <a href="#" style={{ color: '#ffffff', textDecoration: 'none', margin: '0 10px' }}>Privacy Policy</a> |
            <a href="#" style={{ color: '#ffffff', textDecoration: 'none', margin: '0 10px' }}>Terms of Service</a> |
            <a href="#" style={{ color: '#ffffff', textDecoration: 'none', margin: '0 10px' }}>Contact Us</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice3Template;
