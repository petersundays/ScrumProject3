package com.scrum;

import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;

public class TaskCreator {

    private String username;
    private String password;
    private int tasksQuantity;

    public TaskCreator() {
    }

    public TaskCreator(String username, String password, int tasksNumber) {
        this.username = username;
        this.password = password;
        this.tasksQuantity = tasksNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getTasksQuantity() {
        return tasksQuantity;
    }

    public void setTasksQuantity(int tasksQuantity) {
        this.tasksQuantity = tasksQuantity;
    }

    //Function that populates the tasks
    public void create() {
        System.out.println("Creating " + tasksQuantity + " tasks");
        for (int i = 0; i < tasksQuantity; i++) {
            try {
                URL url = new URL("https://www.boredapi.com/api/activity");
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");

                int responseCode = connection.getResponseCode();
                System.out.println("Response code: " + responseCode); // Print response code for troubleshooting

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();
                    String taskData = response.toString();
                    System.out.println("Received task data: " + taskData); // Log received data
                    addTask(parseTask(taskData), username);
                } else {
                    System.out.println("Failed to fetch task data. Response code: " + responseCode);
                }
            } catch (IOException e) {
                System.out.println("Failed to fetch task data: " + e.getMessage()); // Print exception message for troubleshooting
            }
        }
    }



    //Function that parses the task data
    public Task parseTask(String jsonData) {
        Task task = null;
        try {
            // Check if jsonData starts with '{', indicating a valid JSON object
            if (jsonData.startsWith("{")) {
                JSONObject jsonObject = new JSONObject(jsonData);
                String title = jsonObject.getString("type");
                String description = jsonObject.getString("activity");

                int priority = generatePriority();
                String initialDateString = generateDate();
                String endDateString = generateDate(initialDateString);

                LocalDate initialDate=transformDate(initialDateString);
                LocalDate endDate=transformDate(endDateString);

                task = new Task(title, description, priority, initialDate, endDate);
            } else {
                System.out.println("Received invalid JSON data: " + jsonData);
            }
        } catch (JSONException e) {
            System.out.println("Failed to parse task data: " + e.getMessage());
        }
        return task;
    }


    //Function that adds the task
    public void addTask(Task task, String usernameValue) {
        try {
            String urlString = String.format("http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/%s/addTask", usernameValue);
            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);
            connection.setRequestProperty("username", usernameValue);
            connection.setRequestProperty("password", password);
            JSONObject jsonTask =new JSONObject(task);
            connection.getOutputStream().write(jsonTask.toString().getBytes());
            connection.getOutputStream().flush();
            connection.getOutputStream().close();


            int responseCode = connection.getResponseCode();
            BufferedReader reader;

            if (responseCode == HttpURLConnection.HTTP_OK) {

                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                System.out.println("Task added successfully: " + task + " for " + username);
            } else {

                reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));

            }

            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();


            // Parse the JSON response to get the message
            JSONObject jsonResponse = new JSONObject(response.toString());

            String message = jsonResponse.getString("message");
             System.out.println("Response message: " + message);

        } catch (Exception e) {
            System.out.println("Failed to fetch task data" + e.getMessage());
        }
    }

    //Function that returns random int, the int shoul be 100, 200 or 300
    public int generatePriority() {
        Random random = new Random();
        int priority = random.nextInt(3) + 1;
        priority *= 100;
        return priority;
    }

    //function that returns a date in the format "yyyy-MM-dd" starting from today and in format string
    public String generateDate() {
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        return formatter.format(date);
    }

    //function that returns a date after the date passed as parameter in the format "yyyy-MM-dd" and in format string
    public String generateDate(String date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Calendar c = Calendar.getInstance();
        try {
            c.setTime(formatter.parse(date));
        } catch (Exception e) {
            e.printStackTrace();
        }
        c.add(Calendar.DATE, 1);
        return formatter.format(c.getTime());
    }

    public LocalDate transformDate(String date){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate dateFormated = LocalDate.parse(date, formatter);
        return dateFormated;
    }
}
