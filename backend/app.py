import re
from datetime import datetime
import cv2
import pytesseract
from PIL import Image
from flask import Flask, request, render_template
import os

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def preprocess_image(image_path):
    img = cv2.imread(image_path)

    # Resize (enlarge 2x for clarity)
    scale_percent = 200
    width = int(img.shape[1] * scale_percent / 100)
    height = int(img.shape[0] * scale_percent / 100)
    resized = cv2.resize(img, (width, height), interpolation=cv2.INTER_CUBIC)

    # Convert to grayscale
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

    # Apply light Gaussian blur
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)

    processed_path = os.path.splitext(image_path)[0] + "_processed.png"
    cv2.imwrite(processed_path, blurred)
    return processed_path


def parse_transaction_line(line):
    # Regex pattern: date, merchant name, amount (with optional parentheses/negative sign)
    pattern = r'(\d{2}/\d{2}/\d{4}).*?([A-Za-z0-9 *.\-/]+?)\s+(-?\(?\$?[\d,]+\.\d{2}\)?)'
    match = re.search(pattern, line)
    if not match:
        return None

    date_str, merchant, amount_str = match.groups()

    # Clean amount string:
    amount_str = amount_str.replace('(', '-').replace(')', '')  # convert (123.45) to -123.45
    amount_str = re.sub(r'[^\d\-.]', '', amount_str)  # keep digits, dot, minus

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


def extract_transactions(text):
    transactions = []
    lines = text.split('\n')
    for line in lines:
        transaction = parse_transaction_line(line)
        if transaction:
            transactions.append(transaction)
    return transactions


@app.route('/', methods=['GET', 'POST'])
def index():
    transactions = []
    image_filename = ""

    if request.method == 'POST' and 'image' in request.files:
        image = request.files['image']
        filename = image.filename
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)

        processed_image_path = preprocess_image(image_path)

        custom_config = r'--oem 3 --psm 4 -l eng'

        # OCR on processed image for better accuracy
        extracted_text = pytesseract.image_to_string(Image.open(processed_image_path), config=custom_config)

        # Optional: cleanup text to remove weird characters
        extracted_text = re.sub(r'[^\x00-\x7F]+', ' ', extracted_text)

        transactions = extract_transactions(extracted_text)
        image_filename = filename  # pass just filename, not full path

    return render_template('index.html', transactions=transactions, image_filename=image_filename)


if __name__ == '__main__':
    app.run(debug=True)
