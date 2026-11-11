
package codeshield_backend.scan.dto;

public record ScanRequest(
        String language,
        String filename,
        String sourceCode) {
}
