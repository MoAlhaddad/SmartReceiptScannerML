'use client';

import { useState, useRef } from 'react';

export default function UploadBankStatement({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [transactions, setTransactions] = useState([]);

  const fileInputRef = useRef(null);

  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const apiBaseUrl = 'http://127.0.0.1:5000';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPdfUrl('');
      setTransactions([]);
    }
  };

  const uploadToImgbb = async (imageFile) => {
    if (!imgbbKey) throw new Error('Missing imgbb API key');
    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data?.data?.url) throw new Error('Failed to upload to imgbb');
    return data.data.url;
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const imageUrl = await uploadToImgbb(file);

      const res = await fetch(`${apiBaseUrl}/api/upload-from-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const data = await res.json();

      const txns = data.transactions || [];
      setTransactions(txns);
      setPdfUrl(`${apiBaseUrl}${data.pdf_url}`);

      if (onSuccess) onSuccess(txns);
    } catch (err) {
      console.error('Upload failed:', err.message);
      alert('❌ Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-md bg-white dark:bg-zinc-900 max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-center">📤 Upload Bank Statement</h2>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="w-full text-sm"
          onChange={handleFileChange}
        />
        <button
          onClick={handleSubmit}
          className={`px-5 py-2 rounded-md text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={!file || loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>

      {pdfUrl && (
        <div className="text-center">
          <a
            href={`${apiBaseUrl}/download-report`}
            download="Tax_Report.pdf"
            className="text-blue-600 underline"
          >
            📄 Download Tax Report PDF
          </a>
        </div>
      )}

      {transactions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">📊 Extracted Transactions</h3>
          <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {transactions.map((tx, idx) => (
              <li key={idx}>
                {tx.date} — {tx.merchant} — ${tx.amount.toFixed(2)} ({tx.category})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
