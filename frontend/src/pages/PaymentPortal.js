import React, { useState, useEffect } from 'react';
import FintechService from '../services/FintechService';

const PaymentPortal = () => {
  const [activeTab, setActiveTab] = useState('pay');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setIsLoading(true);
      
      const [methods, transactionHistory, invoiceData] = await Promise.all([
        loadPaymentMethods(),
        loadTransactionHistory(),
        loadInvoices()
      ]);

      setPaymentMethods(methods);
      setTransactions(transactionHistory);
      setInvoices(invoiceData);
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    return [
      {
        id: 'card_001',
        type: 'credit_card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      },
      {
        id: 'bank_001',
        type: 'bank_account',
        last4: '1234',
        bankName: 'Agricultural Bank',
        accountType: 'checking',
        isDefault: false
      }
    ];
  };

  const loadTransactionHistory = async () => {
    return [
      {
        id: 'txn_001',
        type: 'payment',
        amount: 2500,
        currency: 'USD',
        description: 'Crop insurance premium',
        status: 'completed',
        date: '2024-02-15',
        recipient: 'AgriGuard Insurance',
        method: 'Credit Card ****4242'
      },
      {
        id: 'txn_002',
        type: 'payment',
        amount: 15000,
        currency: 'USD',
        description: 'Equipment loan payment',
        status: 'completed',
        date: '2024-02-10',
        recipient: 'Farm Credit Services',
        method: 'Bank Transfer'
      },
      {
        id: 'txn_003',
        type: 'refund',
        amount: 750,
        currency: 'USD',
        description: 'Insurance claim payout',
        status: 'completed',
        date: '2024-02-08',
        recipient: 'Your Account',
        method: 'Bank Transfer'
      },
      {
        id: 'txn_004',
        type: 'payment',
        amount: 3200,
        currency: 'USD',
        description: 'Seed and fertilizer purchase',
        status: 'pending',
        date: '2024-02-16',
        recipient: 'AgroSupply Co.',
        method: 'Credit Card ****4242'
      }
    ];
  };

  const loadInvoices = async () => {
    return [
      {
        id: 'inv_001',
        invoiceNumber: 'INV-2024-001',
        amount: 5500,
        dueDate: '2024-03-15',
        status: 'unpaid',
        description: 'Quarterly insurance premium',
        vendor: 'AgriGuard Insurance',
        issueDate: '2024-02-15'
      },
      {
        id: 'inv_002',
        invoiceNumber: 'INV-2024-002',
        amount: 12000,
        dueDate: '2024-03-01',
        status: 'overdue',
        description: 'Equipment maintenance contract',
        vendor: 'Farm Equipment Services',
        issueDate: '2024-01-30'
      },
      {
        id: 'inv_003',
        invoiceNumber: 'INV-2024-003',
        amount: 8500,
        dueDate: '2024-04-10',
        status: 'paid',
        description: 'Crop protection products',
        vendor: 'CropCare Solutions',
        issueDate: '2024-03-10',
        paidDate: '2024-03-12'
      }
    ];
  };

  const renderPaymentTab = () => (
    <div className="space-y-6">
      {/* Quick Payment Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Pay Invoice</h3>
          <p className="text-blue-100 mb-4">Pay outstanding invoices quickly</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50">
            Select Invoice
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Make Payment</h3>
          <p className="text-green-100 mb-4">Send money to suppliers or services</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded font-medium hover:bg-green-50">
            New Payment
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Schedule Payment</h3>
          <p className="text-purple-100 mb-4">Set up recurring or future payments</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded font-medium hover:bg-purple-50">
            Schedule
          </button>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Make a Payment</h3>
        <PaymentForm 
          paymentMethods={paymentMethods}
          onSubmit={(paymentData) => handlePaymentSubmission(paymentData)}
        />
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Outstanding Invoices</h3>
        <div className="space-y-3">
          {invoices.filter(inv => inv.status !== 'paid').map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{invoice.description}</h4>
                <p className="text-sm text-gray-600">{invoice.vendor} • {invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">${invoice.amount.toLocaleString()}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
                <button className="block mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="space-y-6">
      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Paid (This Month)</p>
          <p className="text-2xl font-bold text-green-600">$18,250</p>
          <p className="text-sm text-green-600">+5.2% from last month</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-2xl font-bold text-blue-600">$3,200</p>
          <p className="text-sm text-blue-600">2 transactions</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">Overdue Amount</p>
          <p className="text-2xl font-bold text-orange-600">$12,000</p>
          <p className="text-sm text-orange-600">1 invoice overdue</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Average Payment</p>
          <p className="text-2xl font-bold text-purple-600">$6,083</p>
          <p className="text-sm text-purple-600">Per transaction</p>
        </div>
      </div>

      {/* Transaction Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select className="p-2 border border-gray-300 rounded">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select className="p-2 border border-gray-300 rounded">
              <option>All Types</option>
              <option>Payments</option>
              <option>Refunds</option>
              <option>Transfers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="p-2 border border-gray-300 rounded">
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">ID: {transaction.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.recipient}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'payment' ? '-' : '+'}${transaction.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    {transaction.status === 'completed' && (
                      <button className="text-green-600 hover:text-green-900">Receipt</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMethodsTab = () => (
    <div className="space-y-6">
      {/* Current Payment Methods */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Payment Methods</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add New Method
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {method.type === 'credit_card' ? (
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded mr-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-12 h-8 bg-green-500 rounded mr-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium">
                      {method.type === 'credit_card' 
                        ? `${method.brand.toUpperCase()} •••• ${method.last4}`
                        : `${method.bankName} •••• ${method.last4}`
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {method.type === 'credit_card' 
                        ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                        : `${method.accountType} account`
                      }
                    </p>
                    {method.isDefault && (
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                  <button className="text-red-600 hover:text-red-900 text-sm">Remove</button>
                  {!method.isDefault && (
                    <button className="text-green-600 hover:text-green-900 text-sm">Set Default</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Payment Method Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add Payment Method</h3>
        <AddPaymentMethodForm onSubmit={(methodData) => handleAddPaymentMethod(methodData)} />
      </div>

      {/* Security Information */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Your Payment Information is Secure</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All payment data is encrypted using industry-standard SSL</li>
              <li>• We never store your full credit card numbers</li>
              <li>• Payments are processed by certified PCI DSS compliant providers</li>
              <li>• Two-factor authentication available for added security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const handlePaymentSubmission = async (paymentData) => {
    try {
      const result = await FintechService.processPayment(paymentData, paymentData.provider);
      
      // Add to transaction history
      const newTransaction = {
        id: result.transactionId,
        type: 'payment',
        amount: paymentData.amount,
        currency: paymentData.currency,
        description: paymentData.description,
        status: result.status,
        date: new Date().toISOString(),
        recipient: paymentData.recipient,
        method: paymentData.paymentMethod
      };
      
      setTransactions([newTransaction, ...transactions]);
      
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleAddPaymentMethod = (methodData) => {
    const newMethod = {
      id: `method_${Date.now()}`,
      ...methodData,
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    alert('Payment method added successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Portal</h1>
          <p className="mt-2 text-gray-600">
            Manage payments, track transactions, and handle invoices
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'pay', name: 'Make Payment', icon: '💳' },
              { id: 'transactions', name: 'Transactions', icon: '📊' },
              { id: 'methods', name: 'Payment Methods', icon: '🏦' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'pay' && renderPaymentTab()}
        {activeTab === 'transactions' && renderTransactionsTab()}
        {activeTab === 'methods' && renderMethodsTab()}
      </div>
    </div>
  );
};

// Payment Form Component
const PaymentForm = ({ paymentMethods, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    recipient: '',
    description: '',
    paymentMethodId: '',
    provider: 'stripe'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const paymentData = {
      ...formData,
      amount: parseFloat(formData.amount),
      paymentMethod: paymentMethods.find(m => m.id === formData.paymentMethodId)
    };
    
    onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient *
          </label>
          <input
            type="text"
            required
            value={formData.recipient}
            onChange={(e) => setFormData({...formData, recipient: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Recipient name or company"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method *
          </label>
          <select
            required
            value={formData.paymentMethodId}
            onChange={(e) => setFormData({...formData, paymentMethodId: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select payment method</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.type === 'credit_card' 
                  ? `${method.brand.toUpperCase()} •••• ${method.last4}`
                  : `${method.bankName} •••• ${method.last4}`
                }
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What is this payment for?"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Provider
        </label>
        <div className="flex space-x-4">
          {['stripe', 'razorpay', 'paypal'].map((provider) => (
            <label key={provider} className="flex items-center">
              <input
                type="radio"
                value={provider}
                checked={formData.provider === provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                className="mr-2"
              />
              <span className="capitalize">{provider}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Process Payment
      </button>
    </form>
  );
};

// Add Payment Method Form Component
const AddPaymentMethodForm = ({ onSubmit }) => {
  const [methodType, setMethodType] = useState('credit_card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const methodData = {
      type: methodType,
      ...formData,
      last4: methodType === 'credit_card' 
        ? formData.cardNumber.slice(-4)
        : formData.accountNumber.slice(-4)
    };
    
    onSubmit(methodData);
    
    // Reset form
    setFormData({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      name: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Method Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="credit_card"
              checked={methodType === 'credit_card'}
              onChange={(e) => setMethodType(e.target.value)}
              className="mr-2"
            />
            Credit/Debit Card
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="bank_account"
              checked={methodType === 'bank_account'}
              onChange={(e) => setMethodType(e.target.value)}
              className="mr-2"
            />
            Bank Account
          </label>
        </div>
      </div>

      {methodType === 'credit_card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <input
              type="text"
              required
              value={formData.cardNumber}
              onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Month *
            </label>
            <select
              required
              value={formData.expiryMonth}
              onChange={(e) => setFormData({...formData, expiryMonth: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {String(i + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Year *
            </label>
            <select
              required
              value={formData.expiryYear}
              onChange={(e) => setFormData({...formData, expiryYear: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Year</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() + i}>
                  {new Date().getFullYear() + i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV *
            </label>
            <input
              type="text"
              required
              value={formData.cvv}
              onChange={(e) => setFormData({...formData, cvv: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123"
              maxLength={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Name on card"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name *
            </label>
            <input
              type="text"
              required
              value={formData.bankName}
              onChange={(e) => setFormData({...formData, bankName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your bank name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type *
            </label>
            <select
              required
              value={formData.accountType}
              onChange={(e) => setFormData({...formData, accountType: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number *
            </label>
            <input
              type="text"
              required
              value={formData.accountNumber}
              onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Routing Number *
            </label>
            <input
              type="text"
              required
              value={formData.routingNumber}
              onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Routing number"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Add Payment Method
      </button>
    </form>
  );
};

export default PaymentPortal;
