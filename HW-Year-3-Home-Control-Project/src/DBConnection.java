
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DBConnection{

	private Connection conn;
	private Device d1;
	
	public void setup() throws SQLException {
		try {
			conn = DriverManager.getConnection("jdbc:localhost","root","password");

			//			Statement stmt = conn.createStatement( );
			//			stmt.executeUpdate("INSERT INTO CurrentDevices " + "VALUES ('leo', 100, '09:00', '09:10')");		

		} catch (Exception e) {
			System.out.println("Error - no connection to database");
		} finally {
			conn.close();
		}
	}
	
	public void sendingData(Device d, String currentTime) throws SQLException {
		setup();
		Statement stmt = conn.createStatement( );
		String values = "VALUES ('2', '" + d.getDeviceName() + "', 100)";
		stmt.executeUpdate("INSERT INTO runningdevices " + values);
	}
	
	public void main() throws SQLException {
		d1 = new Device("Heating", 300,"06:30", "08:30");
		//setup();
		sendingData(d1, "10:00");
	}
}