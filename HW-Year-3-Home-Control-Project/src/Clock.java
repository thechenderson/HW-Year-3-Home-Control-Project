
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Scanner;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.KeyStroke;
import javax.swing.SwingConstants;
import javax.swing.border.EmptyBorder;

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
						System.out.println(currentTime + " " + d.getDeviceName());
						clock.timeTick();
					}
					
				}
				
				System.out.print(currentTime + " ");
				
				for(Device d: runningDevices) {
					System.out.print(d.getDeviceName() + " ");
					deviceEnd = d.getTimeOff();
					
					if ((deviceEnd).equals(currentTime)) {
						runningDevices.remove(d);
						break;
					}
				}
				
				clock.timeTick();
				System.out.println();
				pause();
				
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


	public static void main(String[] args) throws ParseException
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
		
	}

}


