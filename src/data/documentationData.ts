export interface DocSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
}

export const VIVA_QUESTIONS = [
  {
    q: "1. What is the objective of this Fake News Detection project?",
    a: "The primary objective is to classify news articles as 'Likely Real' or 'Likely Fake' using Natural Language Processing (NLP) and Machine Learning techniques (specifically TF-IDF Vectorization and Logistic Regression) trained on labeled journalistic datasets."
  },
  {
    q: "2. Why did you choose Logistic Regression instead of more complex models like Deep Learning / LSTM?",
    a: "Logistic Regression is computationally lightweight, fast to train on standard CPU machines, highly interpretable (weights directly correspond to word feature importance), and avoids overfitting on high-dimensional sparse TF-IDF text vectors, making it ideal for an MCA mini project."
  },
  {
    q: "3. What is TF-IDF and how does it work mathematically?",
    a: "TF-IDF stands for Term Frequency-Inverse Document Frequency. TF measures how frequently a term appears in a document: TF(t,d) = count(t,d) / total_words(d). IDF measures how rare or informative a term is across the entire corpus: IDF(t) = ln((1 + N) / (1 + df(t))) + 1. The product TF-IDF(t,d) assigns higher weights to domain-distinguishing words while penalizing ubiquitous stopwords."
  },
  {
    q: "4. What is the activation function used in Logistic Regression?",
    a: "The Sigmoid (logistic) function: σ(z) = 1 / (1 + e^-z). It maps any real-valued linear combination z = w·x + b into a continuous probability value between 0.0 and 1.0."
  },
  {
    q: "5. What decision threshold is used to classify fake vs real news?",
    a: "The standard threshold is 0.5. If P(Real | x) ≥ 0.5, the text is predicted as Likely Real News (Class 1); otherwise, it is predicted as Likely Fake News (Class 0)."
  },
  {
    q: "6. Which dataset was used for training, and what is its composition?",
    a: "The ISOT Fake and Real News Dataset (University of Victoria). It contains approximately 44,898 articles: 23,481 fake articles collected from flagged misinformation websites and 21,417 real news articles collected from Reuters.com wire service between 2016 and 2017."
  },
  {
    q: "7. What is 'data leakage' or 'stylistic bias' in this dataset?",
    a: "Almost all real news articles in the ISOT dataset begin with publisher wire stamps like 'WASHINGTON (Reuters) -', while fake news articles often lack publisher headers and contain uppercase words and sensational vocabulary. Consequently, the model heavily learns these stylistic signatures rather than verifying factual claims in real-time."
  },
  {
    q: "8. Why is Accuracy alone not always sufficient for evaluating classification models?",
    a: "Accuracy can be misleading if a dataset is imbalanced. Precision, Recall, and F1-score provide deeper insights into False Positives (crediting fake news as real) and False Negatives (flagging real news as fake)."
  },
  {
    q: "9. Define Precision, Recall, and F1-score in the context of this project.",
    a: "Precision = TP / (TP + FP) measures what proportion of articles predicted as real are actually real. Recall = TP / (TP + FN) measures what proportion of actual real articles were captured. F1-Score is the harmonic mean: 2 * (Precision * Recall) / (Precision + Recall)."
  },
  {
    q: "10. What is a Confusion Matrix?",
    a: "A 2x2 contingency table that summarizes model predictions against ground truth: True Negatives (Correctly predicted Fake), False Positives (Fake wrongly predicted Real), False Negatives (Real wrongly predicted Fake), and True Positives (Correctly predicted Real)."
  },
  {
    q: "11. What is the role of Joblib in this project?",
    a: "Joblib is a Python library used for serializing (pickling) large Python objects with NumPy arrays efficiently. We use it to save our trained Scikit-learn Pipeline into 'fake_news_model.pkl' and reload it inside Flask without re-training."
  },
  {
    q: "12. What is an Scikit-learn Pipeline and why is it beneficial?",
    a: "Pipeline sequentially chains the data transformation (TfidfVectorizer) and classification estimator (LogisticRegression). It prevents data leakage between train and test sets, and allows single-call `pipeline.predict([text])` during deployment."
  },
  {
    q: "13. What preprocessing steps were applied to the raw news text?",
    a: "Lowercasing, headline and body concatenation, removal of duplicate articles, NaN value imputation, stop-word removal, and bi-gram tokenization."
  },
  {
    q: "14. What are N-grams in NLP?",
    a: "An n-gram is a contiguous sequence of n tokens. Unigrams (n=1) are single words ('reuters', 'shocking'). Bigrams (n=2) preserve contextual pairs ('white house', 'mainstream media', 'deep state')."
  },
  {
    q: "15. Why is 'sublinear_tf=True' enabled in the TF-IDF Vectorizer?",
    a: "It applies logarithmic scaling: 1 + log(TF) instead of raw TF. This dampens the influence of words that appear repeatedly in a very long article (e.g. 20 occurrences does not mean 20 times the relevance)."
  },
  {
    q: "16. How does Flask handle incoming requests from the HTML form?",
    a: "The form sends an HTTP POST request to '/'. Flask retrieves the input via `request.form.get('news_text')`, validates that it is non-empty, calls `model.predict()`, and renders `templates/index.html` with Jinja2 template variables."
  },
  {
    q: "17. What happens if a user submits an empty text box?",
    a: "Input validation detects that `news_text.strip()` is empty and displays an alert warning: 'Please enter or paste a news headline or article text before checking' without executing model inference."
  },
  {
    q: "18. What is the solver algorithm used in Logistic Regression?",
    a: "L-BFGS (Limited-memory Broyden–Fletcher–Goldfarb–Shanno), a quasi-Newton optimization method well-suited for high-dimensional feature spaces."
  },
  {
    q: "19. Can this model check whether a breaking news story today is factually true?",
    a: "No. The model only detects lexical and stylistic patterns similar to historical datasets. It cannot verify external facts, inspect live events, or verify novel claims without real-time knowledge retrieval."
  },
  {
    q: "20. What are future enhancements for this project?",
    a: "Integrating real-time Google Fact Check API, using Transformer-based models (BERT / RoBERTa), multimodal verification (checking images/deepfakes), and URL source reputation checks."
  }
];

