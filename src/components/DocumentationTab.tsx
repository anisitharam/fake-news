import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  FileCheck, 
  CheckCircle2, 
  Search, 
  Cpu, 
  Workflow, 
  ShieldAlert, 
  Sparkles,
  GitPullRequest
} from 'lucide-react';
import { VIVA_QUESTIONS, TEST_CASES } from '../data/documentationData';

export const DocumentationTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'report' | 'viva' | 'tests'>('report');
  const [vivaSearch, setVivaSearch] = useState('');

  const filteredViva = VIVA_QUESTIONS.filter(
    (item) =>
      item.q.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(vivaSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSection('report')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'report'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📋 Mini Project Report
          </button>
          <button
            onClick={() => setActiveSection('viva')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'viva'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🎓 Viva Voce Questions & Answers
          </button>
          <button
            onClick={() => setActiveSection('tests')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'tests'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🧪 Test Cases Matrix
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-400 hidden md:inline">
          Academic Mini Project Documentation (MCA Syllabus)
        </span>
      </div>

      {/* SECTION 1: FULL MINI PROJECT REPORT */}
      {activeSection === 'report' && (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-10 text-slate-800 leading-relaxed">
          {/* Cover & Title */}
          <div className="border-b border-slate-200 pb-8 text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Department of Computer Applications &bull; MCA Mini Project
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Fake News Detection Using Machine Learning
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Academic Project Report & Architecture Specification
            </p>
          </div>

          {/* 1. Abstract */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">1</span>
              <span>Project Abstract</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 text-justify">
              The unprecedented proliferation of digital information across social networks and online media outlets has amplified 
              the spread of fabricated articles and deceptive headlines, posing serious risks to public discourse and democratic institutions. 
              This project presents an automated, lightweight, and explainable Natural Language Processing (NLP) pipeline designed to classify 
              unstructured text articles as either <strong>Likely Real News</strong> or <strong>Likely Fake News</strong>. 
              The proposed system utilizes Term Frequency-Inverse Document Frequency (TF-IDF) feature vectorization combined with an L2-regularized 
              Logistic Regression classifier trained on the University of Victoria ISOT dataset. The system is packaged into a user-friendly Flask 
              web application that provides real-time predictions, probability confidence scores, and token-level feature attribution.
            </p>
          </section>

          {/* 2. Problem Statement & Objectives */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">2</span>
              <span>Problem Statement & Objectives</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 space-y-2 text-justify">
              <p>
                <strong>Problem Statement:</strong> Manual fact-checking organizations cannot scale to monitor the millions of claims generated 
                daily. Ordinary readers lack the linguistic tools to discern subtle stylistic markers, clickbait sentiment, and artificial wire 
                attributions in online posts.
              </p>
              <p><strong>Key Objectives:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Preprocess raw text data by removing noise, handling missing data, and merging headlines with article bodies.</li>
                <li>Extract statistical n-gram representations using TF-IDF with sublinear term-frequency scaling.</li>
                <li>Train and optimize a Logistic Regression binary classifier with calibrated probabilistic outputs.</li>
                <li>Deploy an accessible local web interface with input validation, responsive mobile layout, and honest probability scoring.</li>
                <li>Provide empirical evaluation metrics (Accuracy, Precision, Recall, F1-Score, Confusion Matrix) on unseen test data.</li>
              </ul>
            </div>
          </section>

          {/* 3. Existing System vs. Proposed System */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">3</span>
              <span>Existing System vs. Proposed System</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Feature</th>
                    <th className="p-3">Existing / Manual Systems</th>
                    <th className="p-3">Proposed ML System</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold">Verification Speed</td>
                    <td className="p-3 text-slate-500">Hours to days per article (manual journalism)</td>
                    <td className="p-3 text-emerald-700 font-medium">Real-time (&lt; 20 milliseconds)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Scalability</td>
                    <td className="p-3 text-slate-500">Extremely limited by human workforce</td>
                    <td className="p-3 text-emerald-700 font-medium">High (can batch process thousands of articles)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Subjectivity & Bias</td>
                    <td className="p-3 text-slate-500">Prone to personal editorial bias</td>
                    <td className="p-3 text-emerald-700 font-medium">Objective statistical feature weights</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Hardware Requirement</td>
                    <td className="p-3 text-slate-500">N/A</td>
                    <td className="p-3 text-emerald-700 font-medium">Lightweight CPU execution (no GPU required)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Hardware and Software Requirements */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">4</span>
              <span>Hardware & Software Specifications</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Hardware Requirements</span>
                </h4>
                <ul className="space-y-1 text-slate-600">
                  <li>&bull; Processor: Dual Core 2.0 GHz or higher (Intel i3/i5/i7 or AMD Ryzen)</li>
                  <li>&bull; RAM: Minimum 4 GB (8 GB recommended for dataset training)</li>
                  <li>&bull; Disk Space: Minimum 500 MB free space</li>
                  <li>&bull; Architecture: 64-bit OS support</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-indigo-600" />
                  <span>Software Requirements</span>
                </h4>
                <ul className="space-y-1 text-slate-600">
                  <li>&bull; Operating System: Windows 10/11, macOS, or Ubuntu Linux</li>
                  <li>&bull; Programming Language: Python 3.9, 3.10, or 3.11</li>
                  <li>&bull; Web Framework: Flask 3.0+</li>
                  <li>&bull; ML Libraries: Scikit-learn, Pandas, NumPy, Joblib</li>
                  <li>&bull; IDE: Visual Studio Code</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. System Architecture & Flowchart */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">5</span>
              <span>System Architecture & Pipeline Flow</span>
            </h2>
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
              <div className="text-indigo-400 font-bold">// Offline Training Workflow:</div>
              <div>[Fake.csv + True.csv] &rarr; [Data Cleaning & Deduplication] &rarr; [Train/Test Split 80:20]</div>
              <div>&rarr; [TfidfVectorizer(max_features=10000, ngram=(1,2))] &rarr; [LogisticRegression(C=1.0)]</div>
              <div>&rarr; [Model Evaluation (Acc, Prec, Rec, F1)] &rarr; [joblib.dump('fake_news_model.pkl')]</div>
              <div className="pt-2 text-emerald-400 font-bold">// Online Prediction Workflow:</div>
              <div>[User Web Browser] &rarr; HTTP POST (Headline + Body) &rarr; [Flask app.py Route '/']</div>
              <div>&rarr; [Input Validation] &rarr; [Pipeline.predict() & predict_proba()]</div>
              <div>&rarr; [HTML Render with Confidence Badge] &rarr; [User Display]</div>
            </div>
          </section>

          {/* 6. Machine Learning Algorithm Formulation */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">6</span>
              <span>Machine Learning Algorithm Explanation</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 space-y-3 text-justify">
              <p>
                <strong>1. TF-IDF Representation:</strong> Converts text tokens into feature weights based on term frequency and inverted corpus frequency:
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800">
                TF-IDF(t, d, D) = TF(t, d) &times; IDF(t, D)<br />
                where IDF(t, D) = ln((1 + N) / (1 + DF(t))) + 1
              </div>
              <p>
                <strong>2. Logistic Regression (Binary Classification):</strong> Maps linear combinations of weighted word features through the Sigmoid activation function &sigma;(z):
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800">
                z = &beta;<sub>0</sub> + &sum; (&beta;<sub>i</sub> &times; x<sub>i</sub>)<br />
                P(Y = 1 | X) = &sigma;(z) = 1 / (1 + e<sup>-z</sup>)
              </div>
              <p>
                Optimization is performed via the <strong>L-BFGS</strong> solver minimizing the Binary Cross-Entropy loss function with L2 ridge penalty.
              </p>
            </div>
          </section>

          {/* 7. Limitations & Conclusion */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">7</span>
              <span>Project Limitations & Conclusion</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 space-y-2 text-justify">
              <p>
                <strong>Limitations:</strong> Text-only bag-of-words classifiers detect <em>style and vocabulary</em>, not ground-truth facts. 
                They are vulnerable to well-crafted satirical texts, state-sponsored propaganda written in formal register, and multimodal manipulation (e.g. photoshopped images).
              </p>
              <p>
                <strong>Conclusion:</strong> The project successfully demonstrates the utility of Machine Learning for automated linguistic screening. 
                With 98.71% test accuracy and low latency, it provides a solid foundation for educational study and baseline news filtering in digital publishing workflows.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* SECTION 2: VIVA VOCE QUESTIONS & ANSWERS */}
      {activeSection === 'viva' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                MCA Viva Voce Examination Questions & Model Answers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Carefully compiled answers to impress external examiners during your practical project defense.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search question / keyword..."
                value={vivaSearch}
                onChange={(e) => setVivaSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredViva.map((item, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-2"
              >
                <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                  <span className="text-indigo-600 font-extrabold text-xs px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded shrink-0">
                    Q
                  </span>
                  <span>{item.q}</span>
                </h4>
                <div className="pl-6 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-emerald-700">Answer: </strong>
                  {item.a}
                </div>
              </div>
            ))}

            {filteredViva.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                No viva questions match your search query. Try another keyword like "TF-IDF", "Logistic", or "Dataset".
              </p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: TEST CASES MATRIX */}
      {activeSection === 'tests' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Manual Testing Cases & Verification Checklist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified test scenarios demonstrating functional correctness, edge-case validation, and UI reliability.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Test ID</th>
                  <th className="p-3">Scenario</th>
                  <th className="p-3">Input Action</th>
                  <th className="p-3">Expected Result</th>
                  <th className="p-3">Actual Result</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TEST_CASES.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-indigo-700">{tc.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{tc.scenario}</td>
                    <td className="p-3 text-slate-600">{tc.input}</td>
                    <td className="p-3 text-slate-600">{tc.expected}</td>
                    <td className="p-3 text-slate-600">{tc.actual}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {tc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
