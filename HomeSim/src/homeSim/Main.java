package homeSim;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.sql.SQLException;

public class Main {

	//Clock variables
	private static Main m;
	private TimerThread timerThread;
	private static ClockDisplay clock;
	private boolean clockRunning = false;

	//Scan variables
	private static int startTimeH;
	private static int startTimeM;
	private static String homeID;

	//DB Connection
	private static MySQLDB db = new MySQLDB();

	//Devices
	private List<Devices> records = new ArrayList<Devices>();	

	//All devices list
	private ArrayList<Devices> devices = new ArrayList<Devices>();

	//Running devices list
	private ArrayList<runningDevices> runningDevices = new ArrayList<runningDevices>();

	//Device and Room Instances
	protected static Devices d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22, d23, d24;
	protected static runningDevices rD1, rD2, rD3, rD4, rD5, rD6, rD7, rD8, rD9, rD10, rD11, rD12, rD13, rD14, rD15, rD16, rD17, rD18, rD19, rD20, rD21, rD22, rD23, rD24, rD25, rD26, rD27;

	protected static Rooms r1 = new Rooms(1, "Kitchen", "Kitchen", 1, 100, 20);
	protected static Rooms r2 = new Rooms(2, "Parents Bedroom", "Bedroom", 1, 0, 20);
	protected static Rooms r3 = new Rooms(3, "Bens Bedroom", "Bedroom", 1, 0, 20);
	protected static Rooms r4 = new Rooms(4, "Jess Bedroom", "Bedroom", 1, 0, 20);
	protected static Rooms r5 = new Rooms(5, "Living Room", "Living Room", 1, 0, 20);
	protected static Rooms r6 = new Rooms(6, "Downstairs Bathroom", "Bathroom", 1, 0, 20);
	protected static Rooms r7 = new Rooms(7, "Upstairs Bathroom", "Bathroom", 1, 0, 20);
	protected static Rooms r8 = new Rooms(8, "Downstairs Hallway", "Hallway", 1, 0, 20);
	protected static Rooms r9 = new Rooms(9, "Dining Room", "Dining Room", 1, 0, 20);
	protected static Rooms r10 = new Rooms(10, "Upstairs Hallway", "Hallway", 1, 0, 20);
	protected static Rooms r11 = new Rooms(11, "Outside", "Outside", 1, 0, 20);
	protected static Rooms rooms[] = {r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11};

	public Main(){
		clock = new ClockDisplay();
	}

	public void start(int startTimeH, int startTimeM)
	{
		clockRunning = true;
		timerThread = new TimerThread();
		timerThread.start();
		clock.setTime(startTimeH, startTimeM);
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

		//Example info
		System.out.println("What example home would you like to simulate?");
		homeID = scan.nextLine();

		//Ask for start time
		System.out.println("What time would you like to start the simulation at? (24-Hour) ");
		startTimeH = scan.nextInt();

		System.out.println("What time would you like to start the simulation at? (Minutes) ");
		startTimeM = scan.nextInt();

		//Current time
		db.setup();
		m = new Main();
		m.start(startTimeH, startTimeM);

		scan.close();
		//		conn.close();
	}

