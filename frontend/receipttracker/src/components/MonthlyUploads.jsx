'use client';

import { useState } from 'react';
import UploadBankStatement from './UploadBankStatement';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthlyUploads({ onAllUploads }) {
  // Store transactions per month in an object keyed by month name
  const [monthlyTransactions, setMonthlyTransactions] = useState({});

  // Called when a month upload succeeds
  const handleMonthSuccess = (month) => (transactions) => {
    setMonthlyTransactions(prev => {
      const updated = { ...prev, [month]: transactions };
      onAllUploads && onAllUploads(updated); // send all monthly txns to parent for tax calc
      return updated;
    });
  };

  const handleClearMonth = (month) => {
    setMonthlyTransactions(prev => {
      const updated = { ...prev };
      delete updated[month];
      onAllUploads && onAllUploads(updated);
      return updated;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {MONTHS.map((month) => (
        <div key={month} className="border rounded-lg p-4 bg-white dark:bg-zinc-900 shadow-md">
          <h3 className="font-semibold text-center mb-2">{month}</h3>
          <UploadBankStatement
            onSuccess={handleMonthSuccess(month)}
            onClear={() => handleClearMonth(month)}
          />
          {monthlyTransactions[month]?.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 text-center">
              {monthlyTransactions[month].length} transactions uploaded
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
