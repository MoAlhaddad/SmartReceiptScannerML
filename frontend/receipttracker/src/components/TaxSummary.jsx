'use client'

import React from 'react'

export default function TaxSummary({ taxData }) {
  if (!taxData) return null

  const {
    revenue,
    deductibleTotal,
    taxableIncome,
    federalTax,
    stateTax,
    totalTax,
    state,
  } = taxData

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md max-w-md mx-auto mt-10 border border-gray-200 dark:border-zinc-700 space-y-3">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        🧾 Tax Summary
      </h2>

      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
        <SummaryItem label="State" value={state} />
        <SummaryItem label="Monthly Revenue" value={`$${revenue.toFixed(2)}`} />
        <SummaryItem label="Deductible Expenses" value={`$${deductibleTotal.toFixed(2)}`} />
        <SummaryItem label="Taxable Income" value={`$${taxableIncome.toFixed(2)}`} />
        <SummaryItem label="Federal Tax" value={`$${federalTax.toFixed(2)}`} />
        <SummaryItem label="State Tax" value={`$${stateTax.toFixed(2)}`} />
      </div>

      <div className="border-t pt-3 mt-3 text-lg font-semibold text-center text-green-700 dark:text-green-400">
        Total Estimated Tax: <span className="font-bold">${totalTax.toFixed(2)}</span>
      </div>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  )
}
