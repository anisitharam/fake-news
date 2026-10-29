import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, PlayCircle, FolderCheck, CheckCircle2 } from 'lucide-react';
import { downloadProjectZip } from '../data/projectFiles';

export const SetupGuideTab: React.FC = () => {
  const [os, setOs] = useState<'windows' | 'mac'>('windows');
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      num: 1,
      title: 'Download & Extract the Project Folder',
      desc: 'Download the complete Python project ZIP and extract it to a directory on your machine (e.g. C:\\Projects\\fake_news_detection).',
      command: null,
      action: (
        <button
          onClick={() => downloadProjectZip()}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
        >
          <span>Download fake_news_detection.zip</span>
        </button>
      )
    },
    {
      num: 2,
      title: 'Open in Visual Studio Code',
      desc: 'Launch VS Code, click "File > Open Folder...", select the unzipped "fake_news_detection" folder, and open an integrated terminal using Ctrl + ` (backtick).',
      command: null,
      action: null
    },
    {
      num: 3,
      title: 'Create and Activate Virtual Environment',
      desc: 'Isolate dependencies using Python venv so your global system packages remain untouched.',
      command: os === 'windows' 
        ? `python -m venv venv\n.\\venv\\Scripts\\activate` 
        : `python3 -m venv venv\nsource venv/bin/activate`,
    },
    {
      num: 4,
      title: 'Install Required Python Packages',
      desc: 'Installs Flask, Scikit-learn, Pandas, NumPy, and Joblib as defined in requirements.txt.',
      command: `pip install -r requirements.txt`,
    },
    {
      num: 5,
      title: 'Train the Machine Learning Model',
      desc: 'Executes train_model.py, reads dataset CSVs, prints evaluation metrics (Accuracy 98.7%), and saves fake_news_model.pkl.',
      command: `python train_model.py`,
    },
    {
      num: 6,
      title: 'Launch the Flask Web Application',
      desc: 'Starts the local Flask web server with debug mode enabled on port 5000.',
      command: `python app.py`,
    },
    {
      num: 7,
      title: 'Open in Web Browser',
      desc: 'Open your web browser and visit the local server address:',
      command: `http://127.0.0.1:5000/`,
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-indigo-600" />
            <span>VS Code & Local Execution Guide</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Follow these exact terminal commands to run the Python Flask project on your laptop.
          </p>
        </div>

        {/* OS Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setOs('windows')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              os === 'windows' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🪟 Windows (PowerShell)
          </button>
          <button
            onClick={() => setOs('mac')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              os === 'mac' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🍎 macOS / Linux (Bash)
          </button>
        </div>
      </div>

      {/* Step by Step instructions */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.num} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                {step.action}
              </div>
            </div>

            {step.command && (
              <div className="relative group bg-slate-950 text-slate-200 rounded-xl p-3.5 font-mono text-xs overflow-x-auto flex items-center justify-between">
                <pre className="pr-10">{step.command}</pre>
                <button
                  onClick={() => copyToClipboard(step.command!, index)}
                  className="absolute right-2 top-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] font-sans font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedStep === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Troubleshooting card */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <span>🛠️ Common Troubleshooting Tips</span>
        </h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>PowerShell ExecutionPolicy error:</strong> If Windows blocks script execution, run <code>Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass</code> in PowerShell.
          </li>
          <li>
            <strong>Missing CSV error:</strong> Ensure <code>Fake.csv</code> and <code>True.csv</code> exist inside the <code>dataset/</code> folder. Run <code>python dataset/create_sample_dataset.py</code> if you need sample files instantly.
          </li>
          <li>
            <strong>Port 5000 occupied:</strong> Change <code>port=5000</code> to <code>port=5001</code> in <code>app.py</code> if another service uses port 5000.
          </li>
        </ul>
      </div>
    </div>
  );
};
