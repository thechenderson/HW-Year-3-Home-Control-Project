
public class Device {
	
	//Device variables
	private String deviceName;
	private int devicePower;
	private String timeOn;
	private String timeOff;
	
	//Device Type: 
	//1.Home Essentials (heating, light etc.)
	//2.Main Devices (Fridge, freezer etc.)
	//3.Electronic Devices (chargers, tv etc.)
	private int deviceType;
	
	
	//Room Assigned:
	//0.NA
	//1.Kitchen
	//2.Bathroom
	//3.Living Room
	//4.Bedroom1
	//5.Bedroom2
	private int roomAssigned;

	
	public Device (String d, int powerReq, String tOn, String tOff, int type, int room) {
		this.deviceName = d;
		this.devicePower = powerReq;
		this.timeOn = tOn;
		this.timeOff = tOff;
		this.deviceType = type;
		this.roomAssigned = room;
		
	}
	
	
	
	public String getTimeOn() {
		   return this.timeOn;
	}
	
	public String getTimeOff() {
		   return this.timeOff;
	}
	
	public String getDeviceName() {
		   return this.deviceName;
	}
	
	public int getDevicePower() {
		   return this.devicePower;
	}
	
	public int getDeviceType() {
		   return this.deviceType;
	}
	
	public int getRoomAssigned() {
		   return this.roomAssigned;
	}
}
