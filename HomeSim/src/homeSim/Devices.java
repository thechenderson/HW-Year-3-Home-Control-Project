package homeSim;

public class Devices {
	
	//Device variables
	private int deviceID;
	private String deviceName;
	private int devicePower;
//	private String timeOn;
//	private String timeOff;
	private String deviceType;
	private int roomAssigned;

	
	public Devices (int deviceID, String d, int powerReq, String type, int room) {
		this.deviceID = deviceID;
		this.deviceName = d;
		this.devicePower = powerReq;
//		this.timeOn = tOn;
//		this.timeOff = tOff;
		this.deviceType = type;
		this.roomAssigned = room;
	}
	
//	public String getTimeOn() {
//		   return this.timeOn;
//	}
//	
//	public String getTimeOff() {
//		   return this.timeOff;
//	}
	
	public int getDeviceID() {
		   return this.deviceID;
	}
	
	public String getDeviceName() {
		   return this.deviceName;
	}
	
	public int getDevicePower() {
		   return this.devicePower;
	}
	
	public String getDeviceType() {
		   return this.deviceType;
	}
	
	public int getRoomAssigned() {
		   return this.roomAssigned;
	}
}