	class TimerThread extends Thread
	{
		public void run()
		{
			String currentTime, deviceStart, deviceEnd = null;

			//Device List
			d1 = new Devices(1, "Fridge", 150, "Appliance", r1.getRoomID());
			d2 = new Devices(2, "Freezer", 60, "Appliance", r1.getRoomID());
			d3 = new Devices(3, "Light", 60, "Light", r1.getRoomID());
			d4 = new Devices(4, "Light", 60, "Light", r2.getRoomID());
			d5 = new Devices(5, "Toaster", 80, "Light", r2.getRoomID());
			d6 = new Devices(6, "Phone Charger", 80, "Socket", r2.getRoomID());
			d7 = new Devices(7, "Light", 80, "Light", r3.getRoomID());
			d8 = new Devices(8, "Light", 100, "Light", r4.getRoomID());
			d9 = new Devices(9, "Phone Charger", 4, "Socket", r3.getRoomID());
			d10 = new Devices(10, "Phone Charger", 3, "Socket", r4.getRoomID());
			d11 = new Devices(11, "TV", 200, "TV", r5.getRoomID());
			d12 = new Devices(12, "Sky Box", 15, "TV", r5.getRoomID());
			d13 = new Devices(13, "PS4", 90, "Miscellaneous", r5.getRoomID());
			d14 = new Devices(14, "Light", 80, "Light", r6.getRoomID());
			d15 = new Devices(15, "Light", 80, "Light", r7.getRoomID());
			d16 = new Devices(16, "Electric Shower", 7000, "Heating", r7.getRoomID());
			d17 = new Devices(17, "Electric Razer", 20, "Socket", r7.getRoomID());
			d18 = new Devices(18, "Light", 80, "Light", r8.getRoomID());
			d19 = new Devices(19, "Wifi Box", 20, "Socket", r8.getRoomID());
			d20 = new Devices(20, "Light", 90, "Light", r10.getRoomID());
			d21 = new Devices(21, "Light", 90, "Light", r5.getRoomID());
			d22 = new Devices(22, "Oven", 160, "Light", r1.getRoomID());
			d23 = new Devices(23, "Phone Charger", 3, "Socket", r2.getRoomID());
			d24 = new Devices(24, "Solar Panel", 100, "Solar Panel", r11.getRoomID());
			
			//24 hr devices
			rD1 = new runningDevices (d1, "01:00", "23:59");
			rD2 = new runningDevices (d2, "01:00", "23:59");
			
			//phone chargers
			rD3 = new runningDevices(d6, "01:00", "07:00");
			rD4 = new runningDevices(d9, "01:00", "07:20");
			rD5 = new runningDevices(d10, "01:00", "07:23");
			rD6 = new runningDevices(d23, "01:00", "07:13");
			rD7 = new runningDevices (d16, "07:10", "07:43");
			rD8 = new runningDevices (d11, "07:08", "08:30");
			rD9 = new runningDevices (d5, "07:10", "08:30");
			rD10 = new runningDevices(d13, "16:13", "18:03");//PS4
			rD10 = new runningDevices(d11, "16:10", "18:05");//TV
			rD11 = new runningDevices(d21, "16:10", "18:30");//Living Room Light
			rD12 = new runningDevices(d22, "18:15", "19:00");//Oven
			rD13 = new runningDevices(d3, "18:00", "19:30");
			rD14 = new runningDevices(d11, "19:34", "21:49");//TV
			rD15 = new runningDevices(d11, "19:34", "21:49");//Sky Box
			rD16 = new runningDevices(d15, "20:04", "20:43");//Light
			rD17 = new runningDevices(d16, "20:05", "20:40");//Shower
			rD18 = new runningDevices(d7, "19:31", "22:45");//Ben's Light
			rD19 = new runningDevices(d9, "21:45", "23:59");//Phone Charger
			rD20 = new runningDevices(d8, "20:41", "23:59");//
			rD21 = new runningDevices(d10, "23:45", "23:59");//Phone Charger
			rD22 = new runningDevices(d4, "21:50", "22:45");//Light
			rD23 = new runningDevices(d15, "21:54", "20:32");//Light
			rD24 = new runningDevices(d16, "21:55", "22:31");//Shower
			rD25 = new runningDevices(d6, "22:10", "23:59");//Phone Charger
			rD26 = new runningDevices(d23, "23:53", "23:59");//Phone Charger
			rD27 = new runningDevices(d24, "07:00", "16:43");
			
			
			runningDevices[] devices = {rD1, rD2, rD3, rD4, rD5, rD6, rD7, rD8, rD9, rD10, rD11, rD12, rD13, rD14, rD15, rD16, rD17, rD18, rD19, rD20, rD21, rD22, rD23, rD24, rD25, rD26, rD27};

			while (clockRunning) {
				currentTime = clock.getTime();
				clock.timeTick();
				System.out.println();
				pause();

				String minutes = clock.getMinutes();
				String hours = clock.getHours();

				//Average per hour calculation
				if (hours.equals("00") && minutes.equals("00")) {
					db.dayAverage();
				}
				if(minutes.equals("00")) {  // it just rolled over!
					clock.rolledOver();	
					//update averages
					try {
						db.average(records, homeID);
					} catch (SQLException | ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					currentTime = clock.getTime();
				} 

				System.out.print(currentTime + " ");

				for (runningDevices d: devices) {

					currentTime = clock.getTime();
					deviceStart = d.getTimeOn();
					deviceEnd = d.getTimeOff();

					//device start time 
					String[] startTime = deviceStart.split(":");
					int hStart = Integer.parseInt(startTime[0]);
					int mStart = Integer.parseInt(startTime[1]);
					
					//device start time 
					String[] endTime = deviceEnd.split(":");
					int hEnd = Integer.parseInt(endTime[0]);
					int mEnd = Integer.parseInt(endTime[1]);
					
					//current time
					String[] currTime = currentTime.split(":");
					int hCurrTime = Integer.parseInt(currTime[0]);
					int mCurrTime = Integer.parseInt(currTime[1]);
					
					//Running devices
					if ((deviceStart).equals(currentTime)) {
						runningDevices.add(d);
						try {
							db.addingData(d.getRunningDevice(), currentTime);
						} catch (SQLException e) {
							e.printStackTrace();
						}
					} else if ( hCurrTime > hStart && mCurrTime > mStart && hCurrTime < hEnd && mCurrTime < mEnd) {
						if (!(runningDevices.contains(d))) {
							runningDevices.add(d);
							try {
								db.addingData(d.getRunningDevice(), currentTime);
							} catch (SQLException e) {
								e.printStackTrace();
							}
						}
					}
				}


				//Running devices
				for(homeSim.runningDevices d: runningDevices) {
					System.out.print(d.getRunningDevice().getDeviceName() + ", ");
					deviceEnd = d.getTimeOff();
					records.add(d.getRunningDevice());

					//Random Power Level
					try {
						db.powerLevels(d.getRunningDevice());	
					} catch (SQLException e1) {
						e1.printStackTrace();
					}

					//turning off running devices
					if ((deviceEnd).equals(currentTime)) {
						runningDevices.remove(d);
						try {
							db.deletingData(d.getRunningDevice(), currentTime);
						} catch (SQLException e) {
							e.printStackTrace();
						}
						break;
					}

					String changes = null;
					try {
						changes = db.changesTable(d.getRunningDevice());
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

					//changes table
					if (!(changes == null)) {
						//Changes coming from website
						if (changes.equals("Off")) {
							runningDevices.remove(d);
							try {
								db.deletingData(d.getRunningDevice(), currentTime);
							} catch (SQLException e) {
								e.printStackTrace();
							}
							break;
						} else if (changes.equals("On")) {
							runningDevices.add(d);
							try {
								db.addingData(d.getRunningDevice(), currentTime);
							} catch (SQLException e) {
								e.printStackTrace();
							}
							break;
						}
					}

					for (Rooms r: rooms) {
						int temp = 0;
						try {
							temp = db.roomsTable(r);
//							System.out.println(r.getRoomDisplayName() + " , " + temp);
						} catch (SQLException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}

//						changes to room temp
						if (!(temp == 0)) {
							//compare to room temps
							int i = r.getHeating();
							if (!(temp == i)) {
								System.out.println(temp);
								int j = Integer.valueOf(temp);
								r.setHeating(j);
								System.out.println(r.getRoomDisplayName() + " , " + temp);
							}
						} else {
//							System.out.println("query returning empty");
						}
					}		    
				}
			}
		}
	}
}


