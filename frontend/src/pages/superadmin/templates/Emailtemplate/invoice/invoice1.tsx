import React from 'react';

const InvoiceEmailTemplate = () => {
  return (
    <div className="invoice-template" style={{ backgroundColor: '#f7f7f7', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className="invoice-container" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        {/* Header Section */}
        <div className="header" style={{ padding: '30px 0', backgroundColor: '#2563eb', borderRadius: '6px 6px 0 0', textAlign: 'center' }}>
          <img src="https://i.ibb.co/yLq6zXW/iSuit-1.png" alt="Company Logo" width="150" style={{ display: 'block', margin: '0 auto' }} />
        </div>
        
        {/* Main Content */}
        <div className="content" style={{ padding: '30px' }}>
          <div className="invoice-title" style={{ paddingBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333333', margin: 0 }}>Invoice #INV-12345</h2>
          </div>
          
          <div className="invoice-info" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
            <div className="invoice-from" style={{ flex: '1', minWidth: '250px' }}>
              <p style={{ fontSize: '14px', color: '#999999', marginBottom: '5px' }}>From:</p>
              <div style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
                <strong>Accounting Company Inc.</strong><br />
                123 Business Street<br />
                Business City, ST 12345<br />
                (123) 456-7890<br />
                accounting@example.com
              </div>
            </div>
            
            <div className="invoice-to" style={{ flex: '1', minWidth: '250px' }}>
              <p style={{ fontSize: '14px', color: '#999999', marginBottom: '5px' }}>To:</p>
              <div style={{ fontSize: '16px', lineHeight: '1.5', color: '#333333' }}>
                <strong>Client Company LLC</strong><br />
                456 Client Avenue<br />
                Client City, ST 54321<br />
                (987) 654-3210<br />
                client@example.com
              </div>
            </div>
          </div>
          
          <div className="invoice-summary" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <p style={{ fontSize: '14px', color: '#999999', marginBottom: '10px' }}>Invoice Number:</p>
              <p style={{ fontSize: '16px', color: '#333333', fontWeight: 'bold', margin: 0 }}>INV-12345</p>
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <p style={{ fontSize: '14px', color: '#999999', marginBottom: '10px' }}>Issue Date:</p>
              <p style={{ fontSize: '16px', color: '#333333', fontWeight: 'bold', margin: 0 }}>May 15, 2024</p>
            </div>
            <div style={{ flex: '1', minWidth: '150px' }}>
              <p style={{ fontSize: '14px', color: '#999999', marginBottom: '10px' }}>Due Date:</p>
              <p style={{ fontSize: '16px', color: '#333333', fontWeight: 'bold', margin: 0 }}>June 15, 2024</p>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div className="invoice-items" style={{ marginBottom: '30px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7f7f7' }}>
                  <th style={{ padding: '12px 10px', fontSize: '16px', fontWeight: 'bold', color: '#333333', borderBottom: '1px solid #dddddd', textAlign: 'left' }}>Item</th>
                  <th style={{ padding: '12px 10px', fontSize: '16px', fontWeight: 'bold', color: '#333333', borderBottom: '1px solid #dddddd', textAlign: 'right' }}>Quantity</th>
                  <th style={{ padding: '12px 10px', fontSize: '16px', fontWeight: 'bold', color: '#333333', borderBottom: '1px solid #dddddd', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '12px 10px', fontSize: '16px', fontWeight: 'bold', color: '#333333', borderBottom: '1px solid #dddddd', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee' }}>Accounting Services</td>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>1</td>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>$800.00</td>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>$800.00</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee' }}>Financial Consultation</td>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>2</td>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>$150.00</td>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>$300.00</td>
                </tr>
                
                {/* Invoice Totals */}
                <tr>
                  <td colSpan={3} style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>Subtotal:</td>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>$1,100.00</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>Tax (10%):</td>
                  <td style={{ padding: '12px 10px', fontSize: '16px', color: '#666666', borderBottom: '1px solid #eeeeee', textAlign: 'right' }}>$110.00</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ padding: '12px 10px', fontSize: '18px', fontWeight: 'bold', color: '#333333', textAlign: 'right' }}>Total:</td>
                  <td style={{ padding: '12px 10px', fontSize: '18px', fontWeight: 'bold', color: '#333333', textAlign: 'right' }}>$1,210.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Payment Action */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button style={{ 
              padding: '16px 36px', 
              fontSize: '16px', 
              color: '#ffffff', 
              backgroundColor: '#2563eb',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Pay Invoice
            </button>
          </div>
          
          {/* Payment Details */}
          <div style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.5', color: '#666666' }}>
            <strong>Payment Details:</strong><br />
            Bank: National Bank<br />
            Account Name: Accounting Company Inc.<br />
            Account Number: 123456789<br />
            Routing Number: 987654321
          </div>
          
          <div style={{ fontSize: '16px', lineHeight: '1.5', color: '#666666' }}>
            If you have any questions about this invoice, please contact our accounting department.
          </div>
        </div>
        
        {/* Footer Section */}
        <div style={{ backgroundColor: '#f7f7f7', padding: '20px 0', borderRadius: '0 0 6px 6px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#999999', marginBottom: '20px' }}>
            © 2024 Accounting Platform. All rights reserved.
          </div>
          <div>
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none', margin: '0 10px' }}>Terms of Service</a>
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none', margin: '0 10px' }}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEmailTemplate;
