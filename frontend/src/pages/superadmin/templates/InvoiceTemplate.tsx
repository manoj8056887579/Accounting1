import React from 'react';
import InvoiceEmailTemplate from './Emailtemplate/invoice/invoice1';
import Invoice2Template from './Emailtemplate/invoice/invoice2';
import Invoice3Template from './Emailtemplate/invoice/invoice3';

interface InvoiceTemplateProps {
  selectedIndex: number;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ selectedIndex }) => {
  const renderTemplate = () => {
    switch (selectedIndex) {
      case 0:
        return <InvoiceEmailTemplate />;
      case 1:
        return <Invoice2Template />;
      case 2:
        return <Invoice3Template />;
      default:
        return <InvoiceEmailTemplate />;
    }
  };

  return (
    <div className="invoice-template-wrapper">
      {renderTemplate()}
    </div>
  );
};

export default InvoiceTemplate;
