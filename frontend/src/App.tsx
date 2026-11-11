
import { Code2, LayoutDashboard, History, ShieldCheck } from 'lucide-react'
import './App.css'
import { useState } from 'react'
import CodeEditor from './components/editor/CodeEditor'
import FindingsPanel from './components/findings/FindingsPanel'
import type { Finding } from './types/scan'

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

  /**
   * Temporary mock scan.
   * This does not analyze the submitted source code.
   */
  function handleAnalyze() {
    setIsScanning(true)
    setHasScanned(false)

    // Simulate a scanner response for UI development.
    setTimeout(() => {
      setFindings([
        {
          ruleId: 'codeshield.java.hardcoded-password',
          message: 'A password appears to be hardcoded in the source code.',
          severity: 'WARNING',
          line: 3,
        },
      ])

      setHasScanned(true)
      setIsScanning(false)
    }, 800)
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
