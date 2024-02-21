package cesarpedroproj3.bean;

import cesarpedroproj3.dto.Task;
import cesarpedroproj3.dto.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import java.util.ArrayList;

@ApplicationScoped
public class UserBean {
    private final String filename = "users.json";
    private ArrayList<User> users;

    public UserBean() {
        File f = new File(filename);
        if (f.exists()) {
            try {
                FileReader filereader = new FileReader(f);
                users = JsonbBuilder.create().fromJson(filereader, new ArrayList<User>() {
                }.getClass().getGenericSuperclass());
                System.out.println("Users: " + users);
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        } else {
            users = new ArrayList<>();
        }
    }

    public ArrayList<User> getUsers() {
        return users;
    }

    public boolean addUser(User user) {

        boolean status = false;
        if (users.add(user)) {
            status = true;
        }
        writeIntoJsonFile();
        return status;
    }

    public User getUser(String username) {
        for (User user : users) {
            if (user.getUsername().equals(username))
                return user;
        }
        return null;
    }

    public boolean updateUser(User user) {
        boolean status = false;

        for (User a : users) {
            if (a.getUsername().equals(user.getUsername())) {
                a.setPassword(user.getPassword());
                a.setEmail(user.getEmail());
                a.setFirstName(user.getFirstName());
                a.setLastName(user.getLastName());
                a.setPhone(user.getPhone());
                a.setPhotoURL(user.getPhotoURL());
                writeIntoJsonFile();
                status = true;
            }
        }
        return status;
    }

    public boolean isAuthenticated(String username, String password) {
        boolean status = false;

        for (User user : users) {
            if (user.getUsername().equals(username) && user.getPassword().equals(password)) {
                status = true;
            }
        }
        return status;
    }

    public boolean isUsernameAvailable(String username) {
        boolean status = true;

        for (User user : users) {
            if (user.getUsername().equals(username)) {
                status = false;
            }
        }
        return status;
    }

    private boolean isEmailFormatValid(String email) {
        // Use a regular expression to perform email format validation
        // This regex is a basic example and may need to be adjusted
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }

    public boolean isEmailValid(String email, String username) {
        // Check if the email format is valid
        if (!isEmailFormatValid(email)) {
            return false;
        }

        // Check if the email is already in use by a different user
        for (User user : users) {
            if (user.getEmail().equals(email) && !user.getUsername().equals(username)) {
                return false;
            }
        }
        return true;
    }



    public boolean isAnyFieldEmpty(User user) {
        boolean status = false;

        if (user.getUsername().isEmpty() ||
                user.getPassword().isEmpty() ||
                user.getEmail().isEmpty() ||
                user.getFirstName().isEmpty() ||
                user.getLastName().isEmpty() ||
                user.getPhone().isEmpty() ||
                user.getPhotoURL().isEmpty()) {
            status = true;
        }
        return status;
    }

    public boolean isPhoneNumberValid(String phone) {
        boolean status = true;
        int i = 0;

        while (status && i < phone.length() - 1) {
            if (phone.length() == 9) {
                for (; i < phone.length(); i++) {
                    if (!Character.isDigit(phone.charAt(i))) {
                        status = false;
                    }
                }
            } else {
                status = false;
            }
        }
        return status;
    }

    public boolean isImageUrlValid(String url) {
        boolean status = true;

        if (url == null) {
            status = false;
        }

        try {
            BufferedImage img = ImageIO.read(new URL(url));
            if (img == null) {
                status = false;
            }
        } catch (IOException e) {
            status = false;
        }

        return status;
    }

    public ArrayList<Task> getUserAndHisTasks(String username) {
        ArrayList<Task> userTasks = null;

        for (User user : users) {
            if (user.getUsername().equals(username)) {
                userTasks = user.getUserTasks();
            }
        }
        return userTasks;
    }

    public boolean addTaskToUser(String username, Task temporaryTask) {
        TaskBean taskBean = new TaskBean();
        boolean done = taskBean.newTask(temporaryTask);
        if (done) {
            getUserAndHisTasks(username).add(temporaryTask);
            writeIntoJsonFile();
        }
        return done;
    }

    public boolean updateTask(String username, Task task) {
        TaskBean taskBean = new TaskBean();
        boolean updated = false;

        if (taskBean.editTask(task, getUserAndHisTasks(username))) {
            writeIntoJsonFile();
            updated = true;
        }
        return updated;
    }

    public boolean removeTask(String username, String id) {
        TaskBean taskBean = new TaskBean();
        boolean removed = false;

        if (taskBean.removeTask(id, getUserAndHisTasks(username))) {
            writeIntoJsonFile();
            removed = true;
        }

        return removed;
    }

    public boolean updateTaskStatus(String username, String taskId, int newStatus) {

        if (newStatus != 100 && newStatus != 200 && newStatus != 300) {
            return false;
        }

        for (User user : users) {
            if (user.getUsername().equals(username)) {
                ArrayList<Task> userTasks = user.getUserTasks();
                for (Task task : userTasks) {
                    if (task.getId().equals(taskId)) {
                        task.setStateId(newStatus);
                        writeIntoJsonFile();
                        return true;
                    }
                }
            }
        }
        return false;
    }



    public void writeIntoJsonFile() {
        Jsonb jsonb = JsonbBuilder.create(new
                JsonbConfig().withFormatting(true));
        try {
            jsonb.toJson(users, new FileOutputStream(filename));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

}