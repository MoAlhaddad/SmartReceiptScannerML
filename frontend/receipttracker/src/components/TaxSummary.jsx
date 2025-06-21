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
    <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-8 space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">Tax Summary</h2>
      <p>State: <strong>{state}</strong></p>
      <p>Monthly Revenue: <strong>${revenue.toFixed(2)}</strong></p>
      <p>Total Deductible Expenses: <strong>${deductibleTotal.toFixed(2)}</strong></p>
      <p>Taxable Income: <strong>${taxableIncome.toFixed(2)}</strong></p>
      <p>Estimated Federal Tax: <strong>${federalTax.toFixed(2)}</strong></p>
      <p>Estimated State Tax: <strong>${stateTax.toFixed(2)}</strong></p>
      <p className="text-lg font-bold">Total Estimated Tax: <strong>${totalTax.toFixed(2)}</strong></p>
    </div>
  )
}
