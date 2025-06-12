'use client';

import UploadBankStatement from '@/components/UploadBankStatement';

export default function Home() {
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bank Statement OCR</h1>
      <UploadBankStatement />
    </main>
  );
}
