
import { Code2, LayoutDashboard, History, ShieldCheck } from 'lucide-react'
import './App.css'
import { useState } from 'react'
import CodeEditor from './components/editor/CodeEditor'
import FindingsPanel from './components/findings/FindingsPanel'
import type { Finding } from './types/scan'
import { createScan } from './api/scans'

function App() {

  const [sourceCode, setSourceCode] = useState<string>(
    `public class Main {
        public static void main(String[] args) {
            System.out.println("Hello CodeShield AI!");
        }
    }`
  )


  const [findings, setFindings] = useState<Finding[]>([])
  const [hasScanned, setHasScanned] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

  /**
   * Temporary mock scan.
   * This does not analyze the submitted source code.
   */
  async function handleAnalyze() {
    setIsScanning(true)
    setHasScanned(false)
    setScanError(null)
    setFindings([])

    try {
      const result = await createScan({
        language: 'java',
        filename: 'Main.java',
        sourceCode,
      })

      if (result.status === 'FAILED') {
        throw new Error(result.error ?? 'Code analysis failed.')
      }

      if (result.status !== 'COMPLETED') {
        throw new Error(`Unexpected scan status: ${result.status}`)
      }

      setFindings(result.findings)
      setHasScanned(true)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during analysis.'

      setScanError(message)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div className="brand">
          <ShieldCheck size={28} />
          <span>CodeShield AI</span>
        </div>

        <nav className="navigation" aria-label="Main navigation">
          <div className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>

          <div className="nav-item">
            <Code2 size={20} />
            <span>Code Scanner</span>
          </div>

          <div className="nav-item">
            <History size={20} />
            <span>Scan History</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <p>CodeShield AI</p>
          <small>Security & Reliability Platform</small>
        </div>
      </aside>

      {/* Main workspace */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Security Dashboard</h1>
            <p>Analyze Java source code for potential vulnerabilities.</p>
          </div>

          <span className="language-badge">Java</span>
        </header>

        <section className="workspace">
          <div className="panel">

            <div className="panel-header editor-panel-header">
              <h2>Java Code Editor</h2>

              <button
                type="button"
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={isScanning || !sourceCode.trim()}
              >
                {isScanning ? 'Analyzing...' : 'Analyze Code'}
              </button>
            </div>


            <div className="panel-body code-editor-container">
              <CodeEditor
                value={sourceCode}
                onChange={setSourceCode}
              />
            </div>

          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Security Findings</h2>
            </div>

            <div className="panel-body">
              {scanError && (
                <div className="scan-error" role="alert">
                  <strong>Scan failed:</strong> {scanError}
                </div>
              )}

              <FindingsPanel
                findings={findings}
                hasScanned={hasScanned}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
