
import type { ScanRequest, ScanResult } from '../types/scan'

export async function createScan(
    request: ScanRequest
): Promise<ScanResult> {
    const response = await fetch('/api/v1/scans', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        let message = `Scan failed (HTTP ${response.status})`

        try {
            const errorBody: { error?: string } = await response.json()

            if (errorBody.error) {
                message = errorBody.error
            }
        } catch {
            // Use the default HTTP error message.
        }

        throw new Error(message)
    }

    const result: ScanResult = await response.json()
    return result
}
