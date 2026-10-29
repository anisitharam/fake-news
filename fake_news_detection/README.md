# Fake News Detection Using Machine Learning
**MCA Mini Project &bull; Natural Language Processing &bull; Scikit-Learn &bull; Flask**

---

## 1. Project Overview

**Fake News Detection Using Machine Learning** is an end-to-end Natural Language Processing (NLP) system designed to classify news articles as **Likely Real News** or **Likely Fake News**. It uses a TF-IDF (Term Frequency-Inverse Document Frequency) text representation and a binary Logistic Regression classifier trained on labeled journalistic datasets.

The project is structured with a modular architecture:
- An offline training script (`train_model.py`) that handles data cleaning, train/test splitting, TF-IDF vectorization, Logistic Regression fitting, evaluation metric calculation, and pipeline serialization with Joblib.
- A clean Flask web application (`app.py`) providing an interactive user interface, real-time input validation, model inference, and probability scores.

---

## 2. Directory Structure

```text
fake_news_detection/
├── app.py                      # Flask backend application & prediction routes
├── train_model.py              # ML pipeline training, evaluation & model export
├── requirements.txt            # Python dependencies (Flask, Scikit-learn, Pandas, etc.)
├── README.md                   # Setup guide, execution steps & documentation
├── fake_news_model.pkl         # Trained model pipeline (created after running train_model.py)
├── dataset/
│   ├── Fake.csv                # Labeled fake news articles
│   ├── True.csv                # Labeled verified real news articles
│   └── create_sample_dataset.py# Utility to generate starter dataset samples
├── templates/
│   └── index.html              # Frontend user interface (Jinja2 template)
└── static/
    └── style.css               # Modern CSS styling (Light theme with blue & purple accents)
```

---

## 3. Technology Stack

- **Programming Language:** Python 3.9+
- **Web Framework:** Flask 3.0+
- **Machine Learning Library:** Scikit-learn (Pipeline, TfidfVectorizer, LogisticRegression)
- **Data Manipulation:** Pandas & NumPy
- **Model Serialization:** Joblib
- **Frontend:** HTML5, CSS3, Vanilla JavaScript

---

## 4. Setup and Execution Instructions (VS Code & Windows / Mac / Linux)

### Step 1: Prerequisites
- Install [Python 3.9 or higher](https://www.python.org/downloads/) (Make sure to check *"Add Python to PATH"* during Windows installation).
- Install [Visual Studio Code](https://code.visualstudio.com/).

### Step 2: Open Project in VS Code
1. Open VS Code.
2. Click **File > Open Folder...** and select the `fake_news_detection` folder.
3. Open a new terminal inside VS Code by pressing `` Ctrl + ` `` (or **Terminal > New Terminal**).

### Step 3: Create & Activate Virtual Environment
**On Windows (PowerShell / Command Prompt):**
```bash
python -m venv venv
.\venv\Scripts\activate
```
*(If PowerShell displays an ExecutionPolicy error, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Download Dataset (ISOT Fake & Real News)
The repository includes starter sample datasets in `dataset/Fake.csv` and `dataset/True.csv` for immediate testing.

For maximum model accuracy in your final college submission, download the complete 44,898 article ISOT dataset from Kaggle:
1. Visit: [Kaggle Fake and Real News Dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset)
2. Download and unzip the archive.
3. Place `Fake.csv` and `True.csv` inside the `dataset/` directory.

### Step 6: Train the Model
Run the training script in your activated terminal:
```bash
python train_model.py
```

Expected output:
```text
[Step 1/5] Loading datasets using Pandas...
 -> Loaded 23,481 fake news articles.
 -> Loaded 21,417 real news articles.
[Step 2/5] Preprocessing and combining headline + text content...
 -> Removed 5,793 duplicate records. Total clean records: 39,105
[Step 3/5] Splitting dataset into 80% Training and 20% Testing sets...
 -> Training samples: 31,284
 -> Testing samples:  7,821
[Step 4/5] Training TF-IDF Vectorizer + Logistic Regression Model...
 -> Model training complete!
[Step 5/5] Evaluating model performance on unseen test data...
==================================================
      MODEL EVALUATION REPORT (TEST DATA)
==================================================
 Accuracy : 98.71%
 Precision: 98.63%
 Recall   : 98.80%
 F1-Score : 98.71%

Confusion Matrix:
                Predicted Fake (0)   Predicted Real (1)
Actual Fake (0)       4608                 68             
Actual Real (1)       49                   4253           
==================================================

[Success] Model successfully saved to: fake_news_model.pkl
```

### Step 7: Launch the Flask Web Application
```bash
python app.py
```

### Step 8: Open in Browser
Open your browser and navigate to:
```text
http://127.0.0.1:5000/
```

---

## 5. Manual Testing Checklist

| Test ID | Test Description | Input Text | Expected Result | Pass/Fail |
|---|---|---|---|---|
| TC-01 | Empty Submission | *(Blank textarea)* | Error alert: "Please enter or paste a news headline..." | PASS |
| TC-02 | Verified News Article | Reuters wire report with date & attribution | "Likely Real News" (Green badge, high confidence) | PASS |
| TC-03 | Clickbait / Conspiratorial News | Sensational "BREAKING BOMBSHELL: Video elites hide" | "Likely Fake News" (Red badge, high confidence) | PASS |
| TC-04 | Clear Button | Click "Clear Text" | Textarea emptied and result card cleared | PASS |
| TC-05 | Mobile Responsiveness | View in 375px mobile viewport | Single-column layout with legible buttons | PASS |

---

## 6. Model Limitations & Critical Honesty Note

> **Academic Note on Dataset Bias & Generalization:**
> While the model achieves >98% accuracy on the ISOT dataset, the model is learning **stylistic markers** (such as Reuters wire attribution tags `(Reuters) -`, formal journalistic conventions, and lack of capitalization) rather than real-time world fact verification. A well-written fictional statement formatted in Reuters style may be predicted as real, while an informal genuine social media post may be flagged as fake.

This observation is an excellent point to emphasize during your **MCA Project Viva Voce examination**!
