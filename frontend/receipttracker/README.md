# Bank Statement Tax Deduction Extractor

This project is a web application that allows users to upload bank statement images, extracts transactions using OCR, classifies them into tax deductible categories, and calculates estimated taxes based on monthly revenue and expenses. Users can upload monthly bank statements separately and get detailed tax summaries with downloadable PDF reports.

---

## Features

- Upload bank statement images (supports multiple months separately)
- OCR extraction of transaction details using Tesseract
- Automatic classification of transactions into categories (Transportation, Software, Office Supplies, etc.)
- Handles uncategorized transactions for review
- Tax calculations with state-based tax rates
- Downloadable PDF tax write-off report
- Clear and reset data option

---

## Tech Stack

- Backend: Flask (Python), Tesseract OCR, FPDF (for PDFs)
- Frontend: React (Next.js), dynamic imports for upload and summary components
- Storage: LocalStorage on frontend to keep transactions per month

---

## Getting Started

### Prerequisites

- Python 3.10+ installed
- Tesseract OCR installed and added to your system PATH  
  (Windows example: `C:\Program Files\Tesseract-OCR\tesseract.exe`)  
  [Tesseract Installation Guide](https://github.com/tesseract-ocr/tesseract)

- Node.js 18+ installed (for frontend)

---

### Backend Setup

1. Clone the repo and navigate to the backend folder (or root if combined).

2. Install Python dependencies:

```bash
pip install -r requirements.txt
Run the Flask backend server:

bash
Copy
Edit
python app.py
By default, it will run on http://localhost:5000

Frontend Setup
Navigate to the frontend directory.

Install npm dependencies:

bash
Copy
Edit
npm install
Run the development server:

bash
Copy
Edit
npm run dev
The frontend will run on http://localhost:3000 and communicate with the backend API.

Usage
Upload bank statements month by month via the upload interface.

Review extracted transactions and categorized expenses.

Enter monthly revenue and select your state to estimate taxes.

Download detailed tax summary reports as PDFs.

Clear all uploaded data if needed.

Notes
Make sure Tesseract OCR is properly installed and configured.

The backend classifies transactions based on merchant keywords; uncategorized transactions are listed for manual review.

State tax rates are used for better accuracy in tax estimation.

License
This project is open source and available under the MIT License.

Contact
For questions or feedback, please contact [mohamadalhaddad25@gmail.com].

yaml
Copy
Edit

---

If you want, I can generate the `requirements.txt` for the backend as well, or help customize the R