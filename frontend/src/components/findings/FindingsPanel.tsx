
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import type { Finding } from '../../types/scan'

interface FindingsPanelProps {
    findings: Finding[]
    hasScanned: boolean
}

function FindingsPanel({ findings, hasScanned }: FindingsPanelProps) {
    if (!hasScanned) {
        return (
            <div className="findings-empty">
                <Info size={32} />
                <p>Run a scan to see security findings.</p>
            </div>
        )
    }

    if (findings.length === 0) {
        return (
            <div className="findings-empty">
                <CheckCircle2 size={32} />
                <p>No security findings detected.</p>
            </div>
        )
    }

    return (
        <div className="findings-list">
            <p className="findings-summary">
                {findings.length} potential security
                {findings.length === 1 ? ' issue' : ' issues'} detected
            </p>

            {findings.map((finding, index) => (
                <article
                    key={`${finding.ruleId}-${finding.line}-${index}`}
                    className="finding-card"
                >
                    <div className="finding-heading">
                        {finding.severity === 'ERROR' ? (
                            <AlertCircle className="severity-error" size={20} />
                        ) : finding.severity === 'WARNING' ? (
                            <AlertTriangle className="severity-warning" size={20} />
                        ) : (
                            <Info className="severity-info" size={20} />
                        )}

                        <strong>{finding.severity}</strong>
                        <span className="finding-line">Line {finding.line}</span>
                    </div>

                    <p>{finding.message}</p>
                    <code>{finding.ruleId}</code>
                </article>
            ))}
        </div>
    )
}

export default FindingsPanel
