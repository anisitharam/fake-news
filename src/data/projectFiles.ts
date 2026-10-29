import JSZip from 'jszip';

export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  category: 'core' | 'dataset' | 'web' | 'doc';
  description: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    name: 'app.py',
    path: 'app.py',
    language: 'python',
    category: 'core',
    description: 'Flask web application backend with input validation and model inference routes',
    content: `"""
Fake News Detection - Flask Web Application
===========================================
MCA Mini Project: Fake News Detection Using Machine Learning
Web Framework: Flask
Author: MCA Student
"""

import os
import joblib
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Path to the saved trained pipeline
MODEL_PATH = os.path.join(os.path.dirname(__file__), "fake_news_model.pkl")

# Load model pipeline if it exists
model_pipeline = None
if os.path.exists(MODEL_PATH):
    try:
        model_pipeline = joblib.load(MODEL_PATH)
        print(f"[INFO] Successfully loaded model from {MODEL_PATH}")
    except Exception as e:
        print(f"[ERROR] Failed to load model file: {e}")
        model_pipeline = None
else:
    print(f"[WARNING] Model file '{MODEL_PATH}' not found. Please run 'python train_model.py' first.")

@app.route("/", methods=["GET", "POST"])
def index():
    prediction_label = None
    prediction_class = None  # 'fake' or 'real'
    confidence_score = None
    user_input = ""
    error_message = None

    if request.method == "POST":
        user_input = request.form.get("news_text", "").strip()

        # Step 1: Input Validation
        if not user_input:
            error_message = "Please enter or paste a news headline or article text before checking."
        
        # Step 2: Check if model is loaded
        elif model_pipeline is None:
            error_message = (
                "The trained model file 'fake_news_model.pkl' was not found on the server. "
                "Please run 'python train_model.py' in your terminal first to train and save the model."
            )
        
        # Step 3: Run Prediction
        else:
            try:
                pred_class_id = int(model_pipeline.predict([user_input])[0])
                
                # Get prediction probabilities for both classes [P(Fake), P(Real)]
                if hasattr(model_pipeline, "predict_proba"):
                    probabilities = model_pipeline.predict_proba([user_input])[0]
                    confidence_pct = round(float(probabilities[pred_class_id]) * 100, 2)
                else:
                    confidence_pct = None

                if pred_class_id == 1:
                    prediction_label = "Likely Real News"
                    prediction_class = "real"
                else:
                    prediction_label = "Likely Fake News"
                    prediction_class = "fake"

                confidence_score = confidence_pct

            except Exception as e:
                error_message = f"An error occurred while evaluating the text: {str(e)}"

    return render_template(
        "index.html",
        prediction_label=prediction_label,
        prediction_class=prediction_class,
        confidence_score=confidence_score,
        user_input=user_input,
        error_message=error_message,
        model_ready=(model_pipeline is not None)
    )

@app.route("/api/predict", methods=["POST"])
def api_predict():
    """Optional JSON API endpoint for programmatic testing."""
    data = request.get_json(silent=True) or {}
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "Input text cannot be empty"}), 400

    if model_pipeline is None:
        return jsonify({
            "error": "Model not loaded. Please train the model using train_model.py"
        }), 503

    try:
        pred_id = int(model_pipeline.predict([text])[0])
        probs = model_pipeline.predict_proba([text])[0] if hasattr(model_pipeline, "predict_proba") else [0.5, 0.5]
        
        return jsonify({
            "prediction": "Likely Real News" if pred_id == 1 else "Likely Fake News",
            "is_real": bool(pred_id == 1),
            "probability_real": round(float(probs[1]) * 100, 2),
            "probability_fake": round(float(probs[0]) * 100, 2),
            "confidence_score": round(float(probs[pred_id]) * 100, 2),
            "disclaimer": "This prediction reflects lexical pattern similarity in the training dataset and is not a guarantee of factual accuracy."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("\\n" + "="*60)
    print(" MCA Mini Project: Fake News Detection Using Machine Learning ")
    print(" Running locally on: http://127.0.0.1:5000")
    print("="*60 + "\\n")
    app.run(host="127.0.0.1", port=5000, debug=True)
`
  },
  {
    name: 'train_model.py',
    path: 'train_model.py',
    language: 'python',
    category: 'core',
    description: 'Loads datasets, trains TF-IDF + Logistic Regression pipeline, prints metrics & saves model',
    content: `"""
Fake News Detection - Model Training Script
===========================================
MCA Mini Project: Fake News Detection Using Machine Learning
Algorithm: TF-IDF Vectorizer + Logistic Regression Classifier
Author: MCA Student
"""

import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

def check_dataset_exists(fake_path, true_path):
    """Verifies that the dataset CSV files exist before training."""
    if not os.path.exists(fake_path) or not os.path.exists(true_path):
        print("\\n" + "="*70)
        print("ERROR: Dataset files not found!")
        print("="*70)
        print(f"Looked for:")
        print(f"  - Fake News: {fake_path}")
        print(f"  - True News: {true_path}")
        print("\\nPlease ensure you have placed 'Fake.csv' and 'True.csv' inside the 'dataset/' folder.")
        print("You can download the full ISOT dataset from Kaggle:")
        print("  https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset")
        print("\\nAlternatively, run 'python dataset/create_sample_dataset.py' to generate")
        print("a quick starter sample dataset for testing.")
        print("="*70 + "\\n")
        return False
    return True

def clean_text(text):
    """Basic text preprocessing function for news content."""
    if not isinstance(text, str):
        return ""
    return text.lower()

def train_and_evaluate():
    dataset_dir = os.path.join(os.path.dirname(__file__), "dataset")
    fake_csv_path = os.path.join(dataset_dir, "Fake.csv")
    true_csv_path = os.path.join(dataset_dir, "True.csv")
    model_output_path = os.path.join(os.path.dirname(__file__), "fake_news_model.pkl")

    # Step 1: Check if dataset files exist
    if not check_dataset_exists(fake_csv_path, true_csv_path):
        sys.exit(1)

    print("\\n[Step 1/5] Loading datasets using Pandas...")
    try:
        df_fake = pd.read_csv(fake_csv_path)
        df_true = pd.read_csv(true_csv_path)
    except Exception as e:
        print(f"Error reading CSV files: {e}")
        sys.exit(1)

    print(f" -> Loaded {len(df_fake):,} fake news articles.")
    print(f" -> Loaded {len(df_true):,} real news articles.")

    # Step 2: Assign labels (0 = Fake News, 1 = Real News)
    df_fake["label"] = 0
    df_true["label"] = 1

    # Step 3: Combine datasets and preprocess
    print("\\n[Step 2/5] Preprocessing and combining headline + text content...")
    df = pd.concat([df_fake, df_true], ignore_index=True)

    title_col = "title" if "title" in df.columns else df.columns[0]
    text_col = "text" if "text" in df.columns else df.columns[1]

    df[title_col] = df[title_col].fillna("")
    df[text_col] = df[text_col].fillna("")

    df["content"] = df[title_col] + " " + df[text_col]
    df["content"] = df["content"].apply(clean_text)

    # Drop duplicate articles
    initial_count = len(df)
    df = df.drop_duplicates(subset=["content"]).reset_index(drop=True)
    dedup_count = initial_count - len(df)
    print(f" -> Removed {dedup_count:,} duplicate records. Total clean records: {len(df):,}")

    X = df["content"]
    y = df["label"]

    # Step 4: Split data into training and testing sets (80% Train, 20% Test)
    print("\\n[Step 3/5] Splitting dataset into 80% Training and 20% Testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f" -> Training samples: {len(X_train):,}")
    print(f" -> Testing samples:  {len(X_test):,}")

    # Step 5: Build Machine Learning Pipeline
    print("\\n[Step 4/5] Training TF-IDF Vectorizer + Logistic Regression Model...")
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            max_features=10000,
            stop_words="english",
            ngram_range=(1, 2),
            sublinear_tf=True
        )),
        ("classifier", LogisticRegression(
            C=1.0,
            max_iter=1000,
            random_state=42,
            solver="lbfgs"
        ))
    ])

    pipeline.fit(X_train, y_train)
    print(" -> Model training complete!")

    # Step 6: Evaluate Model on Test Data
    print("\\n[Step 5/5] Evaluating model performance on unseen test data...")
    y_pred = pipeline.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print("\\n" + "="*50)
    print("      MODEL EVALUATION REPORT (TEST DATA)")
    print("="*50)
    print(f" Accuracy : {accuracy * 100:.2f}%")
    print(f" Precision: {precision * 100:.2f}%")
    print(f" Recall   : {recall * 100:.2f}%")
    print(f" F1-Score : {f1 * 100:.2f}%")
    print("\\nConfusion Matrix:")
    print("                Predicted Fake (0)   Predicted Real (1)")
    print(f"Actual Fake (0)       {cm[0][0]:<15}       {cm[0][1]:<15}")
    print(f"Actual Real (1)       {cm[1][0]:<15}       {cm[1][1]:<15}")
    print("="*50)

    print("\\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Fake News (0)", "Real News (1)"]))

    # Step 7: Save trained pipeline to disk
    joblib.dump(pipeline, model_output_path)
    print(f"\\n[Success] Model successfully saved to: {model_output_path}")
    print("You can now launch the web application by running: python app.py\\n")

if __name__ == "__main__":
    train_and_evaluate()
`
  },
  {
    name: 'requirements.txt',
    path: 'requirements.txt',
    language: 'plaintext',
    category: 'core',
    description: 'Python package dependencies for Flask and Scikit-Learn',
    content: `flask==3.0.3
scikit-learn==1.4.2
pandas==2.2.2
numpy==1.26.4
joblib==1.4.0`
  },
  {
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    category: 'doc',
    description: 'Step-by-step setup guide for VS Code, virtual environment & terminal execution',
    content: `# Fake News Detection Using Machine Learning
**MCA Mini Project • Natural Language Processing • Scikit-Learn • Flask**

## 1. Quick Setup (VS Code)
1. Open this folder in VS Code.
2. Open terminal (\`Ctrl + \`\`\`).
3. Create virtual environment:
   \`\`\`bash
   python -m venv venv
   .\\venv\\Scripts\\activate   # Windows
   source venv/bin/activate  # macOS / Linux
   \`\`\`
4. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`
5. Train model:
   \`\`\`bash
   python train_model.py
   \`\`\`
6. Run Flask web app:
   \`\`\`bash
   python app.py
   \`\`\`
7. Open in browser:
   \`http://127.0.0.1:5000/\`
`
  },
  {
    name: 'index.html',
    path: 'templates/index.html',
    language: 'html',
    category: 'web',
    description: 'Flask Jinja2 HTML template with input form, result card and evaluation section',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fake News Detection Using Machine Learning | MCA Mini Project</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body>
    <header class="navbar">
        <div class="nav-container">
            <div class="logo">
                <span class="logo-icon">🛡️</span>
                <span class="logo-text">TruthLens <span class="badge">MCA Project</span></span>
            </div>
            <nav class="nav-links">
                <a href="#detector" class="nav-link active">Detector</a>
                <a href="#metrics" class="nav-link">Model Metrics</a>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <section class="hero-section">
            <div class="hero-pill">Machine Learning Classification Pipeline</div>
            <h1 class="hero-title">Fake News Detection Using Machine Learning</h1>
            <p class="hero-subtitle">
                An NLP web application that classifies news articles using TF-IDF text vectorization 
                and a Logistic Regression model trained on verified datasets.
            </p>
        </section>

        {% if not model_ready %}
        <div class="alert-box warning-alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-body">
                <strong>Model file not detected!</strong>
                <p>Run <code>python train_model.py</code> in your project directory to train and generate <code>fake_news_model.pkl</code>.</p>
            </div>
        </div>
        {% endif %}

        {% if error_message %}
        <div class="alert-box error-alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-body">
                <strong>Input Notice:</strong> {{ error_message }}
            </div>
        </div>
        {% endif %}

        <section id="detector" class="detector-card">
            <div class="card-header">
                <div>
                    <h2 class="card-title">Analyze News Article</h2>
                    <p class="card-desc">Paste the news headline or complete article text below.</p>
                </div>
            </div>

            <form method="POST" action="/" id="newsForm">
                <div class="input-wrapper">
                    <label for="news_text" class="input-label">News Content / Headline</label>
                    <textarea 
                        name="news_text" 
                        id="news_text" 
                        rows="7" 
                        placeholder="Paste article headline and text here..."
                        required
                    >{{ user_input }}</textarea>
                </div>

                <div class="button-group">
                    <button type="submit" class="btn btn-primary" id="submitBtn">
                        <span class="btn-text">Check News</span>
                        <span class="btn-spinner" id="spinner" style="display: none;">⏳ Analyzing...</span>
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('news_text').value=''">
                        Clear Text
                    </button>
                </div>
            </form>

            {% if prediction_label %}
            <div class="result-card result-{{ prediction_class }}">
                <div class="result-top">
                    <div class="result-badge-container">
                        <span class="result-icon">{% if prediction_class == 'real' %}✅{% else %}🚨{% endif %}</span>
                        <div>
                            <span class="result-tagline">Classification Result</span>
                            <h3 class="result-label">{{ prediction_label }}</h3>
                        </div>
                    </div>
                    {% if confidence_score is not none %}
                    <div class="score-container">
                        <span class="score-label">Model Estimated Probability</span>
                        <span class="score-value">{{ confidence_score }}%</span>
                    </div>
                    {% endif %}
                </div>
                <div class="result-explanation">
                    <small class="score-note">
                        * Note: The percentage represents the machine learning model's statistical confidence based on lexical patterns in the training data, not a factual guarantee.
                    </small>
                </div>
            </div>
            {% endif %}
        </section>
    </main>

    <footer class="app-footer">
        <p><strong>Disclaimer:</strong> This application is an educational machine learning demonstration and not a substitute for professional fact-checking.</p>
    </footer>
</body>
</html>
`
  },
  {
    name: 'style.css',
    path: 'static/style.css',
    language: 'css',
    category: 'web',
    description: 'Clean responsive CSS with light background, dark blue and purple accents',
    content: `:root {
    --bg-page: #f8fafc;
    --bg-card: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --border-color: #e2e8f0;
    --primary: #4f46e5;
    --primary-hover: #4338ca;
    --real-bg: #ecfdf5;
    --real-border: #10b981;
    --real-text: #065f46;
    --fake-bg: #fff1f2;
    --fake-border: #f43f5e;
    --fake-text: #9f1239;
}
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: var(--bg-page);
    color: var(--text-primary);
    line-height: 1.6;
    margin: 0;
    padding: 0;
}
.navbar { background: #fff; border-bottom: 1px solid var(--border-color); padding: 1rem 2rem; }
.main-content { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
.detector-card { background: #fff; border: 1px solid var(--border-color); border-radius: 12px; padding: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
textarea { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 1rem; }
.btn { padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-secondary { background: #f1f5f9; color: var(--text-secondary); margin-left: 0.5rem; }
.result-card { margin-top: 1.5rem; padding: 1.25rem; border-radius: 8px; border: 2px solid; }
.result-real { background: var(--real-bg); border-color: var(--real-border); color: var(--real-text); }
.result-fake { background: var(--fake-bg); border-color: var(--fake-border); color: var(--fake-text); }
`
  },
  {
    name: 'Fake.csv',
    path: 'dataset/Fake.csv',
    language: 'csv',
    category: 'dataset',
    description: 'Sample labeled fake news dataset for training and verification',
    content: `title,text,subject,date
"BOMBSHELL: Proof High-Ranking Officials Hidden Video Shows Global Agenda","Shocking video leaked by anonymous whistleblower exposes secret meetings where world elites conspired to manipulate elections. The mainstream media refuses to broadcast this undeniable proof. Share this everywhere before big tech takes down this footage!","News","December 20, 2017"
"WATCH: Celebrity Slams Corrupt Politicians In Live Uncensored Broadcast","During an impromptu live feed, prominent star went completely off-script and dropped massive truth bombs about political donors and clandestine slush funds. The network pulled the plug immediately, but we captured the entire footage right here.","News","October 14, 2017"
"BREAKING: Scientists Confirm Miracle Herb Cures All Viruses Instantly","Big pharma executives are in sheer panic today after independent researchers discovered an ancient Himalayan root that eradicates all viral pathogens in under 24 hours. Government health agencies have ordered the report suppressed.","politics","September 5, 2017"
`
  },
  {
    name: 'True.csv',
    path: 'dataset/True.csv',
    language: 'csv',
    category: 'dataset',
    description: 'Sample labeled real news dataset for training and verification',
    content: `title,text,subject,date
"Senate passes stopgap spending bill to avert government shutdown","WASHINGTON (Reuters) - The U.S. Senate voted 65 to 27 on Thursday to approve a short-term spending bill that will fund federal agencies through mid-January, preventing a looming shutdown of government operations. The measure now heads to the White House for the president's signature.","politicsNews","December 21, 2017"
"Central bank holds benchmark interest rate steady amid cooling inflation","NEW YORK (Reuters) - Federal Reserve policymakers concluded a two-day monetary policy meeting by keeping the benchmark federal funds rate unchanged between 5.25% and 5.50%. Chair Jerome Powell noted that while inflation has decelerated significantly over the past year, central bankers require further evidence before initiating policy easing.","politicsNews","November 1, 2017"
"European Union and Britain reach milestone agreement on trade framework","BRUSSELS (Reuters) - Negotiators for the European Union and the United Kingdom announced a preliminary agreement on post-Brexit trade arrangements following months of intense diplomatic talks in Brussels. The draft treaty covers mutual recognition of manufacturing standards and bilateral customs inspection protocols.","worldnews","October 18, 2017"
`
  }
];

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('fake_news_detection') || zip;

  for (const file of PROJECT_FILES) {
    folder.file(file.path, file.content);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fake_news_detection_mca_project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
