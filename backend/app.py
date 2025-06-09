from flask import Flask, request, render_template
from PIL import Image
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
import spacy
import os

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    extracted_text = ""
    entities = []

    if request.method == 'POST':
        if 'image' in request.files:
            image = request.files['image']
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
            image.save(image_path)

            # OCR with pytesseract
            text = pytesseract.image_to_string(Image.open(image_path))
            extracted_text = text

            # NLP with spaCy
            doc = nlp(text)
            entities = [(ent.text, ent.label_) for ent in doc.ents]

    return render_template('index.html', text=extracted_text, entities=entities)

if __name__ == '__main__':
    app.run(debug=True)
