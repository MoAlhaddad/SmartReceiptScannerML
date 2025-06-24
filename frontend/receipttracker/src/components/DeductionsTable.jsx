'use client'

export default function DeductionsTable({ transactions = [] }) {
  const filteredTxns = transactions
    .filter((tx) => tx.category !== 'Uncategorized')
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

  if (!filteredTxns.length) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
        No deductible transactions found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-700 mt-6">
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-zinc-800 text-xs uppercase font-medium text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Merchant</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3">Category</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {filteredTxns.map((tx, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition">
              <td className="px-4 py-2 whitespace-nowrap">{tx.date}</td>
              <td className="px-4 py-2">{tx.merchant}</td>
              <td className="px-4 py-2 text-right">${tx.amount.toFixed(2)}</td>
              <td className="px-4 py-2">{tx.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
