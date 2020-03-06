
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Scanner;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class Clock {

	//Clock variables
//	private JFrame frame;
//	private JLabel label;
	private static ClockDisplay clock;
	private boolean clockRunning = false;
	private TimerThread timerThread;

	//Current time
	private static Clock c;
	private static int startTimeH;
	private static int startTimeM;

	//Device
	private static Device d1, d2, d3, d4, d5;
	
	//DBConnection
//	private DBConnection db;
	private static Connection conn;
	
	private String previousDevice = null;

	public Clock(){
		clock = new ClockDisplay();
	}


	public void start(int startTimeH, int startTimeM)
	{
		clockRunning = true;
		timerThread = new TimerThread();
		timerThread.start();
		clock.setTime(startTimeH, startTimeM);
	}
	

	class TimerThread extends Thread
	{
		public void run()
		{
			String currentTime, deviceStart, deviceEnd = null;

			//Temporally hard coding devices in
			d1 = new Device("Heating", 300,"06:30", "08:30");
			d2 = new Device("Bedroom Light", 500, "07:00", "11:00"); //could be turned off by application
			d3 = new Device("Kitchen Light", 500, "07:10", "07:30");
			d4 = new Device("Bathroom Light", 300,"07:30", "07:40");
			d5 = new Device("Plug", 200, "10:00", "11:00");

			Device[] devices = {d1, d2, d3, d4, d5};
			ArrayList<Device> runningDevices = new ArrayList<Device>();

			while (clockRunning) {
				currentTime = clock.getTime();

				for (Device d: devices) {

					currentTime = clock.getTime();

					deviceStart = d.getTimeOn();
					deviceEnd = d.getTimeOff();

					if ((deviceStart).equals(currentTime)) {
						runningDevices.add(d);
						try {
							sendingData(d, currentTime);
							
						} catch (SQLException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						//System.out.println(currentTime + " " + d.getDeviceName());
						clock.timeTick();
					}

				}

				System.out.print(currentTime + " ");

				for(Device d: runningDevices) {
					System.out.print(d.getDeviceName() + " ");
					deviceEnd = d.getTimeOff();
//					try {
//						//sendingData(d, currentTime);
//					} catch (SQLException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}

					if ((deviceEnd).equals(currentTime)) {
						runningDevices.remove(d);
						try {
							deletingData(d, currentTime);
						} catch (SQLException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						break;
					}
				}

				clock.timeTick();
				System.out.println();
				pause();

			}
		}
		
		private void deletingData(Device d, String currentTime) throws SQLException {
			setup();
			Statement stmt = conn.createStatement();
			String condition = "WHERE Name = '" + d.getDeviceName() + "'";
			stmt.executeUpdate("DELETE FROM RunningDevices " + condition);
			previousDevice = d.getDeviceName();
			
		}

		public void setup() throws SQLException {
			try {
				conn = DriverManager.getConnection("jdbc:localhost","root","password");

				//			Statement stmt = conn.createStatement( );
				//			stmt.executeUpdate("INSERT INTO CurrentDevices " + "VALUES ('leo', 100, '09:00', '09:10')");		

			} catch (Exception e) {
				System.out.println("Error - no connection to database");
			} finally {
				
			}
		}
		
		private void sendingData(Device d, String currentTime) throws SQLException {
			//could vary the power number for graph
			if (previousDevice != d.getDeviceName()) {
				setup();
				Statement stmt = conn.createStatement();
				String values = "VALUES ('" + d.getDeviceName() + "'," + d.getPower() + ",'" + d.getTimeOn() + "', '" + d.getTimeOff() + "')";
				stmt.executeUpdate("INSERT INTO CurrentDevices " + values);
				previousDevice = d.getDeviceName();
			}
			
		}

		private void pause()
		{
			try {
				Thread.sleep(600);   // pause for 300 milliseconds
			}
			catch (InterruptedException exc) {
			}
		}
	}


	public static void main(String[] args) throws ParseException, SQLException
	{
		Scanner scan = new Scanner(System.in);
		
		//Ask for start time
		System.out.println("What time would you like to start the simulation at? (24-Hour) ");
		startTimeH = scan.nextInt();

		System.out.println("What time would you like to start the simulation at? (Minutes) ");
		startTimeM = scan.nextInt();

		//Current time
		c = new Clock();
		c.start(startTimeH, startTimeM);
		
		scan.close();
		conn.close();

	}

}
