
package codeshield_backend.scan;

import codeshield_backend.scan.dto.ScanResponse.ScanFinding;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class ScannerService {

    private static final Duration TIMEOUT = Duration.ofSeconds(20);
    private static final int MAX_SOURCE_BYTES = 100_000;
    private static final long MAX_OUTPUT_BYTES = 5_000_000;

    private final JsonMapper objectMapper;
    private final Path semgrepExecutable;
    private final Path rulesFile;

    public ScannerService(
            JsonMapper objectMapper,
            @Value("${codeshield.scanner.executable}") String executable,
            @Value("${codeshield.scanner.rules}") String rules) {

        this.objectMapper = objectMapper;
        this.semgrepExecutable = Path.of(executable)
                .toAbsolutePath()
                .normalize();
        this.rulesFile = Path.of(rules)
                .toAbsolutePath()
                .normalize();
    }

    public List<ScanFinding> scan(String sourceCode)
            throws IOException, InterruptedException {

        validateSource(sourceCode);

        Path tempFile = Files.createTempFile(
                "codeshield-",
                ".java");

        Path outputFile = Files.createTempFile(
                "codeshield-output-",
                ".json");

        try {
            Files.writeString(
                    tempFile,
                    sourceCode,
                    StandardCharsets.UTF_8);

            ProcessBuilder builder = new ProcessBuilder(
                    semgrepExecutable.toString(),
                    "scan",
                    "--config",
                    rulesFile.toString(),
                    "--json",
                    "--metrics=off",
                    tempFile.toString());

            // Redirect stdout to a file so the pipe cannot fill.
            builder.redirectOutput(outputFile.toFile());

            // Keep diagnostic messages out of the JSON.
            builder.redirectError(ProcessBuilder.Redirect.DISCARD);

            Process process = builder.start();

            boolean completed;

            try {
                completed = process.waitFor(
                        TIMEOUT.toMillis(),
                        TimeUnit.MILLISECONDS);
            } catch (InterruptedException e) {
                terminateProcess(process);
                Thread.currentThread().interrupt();
                throw e;
            }

            if (!completed) {
                terminateProcess(process);
                throw new IOException("Semgrep scan timed out.");
            }

            if (Files.size(outputFile) > MAX_OUTPUT_BYTES) {
                throw new IOException(
                        "Semgrep output exceeds the maximum allowed size.");
            }

            String output = Files.readString(
                    outputFile,
                    StandardCharsets.UTF_8);

            JsonNode root = objectMapper.readTree(output);

            if (root == null
                    || !root.path("results").isArray()
                    || !root.path("errors").isArray()) {
                throw new IOException("Invalid Semgrep JSON response.");
            }

            if (process.exitValue() != 0
                    || !root.path("errors").isEmpty()) {
                throw new IOException("Semgrep reported a scanning error.");
            }

            List<ScanFinding> findings = new ArrayList<>();

            for (JsonNode result : root.path("results")) {
                findings.add(new ScanFinding(
                        normalizeRuleId(
                                result.path("check_id").asText()),
                        result.path("extra")
                                .path("message").asText(),
                        result.path("extra")
                                .path("severity").asText(),
                        result.path("start")
                                .path("line").asInt()));
            }

            return findings;

        } finally {
            Files.deleteIfExists(tempFile);
            Files.deleteIfExists(outputFile);
        }
    }

    private void validateSource(String sourceCode) {
        if (sourceCode == null || sourceCode.isBlank()) {
            throw new IllegalArgumentException(
                    "Source code must not be empty.");
        }

        if (sourceCode.getBytes(StandardCharsets.UTF_8).length > MAX_SOURCE_BYTES) {
            throw new IllegalArgumentException(
                    "Source code exceeds the maximum allowed size.");
        }
    }

    private void terminateProcess(Process process)
            throws InterruptedException {

        process.destroy();

        if (!process.waitFor(2, TimeUnit.SECONDS)) {
            process.destroyForcibly();
            process.waitFor();
        }
    }

    private String normalizeRuleId(String ruleId) {
        String marker = "codeshield.java.";
        int index = ruleId.lastIndexOf(marker);

        return index >= 0
                ? ruleId.substring(index)
                : ruleId;
    }
}
