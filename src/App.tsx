/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DetectorTab } from './components/DetectorTab';
import { MetricsTab } from './components/MetricsTab';
import { CodeExplorerTab } from './components/CodeExplorerTab';
import { DocumentationTab } from './components/DocumentationTab';
import { SetupGuideTab } from './components/SetupGuideTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('detector');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'detector' && (
          <DetectorTab 
            onNavigateToMetrics={() => setActiveTab('metrics')} 
            onNavigateToCode={() => setActiveTab('code')}
          />
        )}
        {activeTab === 'metrics' && <MetricsTab />}
        {activeTab === 'code' && <CodeExplorerTab />}
        {activeTab === 'docs' && <DocumentationTab />}
        {activeTab === 'setup' && <SetupGuideTab />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-900 font-bold text-sm">
            <span>Fake News Detection Using Machine Learning</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-indigo-600 font-semibold">MCA Mini Project</span>
          </div>

          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
            <strong>Academic Disclaimer:</strong> This application demonstrates natural language processing with TF-IDF 
            feature vectorization and Logistic Regression classification. Model predictions are statistical estimates based on 
            lexical distributions in training news datasets and do not constitute absolute fact-checking.
          </p>

          <p className="text-[11px] text-slate-400">
            Python &bull; Flask &bull; Scikit-learn &bull; Pandas &bull; Joblib &bull; Tailwind CSS &bull; React
          </p>
        </div>
      </footer>
    </div>
  );
}
