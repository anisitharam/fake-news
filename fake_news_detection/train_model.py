"""
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
        print("\n" + "="*70)
        print("ERROR: Dataset files not found!")
        print("="*70)
        print(f"Looked for:")
        print(f"  - Fake News: {fake_path}")
        print(f"  - True News: {true_path}")
        print("\nPlease ensure you have placed 'Fake.csv' and 'True.csv' inside the 'dataset/' folder.")
        print("You can download the full ISOT dataset from Kaggle:")
        print("  https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset")
        print("\nAlternatively, run 'python dataset/create_sample_dataset.py' to generate")
        print("a quick starter sample dataset for testing.")
        print("="*70 + "\n")
        return False
    return True

def clean_text(text):
    """Basic text preprocessing function for news content."""
    if not isinstance(text, str):
        return ""
    # Convert to lowercase
    text = text.lower()
    return text

def train_and_evaluate():
    dataset_dir = os.path.join(os.path.dirname(__file__), "dataset")
    fake_csv_path = os.path.join(dataset_dir, "Fake.csv")
    true_csv_path = os.path.join(dataset_dir, "True.csv")
    model_output_path = os.path.join(os.path.dirname(__file__), "fake_news_model.pkl")

    # Step 1: Check if dataset files exist
    if not check_dataset_exists(fake_csv_path, true_csv_path):
        sys.exit(1)

    print("\n[Step 1/5] Loading datasets using Pandas...")
    try:
        df_fake = pd.read_csv(fake_csv_path)
        df_true = pd.read_csv(true_csv_path)
    except Exception as e:
        print(f"Error reading CSV files: {e}")
        sys.exit(1)

    print(f" -> Loaded {len(df_fake):,} fake news articles.")
    print(f" -> Loaded {len(df_true):,} real news articles.")

    # Step 2: Assign labels
    # Label definition: 0 = Fake News, 1 = Real News
    df_fake["label"] = 0
    df_true["label"] = 1

    # Step 3: Combine datasets and preprocess
    print("\n[Step 2/5] Preprocessing and combining headline + text content...")
    df = pd.concat([df_fake, df_true], ignore_index=True)

    # Check for headline and text columns
    title_col = "title" if "title" in df.columns else df.columns[0]
    text_col = "text" if "text" in df.columns else df.columns[1]

    # Fill NaN values with empty string
    df[title_col] = df[title_col].fillna("")
    df[text_col] = df[text_col].fillna("")

    # Combine title and text to provide rich context for the TF-IDF vectorizer
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
    # Stratify ensures balanced proportion of fake and real articles in train and test splits
    print("\n[Step 3/5] Splitting dataset into 80% Training and 20% Testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f" -> Training samples: {len(X_train):,}")
    print(f" -> Testing samples:  {len(X_test):,}")

    # Step 5: Build Machine Learning Pipeline
    # TF-IDF Vectorizer converts text tokens into frequency-inverse document frequency features
    # Logistic Regression fits an S-shaped sigmoid probability curve to classify binary outcomes
    print("\n[Step 4/5] Training TF-IDF Vectorizer + Logistic Regression Model...")
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

    # Train the pipeline
    pipeline.fit(X_train, y_train)
    print(" -> Model training complete!")

    # Step 6: Evaluate Model on Test Data
    print("\n[Step 5/5] Evaluating model performance on unseen test data...")
    y_pred = pipeline.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)

    print("\n" + "="*50)
    print("      MODEL EVALUATION REPORT (TEST DATA)")
    print("="*50)
    print(f" Accuracy : {accuracy * 100:.2f}%")
    print(f" Precision: {precision * 100:.2f}%")
    print(f" Recall   : {recall * 100:.2f}%")
    print(f" F1-Score : {f1 * 100:.2f}%")
    print("\nConfusion Matrix:")
    print("                Predicted Fake (0)   Predicted Real (1)")
    print(f"Actual Fake (0)       {cm[0][0]:<15}       {cm[0][1]:<15}")
    print(f"Actual Real (1)       {cm[1][0]:<15}       {cm[1][1]:<15}")
    print("="*50)

    print("\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Fake News (0)", "Real News (1)"]))

    # Step 7: Save trained pipeline to disk
    joblib.dump(pipeline, model_output_path)
    print(f"\n[Success] Model successfully saved to: {model_output_path}")
    print("You can now launch the web application by running: python app.py\n")

if __name__ == "__main__":
    train_and_evaluate()
