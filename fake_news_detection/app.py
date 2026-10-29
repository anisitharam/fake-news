"""
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
                # Preprocessing and vectorization are automatically handled inside the saved pipeline
                # Label 0 = Fake News, Label 1 = Real News
                pred_class_id = int(model_pipeline.predict([user_input])[0])
                
                # Get prediction probabilities for both classes [P(Fake), P(Real)]
                if hasattr(model_pipeline, "predict_proba"):
                    probabilities = model_pipeline.predict_proba([user_input])[0]
                    # Probability associated with the predicted class
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
    # Host on 127.0.0.1 and port 5000 for standard local Flask development
    print("\n" + "="*60)
    print(" MCA Mini Project: Fake News Detection Using Machine Learning ")
    print(" Running locally on: http://127.0.0.1:5000")
    print("="*60 + "\n")
    app.run(host="127.0.0.1", port=5000, debug=True)
