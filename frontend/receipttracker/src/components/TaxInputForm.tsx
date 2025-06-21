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
  const [revenue, setRevenue] = useState('') // string, not undefined
  const [state, setState] = useState('CA')   // consistent default

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
      className="bg-white shadow-md rounded-xl p-6 w-full max-w-md mx-auto mt-8 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Monthly Tax Info</h2>

      <div className="flex flex-col">
        <label htmlFor="revenue" className="text-sm text-gray-600 mb-1">
          Monthly Revenue ($)
        </label>
        <input
          id="revenue"
          type="number"
          step="0.01"
          inputMode="decimal"
          value={revenue || ''} // ensures always a string
          onChange={(e) => setRevenue(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
          placeholder="e.g. 5200.50"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="state" className="text-sm text-gray-600 mb-1">
          State
        </label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
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
        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
      >
        Calculate Taxes
      </button>
    </form>
  )
}
