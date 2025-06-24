'use client';

import { useState, useRef } from 'react';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UploadBankStatement({ onSuccess, onClear }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  // Modal open/close
  const openConfirmModal = () => setIsConfirmOpen(true);
  const closeConfirmModal = () => setIsConfirmOpen(false);

  const handleClearConfirmed = () => {
    setFile(null);
    setPdfUrl('');
    setTransactions([]);
    setIsConfirmOpen(false);
    if (onClear) onClear();
    if (fileInputRef.current) fileInputRef.current.value = null; // reset input UI
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

      {transactions.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={openConfirmModal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Clear Uploaded Data
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Clear Uploads"
        message="Are you sure you want to clear all uploaded transactions? This cannot be undone."
        onConfirm={handleClearConfirmed}
        onCancel={closeConfirmModal}
      />
    </div>
  );
}
