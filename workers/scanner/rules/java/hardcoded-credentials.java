class HardcodedCredentialsTest {

    void vulnerable() {

        // ruleid: codeshield.java.hardcoded-password
        String password = "admin123";

        // ruleid: codeshield.java.hardcoded-password
        String dbSecret = "my-secret-key";
    }

    void safe() {

        // ok: codeshield.java.hardcoded-password
        String username = "admin";

        // ok: codeshield.java.hardcoded-password
        String password = System.getenv("DB_PASSWORD");
    }
}