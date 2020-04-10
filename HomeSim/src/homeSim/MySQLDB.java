package homeSim;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.Calendar;
import java.util.Date;


public class MySQLDB extends Main {
	
	//DB connection variables
	private Connection conn;
	private int counter;
	private int faultCount = 0;
	private int dateCounter=0;
	
	//temp
	private String previousDevice;
	
	//Records
	private HashMap dP;
	private List average;
	private int currAverage = 0;
	private int currRoomAverage = 0;
	private int noOfDevices;
	private Date currentDate = new Date();
	private LocalDate currDay;  // Start date
	private LocalDate lastDay;  // Start date
	
	
	private boolean initalAverage = true;
	private Calendar c = Calendar.getInstance();
    
	private LocalDate date = LocalDate.now();
	

	private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
	
	public void setup() throws SQLException {
		try {
			conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/ecospark","root","password");
		} catch (Exception e) {
			System.out.println("Error - no connection to database");
		} //finally {
//			conn.close();
//		}
	}
	
	public void addingData(Devices d, String currenttime ) throws SQLException {
			
		if (previousDevice != d.getDeviceName()) {
			counter ++;
			Statement stmt = conn.createStatement();
			String values = "VALUES ("+ counter + ", '" + d.getDeviceName() + "'," + d.getDevicePower() +",'"+ d.getDeviceType() +"',"+ d.getDeviceID() + "," + d.getRoomAssigned()+ ")";
			stmt.executeUpdate("INSERT INTO runningdevices " + values);
			previousDevice = d.getDeviceName();
			
			//
			//maybe implement running av here
//			average.add(d.getDevicePower());
//			dP.put(counter, d.getDevicePower());
		}
	}
	
	public void deletingData(Devices d, String currentTime) throws SQLException {
		Statement stmt = conn.createStatement();
		String condition = "WHERE rDeviceDisplayName = '" + d.getDeviceName() + "'";
		stmt.executeUpdate("DELETE FROM runningdevices " + condition);
		previousDevice = d.getDeviceName();
	}
	
	public String changesTable (Devices d) throws SQLException {
		String ans = null;
		Statement stmt = conn.createStatement();
		String condition = "WHERE deviceDisplayName = '" + d.getDeviceName() + "'";
		ResultSet rs = stmt.executeQuery("SELECT onOff FROM changes " + condition);
		while(rs.next()) {
			ans = rs.getString("onOff");
		}		
		return ans;
	}
	
	public void powerLevels(Devices d) throws SQLException {
		Random r = new Random();
		int randPower = 0;
		int randFault = r.nextInt((100 - 0) + 1) + 0;
		
		if (!(randFault == 0)) {
			if (d.getDeviceType() == "Appliance") {
				//Limit for home essentials
				randPower = r.nextInt((1000 - 50) + 1) + 50;
			} else if (d.getDeviceType() == "Light") {
				//Limit for lights
				randPower = r.nextInt((100 - 80) + 1) + 80;
			} else if (d.getDeviceType() == "Socket") {
				//Limit for sockets
				randPower = r.nextInt((400 - 80) + 1) + 80;
			} else if (d.getDeviceType() == "TV") {
				//Limit for TVs
				randPower = r.nextInt((1000 - 800) + 1) + 800;
			} else if (d.getDeviceType() == "Heating") {
				//Limit for main devices
				randPower = r.nextInt((900 - 200) + 1) + 200;
			} else if (d.getDeviceType() == "Miscellaneous") {
				//Limit for main devices
				randPower = r.nextInt((50 - 0) + 1) + 0;
			} else if (d.getDeviceType() == "Solar Panel") {
				//Limit for main devices
				randPower = -100;
			}
		} else {
			//creating an fault
			randPower = 0;
			
			Statement stmt = conn.createStatement();
			String condition = "WHERE deviceID = '" + d.getDeviceID() + "';";
			ResultSet rs = stmt.executeQuery("SELECT * FROM faults " + condition);

			if (rs.next() == false) {
				faultCount++;
				int roomID = d.getRoomAssigned();
				Rooms deviceRoom = null;
				
				for (Rooms room : rooms) {
					if (room.getRoomID() == roomID) {
						deviceRoom = room;
					}
				}
				
				stmt = conn.createStatement();
				stmt.executeUpdate("INSERT INTO faults VALUES (" + faultCount + ", " + d.getDeviceID() + ", '" + d.getDeviceName() + "', '" + deviceRoom.getRoomDisplayName() + "'," + "'Device is running but no power.');");
			}
			
		}
		
		Statement stmt = conn.createStatement();
		stmt.executeUpdate("UPDATE runningdevices SET rDevicePower = '" + randPower + "' WHERE rDeviceDisplayName = '" + d.getDeviceName() + "';");
		
	}
	
