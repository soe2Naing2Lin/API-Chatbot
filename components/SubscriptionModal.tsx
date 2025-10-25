import React from 'react';

interface SubscriptionModalProps {
  onSubscribe: () => void;
}

const subscriptionTiers = [
    { name: 'Weekly', price: '$3.00' },
    { name: 'Monthly', price: '$9.99' },
    { name: 'Yearly', price: '$80.00' },
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onSubscribe }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Limit Reached</h2>
        <p className="text-slate-400 mb-6">
          You've used all your free messages. Upgrade to premium for unlimited access.
        </p>

        <div className="space-y-3 mb-6">
            {subscriptionTiers.map((tier) => (
                 <button
                    key={tier.name}
                    onClick={onSubscribe}
                    className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all duration-200 ease-in-out flex justify-between items-center"
                >
                    <span>{tier.name} Plan</span>
                    <span>{tier.price}</span>
                </button>
            ))}
        </div>

        <p className="text-xs text-slate-500">
            Payments will be processed through the app store. You can cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionModal;
