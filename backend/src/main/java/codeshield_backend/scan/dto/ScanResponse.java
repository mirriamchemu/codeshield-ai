
package codeshield_backend.scan.dto;

import java.util.List;

public record ScanResponse(
        String id,
        String status,
        List<ScanFinding> findings,
        String error) {
    public record ScanFinding(
            String ruleId,
            String message,
            String severity,
            int line) {
    }
}
