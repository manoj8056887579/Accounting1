import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';



export default function Finance() {
 

  return (

    <div className="space-y-4">
        <h2 className="text-2xl font-bold">Finance Settings</h2>
        <p className="text-gray-600">
            Configure finance-related settings for your application.
        </p>
    
        <div className="grid grid-cols-1 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold">Payment Gateway</h3>
            <p>Configure your payment gateway settings here.</p>
            </div>
    
            <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold">Invoice Settings</h3>
            <p>Manage your invoice settings and templates.</p>
            </div>
    
            <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tax Settings</h3>
            <p>Configure tax rates and rules for your application.</p>
            </div>
        </div>
    </div>
   
  );
}