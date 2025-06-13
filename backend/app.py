import re
import os
import cv2
import pytesseract
import requests
from io import BytesIO
from PIL import Image
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, date
from fpdf import FPDF

# Configure Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Setup Flask app
app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/download-report', methods=['GET'])
def download_report():
    return send_from_directory(directory='static', path='report.pdf', as_attachment=True)

def generate_tax_pdf(transactions, output_path='static/report.pdf'):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Tax Write-Off Report", ln=True, align='C')

    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, f"Generated on: {date.today().strftime('%B %d, %Y')}", ln=True)
    pdf.ln(10)

    # Table Header
    pdf.set_font("Arial", "B", 12)
    pdf.cell(40, 10, "Date")
    pdf.cell(60, 10, "Merchant")
    pdf.cell(30, 10, "Amount")
    pdf.cell(50, 10, "Category", ln=True)

    pdf.set_font("Arial", "", 11)
    total_by_category = {}
    total = 0.0

    for tx in transactions:
        pdf.cell(40, 10, tx['date'])
        pdf.cell(60, 10, tx['merchant'][:30])  # truncate merchant name
        pdf.cell(30, 10, f"${tx['amount']:.2f}")
        pdf.cell(50, 10, tx['category'], ln=True)

        if tx['category'] != "Uncategorized":
            total_by_category[tx['category']] = total_by_category.get(tx['category'], 0) + tx['amount']
            total += tx['amount']

    pdf.ln(10)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, "Summary of Deductible Amounts", ln=True)

    pdf.set_font("Arial", "", 11)
    for cat, amt in total_by_category.items():
        pdf.cell(0, 10, f"{cat}: ${amt:.2f}", ln=True)

    pdf.set_font("Arial", "B", 12)
    pdf.ln(5)
    pdf.cell(0, 10, f"Total Estimated Write-Offs: ${total:.2f}", ln=True)

    pdf.output(output_path)
    return output_path


def preprocess_image(image_path):
    img = cv2.imread(image_path)

    scale_percent = 200
    width = int(img.shape[1] * scale_percent / 100)
    height = int(img.shape[0] * scale_percent / 100)
    resized = cv2.resize(img, (width, height), interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)

    processed_path = os.path.splitext(image_path)[0] + "_processed.png"
    cv2.imwrite(processed_path, blurred)
    return processed_path


def parse_transaction_line(line):
    pattern = r'(\d{2}/\d{2}/\d{4}).*?([A-Za-z0-9 *.\-/]+?)\s+(-?\(?\$?[\d,]+\.\d{2}\)?)'
    match = re.search(pattern, line)
    if not match:
        return None

    date_str, merchant, amount_str = match.groups()

    amount_str = amount_str.replace('(', '-').replace(')', '')
    amount_str = re.sub(r'[^\d\-.]', '', amount_str)

    try:
        amount = float(amount_str)
    except ValueError:
        amount = 0.0

    try:
        date_obj = datetime.strptime(date_str, '%m/%d/%Y')
    except ValueError:
        date_obj = None

    return {
        'date': date_obj.strftime('%Y-%m-%d') if date_obj else date_str,
        'merchant': merchant.strip(),
        'amount': amount
    }


def classify_transaction(merchant):
    keywords = {
        "uber": "Transportation",
        "lyft": "Transportation",
        "office depot": "Office Supplies",
        "home depot": "Office Supplies",
        "udemy": "Education",
        "coursera": "Education",
        "airbnb": "Business Travel",
        "amazon": "Business Expense",
    }

    merchant_lower = merchant.lower()
    for keyword, category in keywords.items():
        if keyword in merchant_lower:
            return category
    return "Uncategorized"


def extract_transactions(text):
    transactions = []
    lines = text.split('\n')
    for line in lines:
        transaction = parse_transaction_line(line)
        if transaction:
            transaction['category'] = classify_transaction(transaction['merchant'])
            transactions.append(transaction)
    return transactions


@app.route('/')
def home():
    return "Flask Bank Statement OCR API is running."


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


@app.route('/api/upload-from-url', methods=['POST'])
def upload_from_url():
    data = request.json
    image_url = data.get('image_url')
    if not image_url:
        return jsonify({'error': 'No image URL provided'}), 400

    try:
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content))
    except:
        return jsonify({'error': 'Failed to load image from URL'}), 400

    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], 'temp.png')
    image.save(temp_path)

    processed_path = preprocess_image(temp_path)
    config = r'--oem 3 --psm 4 -l eng'
    extracted_text = pytesseract.image_to_string(Image.open(processed_path), config=config)
    extracted_text = re.sub(r'[^\x00-\x7F]+', ' ', extracted_text)

    transactions = extract_transactions(extracted_text)

    # ✅ Generate PDF
    pdf_path = os.path.join('static', 'report.pdf')
    generate_tax_pdf(transactions, pdf_path)

    return jsonify({
        'raw_text': extracted_text,
        'transactions': transactions,
        'pdf_url': '/static/report.pdf'
    })


if __name__ == '__main__':
    app.run(debug=True)
