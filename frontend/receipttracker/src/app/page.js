'use client';

import UploadBankStatement from '@/components/UploadBankStatement';

export default function Home() {
  return (
    <main className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Bank Statement OCR</h1>
      <UploadBankStatement />
    </main>
  );
}
