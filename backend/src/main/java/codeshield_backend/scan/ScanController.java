
package codeshield_backend.scan;

import codeshield_backend.scan.dto.ScanRequest;
import codeshield_backend.scan.dto.ScanResponse;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/scans")
public class ScanController {

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ScanResponse createScan(@RequestBody ScanRequest request) {
        return new ScanResponse(
                UUID.randomUUID().toString(),
                "QUEUED",
                List.of(),
                null);
    }
}
