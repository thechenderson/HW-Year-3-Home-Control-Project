import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DBConnection{

	private Connection conn;
	private int counter;
	
	public void setup() throws SQLException {
		try {
			conn = DriverManager.getConnection("jdbc:mysql://mysql-server-1.macs.hw.ac.uk/ml85","ml85","7FgNF2Z3KJ");

			//			Statement stmt = conn.createStatement( );
			//			stmt.executeUpdate("INSERT INTO CurrentDevices " + "VALUES ('leo', 100, '09:00', '09:10')");		

		} catch (Exception e) {
			System.out.println("Error - no connection to database");
		} finally {
			conn.close();
		}
	}
	
//	public void sendingData(Device d, String currentTime) throws SQLException {
//		setup();
//		counter ++;
//		Statement stmt = conn.createStatement( );
//		String values = "VALUES ('"+ counter + "'," + d.getDeviceName() + "', 1, '09:00', '09:10')";
//		stmt.executeUpdate("INSERT INTO devices " + values);
//	}

}