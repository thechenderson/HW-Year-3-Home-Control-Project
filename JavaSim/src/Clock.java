import java.text.ParseException;
import java.util.ArrayList;
import java.util.Random;
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

	//Connection
	private static Connection conn;

	//Check for previous device
	private String previousDevice = null;

	//Counter
	private int counter = 0;

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

	private void deletingData(Device d, String currentTime) throws SQLException {
		setup();
		Statement stmt = conn.createStatement();
		String condition = "WHERE deviceDisplayName = '" + d.getDeviceName() + "'";
		stmt.executeUpdate("DELETE FROM runningdevices " + condition);
		previousDevice = d.getDeviceName();

	}

	public static void setup() throws SQLException {
		try {
			conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/ecospark","root","password");

			//			Statement stmt = conn.createStatement( );
			//			stmt.executeUpdate("INSERT INTO CurrentDevices " + "VALUES ('leo', 100, '09:00', '09:10')");		

		} catch (Exception e) {
			System.out.println("Error - no connection to database");
		} finally {

		}
	}

	private void sendingData(Device d, String currentTime) throws SQLException {
		//could vary the power number for graph
		Random r = new Random();
		int randPower = 0;
		
		if (previousDevice != d.getDeviceName()) {
			//				setup();
			
			//Device Type: 
			//1.Home Essentials (heating, light etc.)
			//2.Main Devices (Fridge, freezer etc.)
			//3.Electronic Devices (chargers, tv etc.)
			
			if (d.getDeviceType() == 1) {
				//Limit for home essentials
				randPower = r.nextInt((100 - 10) + 1) + 10;
			} else if (d.getDeviceType() == 2) {
				//Limit for main devices
				randPower = r.nextInt((1000 - 100) + 1) + 100;
			} else if (d.getDeviceType() == 2) {
				//Limit for main devices
				randPower = r.nextInt((100 - 0) + 1) + 0;
			}
			
			counter ++;
			Statement stmt = conn.createStatement();
			String values = "VALUES ("+ counter + ", '" + d.getDeviceName() + "'," + randPower +","+ d.getDeviceType() +","+ d.getRoomAssigned()+ ")";
			stmt.executeUpdate("INSERT INTO runningdevices " + values);
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


	public static void main(String[] args) throws ParseException, SQLException
	{
		Scanner scan = new Scanner(System.in);

		//Ask for start time
		System.out.println("What time would you like to start the simulation at? (24-Hour) ");
		startTimeH = scan.nextInt();

		System.out.println("What time would you like to start the simulation at? (Minutes) ");
		startTimeM = scan.nextInt();

		//Current time
		setup();
		c = new Clock();
//		db.average;
		c.start(startTimeH, startTimeM);

		scan.close();
//		conn.close();

	}

class TimerThread extends Thread
{
	public void run()
	{
		String currentTime, deviceStart, deviceEnd = null;

		//Temporally hard coding devices in
		d1 = new Device("Heating", 100,"06:30", "08:30", 1, 1);
		d2 = new Device("Bedroom Light", 60, "07:00", "11:00", 1, 1); //could be turned off by application
		d3 = new Device("Kitchen Light", 60, "07:10", "07:30", 1, 1);
		d4 = new Device("Bathroom Light", 60,"07:30", "07:40", 1, 1);
		d5 = new Device("Plug", 80, "10:00", "11:00", 3, 1);

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
}
}

