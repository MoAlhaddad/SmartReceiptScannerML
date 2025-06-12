"use client";

import { useState } from "react";

export default function UploadBankStatement() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [transactions, setTransactions] = useState([]);
  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPdfUrl("");
    setTransactions([]);
  };

  const uploadToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const imageUrl = await uploadToImgbb(file);

      const res = await fetch("http://127.0.0.1:5000/api/upload-from-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const data = await res.json();
      setTransactions(data.transactions || []);
      setPdfUrl("http://127.0.0.1:5000" + data.pdf_url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Bank Statement</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!file || loading}
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      {pdfUrl && (
        <div className="mt-6">
          <a
            href={`http://127.0.0.1:5000${pdfUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            📄 Download Tax Report PDF
          </a>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Extracted Transactions:</h3>
          <ul className="space-y-1 text-sm">
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
