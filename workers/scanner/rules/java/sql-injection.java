
import java.sql.*;

class SqlInjectionTest {

    void vulnerable(Statement stmt, String username)
            throws SQLException {

        // ruleid: codeshield.java.sql-injection-concatenation
        String query = "SELECT * FROM users WHERE name = '" + username + "'";

        stmt.executeQuery(query);
    }

    void safe(Connection connection, String username)
            throws SQLException {

        // ok: codeshield.java.sql-injection-concatenation
        String query = "SELECT * FROM users WHERE name = ?";

        PreparedStatement stmt = connection.prepareStatement(query);

        stmt.setString(1, username);
        stmt.executeQuery();
    }
}
