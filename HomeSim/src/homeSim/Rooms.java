package homeSim;

public class Rooms {

	private int roomID;
	private String roomDisplayName;
	private String roomType;
	private int homeID;
	private int average;
	private int heating;
	
	public Rooms (int roomID, String roomDisplayName, String roomType, int homeID, int average, int heating) {
		this.roomID = roomID;
		this.roomDisplayName = roomDisplayName;
		this.roomType = roomType;
		this.homeID = homeID;
		this.average = average;
		this.heating = heating;
	}
	
	//Getters
	public int getRoomID() {
		   return this.roomID;
	}
	public String getRoomDisplayName() {
		   return this.roomDisplayName;
	}
	public String getRoomType() {
		   return this.roomType;
	}
	public int getRoomHomeID() {
		   return this.homeID;
	}
	public int getRoomAverage() {
		   return this.average;
	}
	public int getHeating() {
		   return this.heating;
	}
	
	//Setter
	public void setRoomAverage(int newAver) {
		   this.average = newAver;
	}
	
	//heating changes if web application changes the db value
	public void setHeating(int newHeating) {
		   this.heating = newHeating;
	}
}
