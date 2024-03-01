package com.scrum;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Random;


public class UserCreator {
    private int usersNumber;

    public UserCreator(int numberOfUsers) {
        this.usersNumber = numberOfUsers;
    }

    //Function that populates the users
    public void create() {
        System.out.println("Creating " + usersNumber + " users");
        for (int i = 0; i < usersNumber; i++) {
            // Make a request to randomuser.me API
            try {
                URL url = new URL("https://randomuser.me/api/");
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");

                int responseCode = connection.getResponseCode();

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    // Parse the JSON response to extract user data and add user
                    String userData = response.toString();
                    // Assuming you have a method parseUserData to extract user data from JSON
                    addUser(parseUser(userData));
                } else {
                    System.out.println("Failed to fetch user data. Response code: " + responseCode);
                }
            } catch (IOException e) {
                System.out.println("Failed to fetch user data" + e.getMessage());
            }
        }
    }

    //Function that parses the user data
    public User parseUser(String jsonData) {
        User user = null;
        try {
            JSONObject jsonObject = new JSONObject(jsonData);
            JSONArray results = jsonObject.getJSONArray("results");

            for (int i = 0; i < results.length(); i++) {
                JSONObject userObject = results.getJSONObject(i);

                String firstName = userObject.getJSONObject("name").getString("first");
                String lastName = userObject.getJSONObject("name").getString("last");
                String username = userObject.getJSONObject("login").getString("username");
                String password = userObject.getJSONObject("login").getString("password");
                String email = userObject.getString("email");
                String phone = generateRandomNumberString();
                String photoURL = userObject.getJSONObject("picture").getString("thumbnail");

                // Create a User object with the extracted data
                user = new User(username, password, email, firstName, lastName, phone, photoURL);
            }
        } catch (JSONException e) {
            System.out.println("Failed to receive user data" + e.getMessage());
        }

        return user;
    }

    //Function that adds the user
    public void addUser(User user) {
        try {
            URL url = new URL("http://localhost:8080/jl_jc_pd_project2_war_exploded/rest/users/register");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);
            connection.setRequestProperty("username", user.getUsername());
            connection.setRequestProperty("password", user.getPassword());
            connection.setRequestProperty("email", user.getEmail());
            connection.setRequestProperty("firstName", user.getFirstName());
            connection.setRequestProperty("lastName", user.getLastName());
            connection.setRequestProperty("phone", user.getPhone());
            connection.setRequestProperty("photoURL", user.getPhotoURL());
            JSONObject jsonUser=new JSONObject(user);
            connection.getOutputStream().write(jsonUser.toString().getBytes());
            connection.getOutputStream().flush();
            connection.getOutputStream().close();

            int responseCode = connection.getResponseCode();
            System.out.println(responseCode);
            BufferedReader reader;
            if (responseCode == HttpURLConnection.HTTP_OK) {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                System.out.println("User added successfully: " + user);
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
            System.out.println("Failed to fetch user data" + e.getMessage());
        }
    }

    public static String generateRandomNumberString() {
        // Create an instance of Random class
        Random random = new Random();

        // Create a StringBuilder to store the generated digits
        StringBuilder stringBuilder = new StringBuilder();

        // Generate 9 random digits and append them to the StringBuilder
        for (int i = 0; i < 9; i++) {
            int digit = random.nextInt(10); // Generate a random digit (0-9)
            stringBuilder.append(digit);
        }

        // Convert the StringBuilder to a String and return it
        return stringBuilder.toString();
    }

    public static void main(String[] args) {
        // Example usage
        String randomString = generateRandomNumberString();
        System.out.println("Random number string with 9 digits: " + randomString);
    }
}
