package homeSim;

public class ClockDisplay {
	private NumberDisplay hours;
    private NumberDisplay minutes;
    private String displayString;    // simulates the actual display
    
    public ClockDisplay()
    {
        hours = new NumberDisplay(24);
        minutes = new NumberDisplay(60);
        updateDisplay();
    }

    public String getMinutes() {
    	return minutes.getDisplayValue();
    }
    
    public String getHours() {
    	return hours.getDisplayValue();
    }
    
    public void timeTick()
    {
        minutes.increment();
//        if(minutes.getValue() == 0) {  // it just rolled over!
//            hours.increment();
//        }
        updateDisplay();
    }

    public void rolledOver() {
    	hours.increment();
    	updateDisplay();
    }
    
    public void setTime(int hour, int minute)
    {
        hours.setValue(hour);
        minutes.setValue(minute);
        updateDisplay();
    }


    public String getTime()
    {
        return displayString;
    }
    
    private void updateDisplay()
    {
        displayString = hours.getDisplayValue() + ":" + 
                        minutes.getDisplayValue();
    }
}