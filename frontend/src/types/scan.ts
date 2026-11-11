
/**
 * Represents the severity of a security finding.
 */
export type Severity = 'ERROR' | 'WARNING' | 'INFO'

/**
 * A single security finding returned by the scanner.
 */
export interface Finding {
    ruleId: string
    message: string
    severity: Severity
    line: number
}

/**
 * Represents the lifecycle of a code scan.
 */
export type ScanStatus =
    | 'QUEUED'
    | 'RUNNING'
    | 'COMPLETED'
    | 'FAILED'

/**
 * Represents the result of analyzing submitted source code.
 */
export interface ScanResult {
    id: string
    status: ScanStatus
    findings: Finding[]
    error?: string
}
