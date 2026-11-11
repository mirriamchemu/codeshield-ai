
package codeshield_backend.scan;

import codeshield_backend.scan.dto.ScanRequest;
import codeshield_backend.scan.dto.ScanResponse;
import codeshield_backend.scan.dto.ScanResponse.ScanFinding;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/scans")
public class ScanController {

    private final ScannerService scannerService;

    public ScanController(ScannerService scannerService) {
        this.scannerService = scannerService;
    }

    @PostMapping
    public ScanResponse createScan(@RequestBody ScanRequest request)
            throws IOException, InterruptedException {

        List<ScanFinding> findings = scannerService.scan(request.sourceCode());

        return new ScanResponse(
                UUID.randomUUID().toString(),
                "COMPLETED",
                findings,
                null);
    }
}
