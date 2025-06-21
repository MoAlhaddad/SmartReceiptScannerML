'use client'

import React, { useState } from 'react'
import DeductionsTable from '@/components/DeductionsTable'
import TaxInputForm from '@/components/TaxInputForm'
import TaxSummary from '@/components/TaxSummary'
import { calculateTaxes } from '@/utils/calculateTaxes'
import UploadBankStatement from '@/components/UploadBankStatement'

export default function ResultsPage() {
  const [transactions, setTransactions] = useState([])
  const [taxData, setTaxData] = useState(null)

  const deductibleTotal = transactions.reduce(
    (sum, tx) => (tx.category !== 'Uncategorized' ? sum + tx.amount : sum),
    0
  )

  const handleFileProcessed = (newTransactions) => {
    setTransactions(newTransactions)
    setTaxData(null) // reset tax summary if a new file is uploaded
  }

  const handleTaxSubmit = ({ revenue, state }) => {
    const taxCalc = calculateTaxes({
      revenue,
      deductions: deductibleTotal,
      state,
    })

    setTaxData({
      revenue,
      state,
      deductibleTotal,
      ...taxCalc,
    })
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Your Deductions</h1>
      
      {transactions.length > 0 ? (
        <DeductionsTable transactions={transactions} />
      ) : (
        <p className="text-gray-600">No transactions uploaded yet.</p>
      )}
      
      <TaxInputForm onSubmit={handleTaxSubmit} />
      <UploadBankStatement onSuccess={handleFileProcessed} />
      {taxData && <TaxSummary taxData={taxData} />}
    </main>
  )
}
