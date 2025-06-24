'use client'

import React, { useState } from 'react'

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC'
]

export default function TaxInputForm({ onSubmit }) {
  const [revenue, setRevenue] = useState('')
  const [state, setState] = useState('CA')

  const handleSubmit = (e) => {
    e.preventDefault()
    const revenueNumber = parseFloat(revenue)
    if (isNaN(revenueNumber)) {
      alert('Please enter a valid revenue amount')
      return
    }
    onSubmit({ revenue: revenueNumber, state })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-6 w-full max-w-lg mx-auto mt-10 space-y-5 border border-gray-200 dark:border-zinc-800"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
        📊 Monthly Tax Info
      </h2>

      <div>
        <label htmlFor="revenue" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          Monthly Revenue ($)
        </label>
        <input
          id="revenue"
          type="number"
          step="0.01"
          inputMode="decimal"
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g. 5200.50"
        />
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          State
        </label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition"
      >
        💰 Calculate Taxes
      </button>
    </form>
  )
}
