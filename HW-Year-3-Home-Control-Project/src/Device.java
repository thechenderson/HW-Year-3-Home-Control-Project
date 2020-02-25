
public class Device {
	
	//Device variables
	private int power;
	private String timeOn;
	private String timeOff;
	private String deviceName;

	
	public Device (String d, int powerReq, String tOn, String tOff ) {
		this.deviceName = d;
		this.power = powerReq;
		this.timeOn = tOn;
		this.timeOff = tOff;
		
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
	
	public int getPower() {
		   return this.power;
	}
}
