'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import TaxInputForm from '@/components/TaxInputForm';
import { calculateTaxes } from '@/utils/calculateTaxes';
import Layout from '@/components/Layout';

// ✅ Lazy load heavier components with fallback skeletons
const UploadBankStatement = dynamic(() => import('@/components/UploadBankStatement'), {
  loading: () => <div className="text-center text-gray-400 animate-pulse">Loading upload tool...</div>,
});
const DeductionsTable = dynamic(() => import('@/components/DeductionsTable'), {
  loading: () => <div className="text-center text-gray-400 animate-pulse">Loading deductions...</div>,
});
const TaxSummary = dynamic(() => import('@/components/TaxSummary'), {
  loading: () => <div className="text-center text-gray-400 animate-pulse">Calculating summary...</div>,
});

export default function ResultsPage() {
  const [transactions, setTransactions] = useState([]);
  const [taxData, setTaxData] = useState(null);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch {
        console.error('Failed to parse transactions from localStorage.');
      }
    }
  }, []);

  // ✅ Persist transactions to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // ✅ Memoize deductible total
  const deductibleTotal = useMemo(() => {
    return transactions.reduce(
      (sum, tx) => (tx.category !== 'Uncategorized' ? sum + tx.amount : sum),
      0
    );
  }, [transactions]);

  const handleFileProcessed = (newTransactions) => {
    setTransactions(newTransactions);
    setTaxData(null);
  };

  const handleTaxSubmit = ({ revenue, state }) => {
    const taxCalc = calculateTaxes({
      revenue,
      deductions: deductibleTotal,
      state,
    });

    setTaxData({
      revenue,
      state,
      deductibleTotal,
      ...taxCalc,
    });
  };

  return (
   
    <main className="pt-16 p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center">Your Deductions & Tax Summary</h1>

      <UploadBankStatement onSuccess={handleFileProcessed} />

      {transactions.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Deductions</h2>
          <DeductionsTable transactions={transactions} />
        </section>
      ) : (
        <p className="text-center text-gray-600">No transactions uploaded yet.</p>
      )}

      <TaxInputForm onSubmit={handleTaxSubmit} />

      {taxData && <TaxSummary taxData={taxData} />}
    </main>
  
  );
}


