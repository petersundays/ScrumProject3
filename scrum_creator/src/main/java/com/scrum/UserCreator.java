package com.scrum;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
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

            // Configurações de conexão com o banco de dados
            String url = "jdbc:mysql://localhost:3306/cesar_pedro_proj3";
            String username = "root";
            String password = "bjacc86t^nXZc)#c";

            // Declaração SQL para inserir um novo usuário na tabela users
            String sql = "INSERT INTO user (username, password, email, first_name, last_name, phone, photo_url, type_of_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            try (
                    // Conectar-se ao banco de dados
                    Connection connection = DriverManager.getConnection(url, username, password);
                    // Preparar a declaração SQL
                    PreparedStatement statement = connection.prepareStatement(sql)
            ) {
                // Configurar os parâmetros da declaração SQL com os valores do usuário
                statement.setString(1, user.getUsername());
                statement.setString(2, user.getPassword());
                statement.setString(3, user.getEmail());
                statement.setString(4, user.getFirstName());
                statement.setString(5, user.getLastName());
                statement.setString(6, user.getPhone());
                statement.setString(7, user.getPhotoURL());

                // Executar a declaração SQL para inserir o usuário na tabela
                int rowsAffected = statement.executeUpdate();

                if (rowsAffected > 0) {
                    System.out.println("User added successfully: " + user);
                } else {
                    System.out.println("Failed to add user");
                }
            } catch (SQLException e) {
                System.out.println("Error adding user to database: " + e.getMessage());
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
