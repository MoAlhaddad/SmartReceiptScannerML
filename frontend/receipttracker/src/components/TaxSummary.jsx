'use client';

import React from 'react';

export default function TaxSummary({ taxData }) {
  if (!taxData) return null;

  const {
    revenue,           // monthly revenue input
    deductibleTotal,   // total deductible expenses across 12 months
    taxableIncome,     // yearly taxable income (revenue - deductions)
    federalTax,        // yearly federal tax
    stateTax,          // yearly state tax
    totalTax,          // yearly total tax
    state,
  } = taxData;

  const yearlyRevenue = revenue * 12;
  const monthlyFederal = federalTax / 12;
  const monthlyState = stateTax / 12;
  const monthlyTotal = totalTax / 12;

  const yearlyTakeHome = yearlyRevenue - totalTax;
  const monthlyTakeHome = yearlyTakeHome / 12;

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md max-w-md mx-auto mt-10 border border-gray-200 dark:border-zinc-700 space-y-3">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
        🧾 Tax Summary
      </h2>

      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
        <SummaryItem label="State" value={state} />
        <SummaryItem label="Monthly Revenue (Input)" value={`$${revenue.toFixed(2)}`} />
        <SummaryItem label="Estimated Yearly Revenue" value={`$${yearlyRevenue.toFixed(2)}`} />
        <SummaryItem label="Total Deductible Expenses (12 Months)" value={`$${deductibleTotal.toFixed(2)}`} />
        <SummaryItem label="Yearly Taxable Income" value={`$${taxableIncome.toFixed(2)}`} />
        <SummaryItem label="Estimated Yearly Federal Tax" value={`$${federalTax.toFixed(2)}`} />
        <SummaryItem label="Estimated Yearly State Tax" value={`$${stateTax.toFixed(2)}`} />
      </div>

      <div className="border-t pt-3 mt-3 space-y-1 text-center">
        <div className="text-lg font-semibold text-green-700 dark:text-green-400">
          Total Estimated Yearly Tax: <span className="font-bold">${totalTax.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          ≈ ${monthlyTotal.toFixed(2)} per month
        </div>

        <div className="text-lg font-semibold text-blue-700 dark:text-blue-400 mt-4">
          Estimated Yearly Take-Home Income: <span className="font-bold">${yearlyTakeHome.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          ≈ ${monthlyTakeHome.toFixed(2)} per month
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        This estimate is based on your uploaded data from all months combined.
      </p>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
