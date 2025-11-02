package com.example;

import java.awt.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Timer;
import java.util.TimerTask;

public class Alert1 {

    private static final String DATE_FORMAT = "yyyy-MM-dd HH:mm";

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.out.println("Usage: java -jar alert-system.jar \"YYYY-MM-DD HH:MM\"");
            return;
        }

        String dateTimeStr = args[0];
        LocalDateTime alertTime;
        try {
            alertTime = LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ofPattern(DATE_FORMAT));
        } catch (Exception e) {
            System.out.println("Invalid date format. Use: " + DATE_FORMAT);
            return;
        }

        long delay = Duration.between(LocalDateTime.now(), alertTime).toMillis();
        if (delay <= 0) {
            System.out.println("Time already passed!");
            return;
        }

        System.out.println("Alert scheduled for " + alertTime);

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                showNotification("Alert", "It's now " + alertTime + "!");
                System.out.println("ALERT: Time reached (" + alertTime + ")!!!!!!!!!!!!!!!!");
            }
        }, delay);
    }

    private static void showNotification(String title, String message) {
        if (SystemTray.isSupported()) {
            try {
                SystemTray tray = SystemTray.getSystemTray();
                Image image = Toolkit.getDefaultToolkit().createImage("icon.png");
                TrayIcon trayIcon = new TrayIcon(image, "Alert");
                trayIcon.setImageAutoSize(true);
                trayIcon.setToolTip("Alert Notification");
                tray.add(trayIcon);
                trayIcon.displayMessage(title, message, TrayIcon.MessageType.INFO);
            } catch (Exception e) {
                System.out.println("System tray not supported, printing message instead.");
                System.out.println(">>> " + message);
            }
        } else {
            System.out.println(">>> " + message);
        }
    }
}