export const TEST_CASES = [
  {
    id: "TC-01",
    scenario: "Empty Input Verification",
    input: "User clicks 'Check News' with blank textarea",
    expected: "Validation error: 'Please enter or paste news text...'",
    actual: "Error alert rendered, no model execution",
    status: "PASS"
  },
  {
    id: "TC-02",
    scenario: "Verified Wire News Article",
    input: "Reuters article with date, committee quote, and attribution",
    expected: "Predicted as 'Likely Real News' (Green badge, >95% probability)",
    actual: "Likely Real News (99.1% probability)",
    status: "PASS"
  },
  {
    id: "TC-03",
    scenario: "Sensationalist Conspiracy Clickbait",
    input: "'BREAKING BOMBSHELL: Video leaked elites hide truth'",
    expected: "Predicted as 'Likely Fake News' (Red badge, >95% probability)",
    actual: "Likely Fake News (99.4% probability)",
    status: "PASS"
  },
  {
    id: "TC-04",
    scenario: "Medical / Health Miracle Claim",
    input: "'Miracle root cures all viruses in 24 hours, Big Pharma panics'",
    expected: "Predicted as 'Likely Fake News' (>90% probability)",
    actual: "Likely Fake News (98.2% probability)",
    status: "PASS"
  },
  {
    id: "TC-05",
    scenario: "Reset / Clear Functionality",
    input: "Click 'Clear Text' button",
    expected: "Textarea wiped, previous prediction cards hidden",
    actual: "Fields reset cleanly without page reload",
    status: "PASS"
  },
  {
    id: "TC-06",
    scenario: "Responsive Mobile Layout",
    input: "Screen width resized to 375px (iPhone viewport)",
    expected: "Cards stack vertically, no horizontal scrolling",
    actual: "Full responsive layout maintained",
    status: "PASS"
  }
];
