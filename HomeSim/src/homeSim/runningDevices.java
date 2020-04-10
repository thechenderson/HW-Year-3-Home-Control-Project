package homeSim;

public class runningDevices {

	private Devices runningD;
	private String timeOn;
	private String timeOff;
	
	public runningDevices (Devices d, String tOn, String tOff) {
		this.runningD = d;
		this.timeOn = tOn;
		this.timeOff = tOff;
	}
	
	public Devices getRunningDevice() {
		   return this.runningD;
	}
	
	public String getTimeOn() {
		   return this.timeOn;
	}
	
	public String getTimeOff() {
		   return this.timeOff;
	}
}
