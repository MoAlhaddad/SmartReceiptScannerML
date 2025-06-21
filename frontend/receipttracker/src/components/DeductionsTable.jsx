'use client'

import React from 'react'

export default function DeductionsTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <p>No transactions extracted yet.</p>
  }

  return (
    <table className="w-full border-collapse border border-gray-300 mt-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
          <th className="border border-gray-300 px-3 py-2 text-left">Merchant</th>
          <th className="border border-gray-300 px-3 py-2 text-right">Amount ($)</th>
          <th className="border border-gray-300 px-3 py-2 text-left">Category</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, idx) => (
          <tr key={idx} className="even:bg-gray-50">
            <td className="border border-gray-300 px-3 py-1">{tx.date}</td>
            <td className="border border-gray-300 px-3 py-1">{tx.merchant}</td>
            <td className="border border-gray-300 px-3 py-1 text-right">{tx.amount.toFixed(2)}</td>
            <td className="border border-gray-300 px-3 py-1">{tx.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
