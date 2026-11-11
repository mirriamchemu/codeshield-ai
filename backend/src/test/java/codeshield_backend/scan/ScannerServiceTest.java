
package codeshield_backend.scan;

import codeshield_backend.scan.dto.ScanResponse.ScanFinding;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ScannerServiceTest {

    @Autowired
    private ScannerService scannerService;

    @Test
    void detectsHardcodedPassword() throws Exception {
        String source = """
                public class LoginService {
                    private String password = "admin123";
                }
                """;

        List<ScanFinding> findings = scannerService.scan(source);

        assertEquals(1, findings.size());
        assertEquals(
                "codeshield.java.hardcoded-password",
                findings.get(0).ruleId());
        assertEquals("WARNING", findings.get(0).severity());
        assertEquals(2, findings.get(0).line());
    }

    @Test
    void cleanCodeProducesNoFindings() throws Exception {
        String source = """
                public class Main {
                    private String greeting = "Hello CodeShield AI!";
                }
                """;

        List<ScanFinding> findings = scannerService.scan(source);

        assertTrue(findings.isEmpty());
    }

    @Test
    void rejectsEmptySourceCode() {
        assertThrows(
                IllegalArgumentException.class,
                () -> scannerService.scan("   "));
    }

    @Test
    void rejectsOversizedSourceCode() {
        String source = "a".repeat(100_001);

        assertThrows(
                IllegalArgumentException.class,
                () -> scannerService.scan(source));
    }
}
