'use client';

import { useState } from 'react';
import UploadBankStatement from '@/components/UploadBankStatement';
import DeductionsTable from '@/components/DeductionsTable';
import TaxInputForm from '@/components/TaxInputForm';
import TaxSummary from '@/components/TaxSummary';
import { calculateTaxes } from '@/utils/calculateTaxes';

export default function ResultsPage() {
  const [transactions, setTransactions] = useState([]);
  const [taxData, setTaxData] = useState(null);

  const deductibleTotal = transactions.reduce(
    (sum, tx) => (tx.category !== 'Uncategorized' ? sum + tx.amount : sum),
    0
  );

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
    <main className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">Your Deductions & Tax Summary</h1>
      

      <UploadBankStatement onSuccess={handleFileProcessed} />

      {transactions.length > 0 ? (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Deductions</h2>
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

