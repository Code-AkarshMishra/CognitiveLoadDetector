import { Download, Info, Puzzle, X } from "lucide-react";

// Inline Chrome SVG Icon
function ChromeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" />
      <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
      <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  );
}

// Inline Edge / Globe SVG Icon
function EdgeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export default function InstallExtensionModal({ open, onDismiss }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-[24px] border border-slate-200 bg-white text-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Puzzle size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Setup Guide</p>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Install Extension
              </h2>
            </div>
          </div>

          <button
            aria-label="Close setup modal"
            className="rounded-full hover:bg-slate-100 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            type="button"
            onClick={onDismiss}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Introduction */}
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Follow these steps to load the activity tracker extension in your browser. This enables keyboard and mouse monitoring globally across all tabs during your session.
        </p>

        {/* Steps */}
        <div className="mt-6 space-y-4">
          {/* Step 1 */}
          <div className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Download Source Files</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Save the packaged extension ZIP archive onto your computer.
              </p>
              <a
                href="/extension/neurotrack-extension.zip"
                download="neurotrack-extension.zip"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <Download size={13} />
                <span>Download Extension ZIP</span>
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Extract ZIP Archive</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Unzip/Extract the downloaded <code>neurotrack-extension.zip</code> file to a folder on your system.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Open Extensions Page</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Copy and visit the extensions manager in your browser URL bar:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  <ChromeIcon className="h-3 w-3 shrink-0" />
                  <span>chrome://extensions/</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  <EdgeIcon className="h-3 w-3 shrink-0" />
                  <span>edge://extensions/</span>
                </span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              4
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Enable Developer Mode</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Toggle on the <strong>Developer mode</strong> switch (typically found in the top-right corner of the page).
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              5
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Load Unpacked Extension</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Click the <strong>Load unpacked</strong> button (top-left) and select the extracted extension folder.
              </p>
            </div>
          </div>

          {/* Local File URL Warning */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3 text-amber-800">
            <Info size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Testing on local HTML files?</h4>
              <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                If you are testing local files (like <code>file:///A:/...</code>), click <strong>Details</strong> on the loaded extension card inside Chrome/Edge, and toggle on <strong>&quot;Allow access to file URLs&quot;</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            onClick={onDismiss}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            type="button"
          >
            Done
          </button>
        </div>
      </section>
    </div>
  );
}
