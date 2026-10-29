import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { predictNewsArticle, SAMPLE_ARTICLES, PredictionResult } from '../data/mlModel';

interface DetectorTabProps {
  onNavigateToMetrics: () => void;
  onNavigateToCode: () => void;
}

export const DetectorTab: React.FC<DetectorTabProps> = ({ onNavigateToMetrics, onNavigateToCode }) => {
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckNews = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullText = `${headline} ${bodyText}`.trim();

    if (!fullText) {
      setError('Please enter a news headline or paste article text to analyze.');
      setResult(null);
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate realistic NLP pipeline tokenization latency
    setTimeout(() => {
      try {
        const prediction = predictNewsArticle(fullText);
        setResult(prediction);
      } catch (err: any) {
        setError(err.message || 'An error occurred during prediction.');
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    }, 450);
  };

  const handleClear = () => {
    setHeadline('');
    setBodyText('');
    setResult(null);
    setError(null);
  };

  const loadSample = (index: number) => {
    const sample = SAMPLE_ARTICLES[index];
    setHeadline(sample.title);
    setBodyText(sample.content.replace(sample.title, '').trim());
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TF-IDF + Logistic Regression NLP Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Fake News Detection Using Machine Learning
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Verify journalistic authenticity by examining linguistic patterns, syntactic markers, and vocabulary frequencies 
          trained on the 44,000+ article ISOT news dataset.
        </p>
      </section>

      {/* Main Detector Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-100 overflow-hidden">
        {/* Card Header & Sample Chips */}
        <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Input News Article</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste the title and body below, or pick a verified benchmark sample to test instantly.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1 uppercase">Try Sample:</span>
            <button
              type="button"
              onClick={() => loadSample(0)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              ✅ Real: Senate Bill (Reuters)
            </button>
            <button
              type="button"
              onClick={() => loadSample(1)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              ✅ Real: Fed Inflation (Reuters)
            </button>
            <button
              type="button"
              onClick={() => loadSample(2)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors shadow-2xs"
            >
              🚨 Fake: Elite Cabal Leak
            </button>
            <button
              type="button"
              onClick={() => loadSample(3)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors shadow-2xs"
            >
              🚨 Fake: Miracle Cure Hoax
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheckNews} className="p-5 sm:p-6 space-y-4">
          <div>
            <label htmlFor="headline" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              News Headline / Title (Optional)
            </label>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g., Senate passes stopgap spending bill to avert government shutdown..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-800"
            />
          </div>

          <div>
            <label htmlFor="bodyText" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Article Content / Paragraphs
            </label>
            <textarea
              id="bodyText"
              rows={6}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Paste complete article text here (e.g., 'WASHINGTON (Reuters) - The U.S. Senate voted 65 to 27 on Thursday...')"
              className="w-full px-4 py-3 text-sm bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 leading-relaxed font-normal"
            />
          </div>

          {/* Validation Notice */}
          {error && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-md shadow-indigo-100 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Extracting TF-IDF Features...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Check News</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Clear</span>
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Model: Logistic Regression (C=1.0, L-BFGS, n-gram=1,2)
            </span>
          </div>
        </form>

        {/* Prediction Result Section */}
        {result && (
          <div className="border-t border-slate-200 p-5 sm:p-7 bg-slate-50/40 space-y-6 animate-fadeIn">
            <div 
              className={`p-6 rounded-2xl border-2 transition-all ${
                result.classType === 'real'
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-sm shadow-emerald-100'
                  : 'bg-rose-50/70 border-rose-500 shadow-sm shadow-rose-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
                <div className="flex items-center gap-3.5">
                  <div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      result.classType === 'real'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {result.classType === 'real' ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : (
                      <XCircle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                      Machine Learning Prediction
                    </span>
                    <h3 
                      className={`text-2xl font-black tracking-tight ${
                        result.classType === 'real' ? 'text-emerald-900' : 'text-rose-900'
                      }`}
                    >
                      {result.label}
                    </h3>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-2xs text-left sm:text-right">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Estimated Probability
                  </span>
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {result.confidenceScore}%
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">confidence</span>
                  </div>
                </div>
              </div>

              {/* Confidence Meter Bar */}
              <div className="mt-4 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span className="text-rose-700">Fake ({result.probabilityFake}%)</span>
                  <span className="text-slate-400 text-[11px]">Threshold: 50.0%</span>
                  <span className="text-emerald-700">Real ({result.probabilityReal}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${result.probabilityFake}%` }}
                    className="h-full bg-rose-500 transition-all duration-500" 
                  />
                  <div 
                    style={{ width: `${result.probabilityReal}%` }}
                    className="h-full bg-emerald-500 transition-all duration-500" 
                  />
                </div>
              </div>

              {/* Explanatory summary */}
              <div className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {result.classType === 'real' ? (
                  <p>
                    <strong>Linguistic Assessment:</strong> This text exhibits strong journalistic markers 
                    (institutional attribution, date tags, neutral vocabulary, and formal syntax) closely aligned with 
                    verified news wire reports in the training corpus.
                  </p>
                ) : (
                  <p>
                    <strong>Linguistic Assessment:</strong> This text exhibits high concentrations of sensationalist phrasing, 
                    urgency triggers, emotional modifiers, or informal writing conventions characteristic of misinformation in the training corpus.
                  </p>
                )}
              </div>
            </div>

            {/* Feature Attribution Analysis */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>Key TF-IDF Word Attributions</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Terms found in your text that contributed most heavily to the Logistic Regression score:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToMetrics}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>View All Weights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {result.topAttributions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.topAttributions.map((item, idx) => (
                    <div
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        item.impact === 'real'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <span className="font-mono">"{item.token}"</span>
                      <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                        item.impact === 'real' ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                      }`}>
                        {item.impact === 'real' ? `+${item.weight.toFixed(2)}` : item.weight.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No high-weight vocabulary tokens specifically dominated this text. Classification was made on low-frequency general terms.
                </p>
              )}

              {/* Stylistic signals */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Wire Attribution</span>
                  <span className="font-semibold text-slate-800">
                    {result.detectedPatterns.wireAttribution ? '✅ Detected (e.g. Reuters)' : '❌ Not Found'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Punctuation Clustering</span>
                  <span className="font-semibold text-slate-800">
                    {result.detectedPatterns.excessivePunctuation ? '🚨 Exclamation Clusters' : '✅ Standard'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">All-Caps Triggers</span>
                  <span className="font-semibold text-slate-800">
                    {result.detectedPatterns.allCapsWords.length > 0
                      ? `${result.detectedPatterns.allCapsWords.length} words`
                      : 'None'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Sensational Terms</span>
                  <span className="font-semibold text-slate-800">
                    {result.detectedPatterns.sensationalistTerms.length > 0
                      ? `${result.detectedPatterns.sensationalistTerms.length} flagged`
                      : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer Footer */}
      <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-5 flex items-start gap-3.5">
        <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold">Important Academic Note on Model Scope & Truth Verification:</strong>
          <p className="mt-1">
            This machine learning model predicts whether an article resembles historical real or fake news based exclusively on 
            <strong> statistical word frequencies (TF-IDF) and stylistic grammar patterns</strong>. It does not perform active web scraping, 
            database cross-referencing, or live investigative fact-checking. A fictional claim written in formal journalistic tone may be classified 
            as real, whereas authentic informal reporting may be flagged as fake.
          </p>
        </div>
      </div>

      {/* Quick Architecture Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-2">
            1
          </div>
          <h4 className="text-sm font-bold text-slate-900">Text Preprocessing</h4>
          <p className="text-xs text-slate-500 mt-1">
            Headline & body merged, lowercased, punctuation handled, and stop words removed.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-2">
            2
          </div>
          <h4 className="text-sm font-bold text-slate-900">TF-IDF Vectorization</h4>
          <p className="text-xs text-slate-500 mt-1">
            10,000 top n-grams (unigrams & bigrams) converted into scaled document vectors with sublinear TF.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
            3
          </div>
          <h4 className="text-sm font-bold text-slate-900">Logistic Regression</h4>
          <p className="text-xs text-slate-500 mt-1">
            Sigmoid activation computes calibrated posterior probability P(Real | text) in real time.
          </p>
        </div>
      </div>
    </div>
  );
};