	public void average(List<Devices> records, String homeID) throws SQLException, ParseException {
		
		//General average
        for (Devices d : records) {
        	currAverage = currAverage + d.getDevicePower();
        }
        if (currAverage != 0 ) {
        	currAverage = currAverage / 60;
        }
        
      //Room averages
        for (Devices d : records) {
        	switch(d.getRoomAssigned()) {
        		case 1:
        			currRoomAverage = r1.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r1.setRoomAverage(currRoomAverage);
            		break;
        		case 2:
        			currRoomAverage = r2.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r2.setRoomAverage(currRoomAverage);
        			break;
        		case 3:
        			currRoomAverage = r3.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r3.setRoomAverage(currRoomAverage);
        			break;
        		case 4:
        			currRoomAverage = r4.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r4.setRoomAverage(currRoomAverage);
        			break;
        		case 5:
        			currRoomAverage = r5.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r5.setRoomAverage(currRoomAverage);
        			break;
        		case 6:
        			currRoomAverage = r6.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r6.setRoomAverage(currRoomAverage);
        			break;
        		case 7:
        			currRoomAverage = r7.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r7.setRoomAverage(currRoomAverage);
        			break;
        		case 8:
        			currRoomAverage = r8.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r8.setRoomAverage(currRoomAverage);
        			break;
        		case 9:
        			currRoomAverage = r9.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r9.setRoomAverage(currRoomAverage);
        			break;
        		case 10:
        			currRoomAverage = r10.getRoomAverage();
            		currRoomAverage = currRoomAverage + d.getDevicePower();
            		r10.setRoomAverage(currRoomAverage);
        			break;
        	}
        }
        if (currRoomAverage != 0 ) {
        	currRoomAverage = currRoomAverage / 60;
        }
        
        //Print average
        System.out.println(currAverage);
        
        Statement stmt = conn.createStatement();
        if (initalAverage = true) {
        	c.setTime(currentDate);
    	    // manipulate date
    		initalAverage = false;
        }
        
        if (currDay != lastDay){
        	System.out.println("insert: ");
        	stmt.executeUpdate("INSERT INTO averagesforh VALUES ('"+ homeID +"', '"+ currDay + "', " + currAverage + ", 8000);");
        	
        	//Room average query
        	for (Rooms r: rooms) {
//        		System.out.println("Rooms: " + r.getRoomAverage());
        		if (r.getRoomAverage() != 0) {
        			stmt.executeUpdate("INSERT INTO averagesforr VALUES ("+ r.getRoomID() +", '"+ currDay + "', " + r.getRoomAverage() + ");");
        		}
        	}
        	lastDay = currDay;
        } else {
//        	System.out.println("update: ");
        	stmt.executeUpdate("UPDATE averagesforh SET averOverallPower = '" + currAverage + "' WHERE date = '" + currDay + "' AND homeID = '" + homeID +"';");
    	
        	for (Rooms r: rooms) {
//        		System.out.println("Rooms: "+ r.getRoomAverage());
        		if (r.getRoomAverage() != 0) {
        			stmt.executeUpdate("UPDATE averagesforr SET averRoomPower = '"+ r.getRoomAverage() + "' WHERE date = '" + currDay + "';");
        		}
        	}
        }           
	}
	//when at 0 set no of devices to 0
	
	@SuppressWarnings("deprecation")
	public void dayAverage() {
		//lastDay = currDay;
	    currAverage = 0;
	    currDay =  LocalDate.now().plusDays(dateCounter);
		dateCounter ++;
	}
	
	public int roomsTable (Rooms r) throws SQLException {
		int ans = 0;
		Statement stmt = conn.createStatement();
		String condition = "WHERE roomDisplayName = '" + r.getRoomDisplayName() + "';";
		ResultSet rs = stmt.executeQuery("SELECT temperature FROM rooms " + condition);
		while(rs.next()) {
			ans = rs.getInt(1);
//			ans = rs.getString("temperature");
		}		
		return ans;
	}
}
