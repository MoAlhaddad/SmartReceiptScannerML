'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import TaxInputForm from '@/components/TaxInputForm';
import { calculateTaxes } from '@/utils/calculateTaxes';
import ConfirmModal from '@/components/ConfirmModal';

const UploadBankStatement = dynamic(() => import('@/components/UploadBankStatement'), {
  loading: () => <div className="text-center text-gray-400 animate-pulse">Loading upload tool...</div>,
});

const TaxSummary = dynamic(() => import('@/components/TaxSummary'), {
  loading: () => <div className="text-center text-gray-400 animate-pulse">Calculating summary...</div>,
});

// Months array for UI labels & keys
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ResultsPage() {
  // Store transactions for each month separately: { January: [...], February: [...], ... }
  const [transactionsByMonth, setTransactionsByMonth] = useState({});

  const [taxData, setTaxData] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // On mount, load saved data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('transactionsByMonth');
    if (stored) {
      try {
        setTransactionsByMonth(JSON.parse(stored));
      } catch {
        console.error('Failed to parse monthly transactions from localStorage.');
      }
    }
  }, []);

  // Persist monthly transactions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('transactionsByMonth', JSON.stringify(transactionsByMonth));
  }, [transactionsByMonth]);

  // Aggregate all monthly transactions into a single array
  const allTransactions = useMemo(() => {
    return Object.values(transactionsByMonth).flat();
  }, [transactionsByMonth]);

  // Calculate total deductible amount across all months
  const deductibleTotal = useMemo(() => {
    return allTransactions.reduce((sum, tx) => {
      if (tx.category !== 'Uncategorized') {
        return sum + Math.abs(tx.amount);
      }
      return sum;
    }, 0);
  }, [allTransactions]);

  // Handler for when a month's upload finishes
  const handleMonthUpload = (month, newTransactions) => {
    setTransactionsByMonth((prev) => ({
      ...prev,
      [month]: newTransactions,
    }));
    setTaxData(null);
  };

  // Handler for tax calculation form submit
  const handleTaxSubmit = ({ revenue, state }) => {
    const normalizedState = state.toUpperCase();

    // yearlyRevenue from monthly input * 12
    const yearlyRevenue = revenue * 12;

    // yearlyDeductions from deductibleTotal * 12
    const yearlyDeductions = deductibleTotal;

    const taxCalc = calculateTaxes({
      revenue: yearlyRevenue,
      deductions: yearlyDeductions,
      state: normalizedState,
    });

    setTaxData({
      revenue,
      state: normalizedState,
      deductibleTotal,
      ...taxCalc,
    });
  };

  // Confirm modal handlers
  const openConfirmModal = () => setIsConfirmOpen(true);
  const closeConfirmModal = () => setIsConfirmOpen(false);

  const handleClearData = () => {
    localStorage.removeItem('transactionsByMonth');
    setTransactionsByMonth({});
    setTaxData(null);
    closeConfirmModal();
  };

  return (
    <main className="pt-16 p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center">Your Monthly Uploads & Tax Summary</h1>

      <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {MONTHS.map((month) => (
          <div key={month} className="border rounded-lg p-4 bg-white dark:bg-zinc-900 shadow">
            <h2 className="text-xl font-semibold mb-2 text-center">{month}</h2>
            <UploadBankStatement
              onSuccess={(txns) => handleMonthUpload(month, txns)}
              initialTransactions={transactionsByMonth[month] || []}
              month={month}
            />
          </div>
        ))}
      </section>

      <TaxInputForm onSubmit={handleTaxSubmit} />

      {taxData && <TaxSummary taxData={taxData} />}

      {(allTransactions.length > 0 || taxData) && (
        <div className="max-w-md mx-auto mt-6 text-center">
          <button
            onClick={openConfirmModal}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            🧹 Clear All Data
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Clear Data"
        message="Are you sure you want to clear all transactions and tax data? This action cannot be undone."
        onConfirm={handleClearData}
        onCancel={closeConfirmModal}
      />
    </main>
  );
}
