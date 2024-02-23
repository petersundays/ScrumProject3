package cesarpedroproj3.bean;

import cesarpedroproj3.dao.UserDao;
import cesarpedroproj3.dto.Login;
import cesarpedroproj3.dto.Task;
import cesarpedroproj3.dto.User;
import cesarpedroproj3.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import org.mindrot.jbcrypt.BCrypt;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.Serializable;
import java.net.URL;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;

@Stateless
public class UserBean implements Serializable{

    @EJB
    UserDao userDao;

    private final String filename = "users.json";
    private ArrayList<User> users;

    /*public UserBean() {
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
    }*/

    //Permite ao utilizador entrar na app, gera token
    public String login(Login user){
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null){
            //Verifica se a password coincide com a password encriptada
            if (BCrypt.checkpw(user.getPassword(), userEntity.getPassword())){
                String token = generateNewToken();
                userEntity.setToken(token);
                return token;
            }
        }
        return null;
    }

    //Faz o registo do utilizador, adiciona à base de dados
    public boolean register(User user){

        if (user!=null){

            //Encripta a password usando BCrypt
            String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());

            //Define a password encriptada
            user.setPassword(hashedPassword);

            //Persist o user
            userDao.persist(convertUserDtotoUserEntity(user));
            return true;
        }else
            return false;

    }

    //Apaga todos os registos do utilizador da base de dados
    //Verificar tarefas!!!!!!!
    public boolean delete(String username){

        UserEntity u= userDao.findUserByUsername(username);

        if (u != null){
            userDao.remove(u);
            return true;
        }else
            return false;
    }

    private UserEntity convertUserDtotoUserEntity(User user){
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setEmail(user.getEmail());
        userEntity.setFirstName(user.getFirstName());
        userEntity.setLastName(user.getLastName());
        userEntity.setPhone(user.getPhone());
        userEntity.setPhotoURL(user.getPhotoURL());

        System.out.println(user.getUsername());

        return userEntity;
    }

    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    public boolean logout(String token) {
        UserEntity u= userDao.findUserByToken(token);

        if(u!=null){
            u.setToken(null);
            return true;
        }
        return false;
    }

    public boolean tokenExist(String token){
        if (userDao.findUserByToken(token) != null)
            return true;
        return false;

    }

    public ArrayList<User> getUsers() {
        return users;
    }

    /*public boolean addUser(User user) {

        boolean status = false;
        if (users.add(user)) {
            status = true;
        }
        writeIntoJsonFile();
        return status;
    }*/

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
                //writeIntoJsonFile();
                status = true;
            }
        }
        return status;
    }

    public boolean isAuthenticated(String username, String password) {

        UserEntity user = userDao.findUserByUsernameAndPassword(username,password);
        return user != null;
    }

    public boolean isUsernameAvailable(User user) {

        UserEntity u = userDao.findUserByUsername(user.getUsername());
        boolean status = false;

        if (u==null) {
            status = true;
        }

        return status;
    }

    private boolean isEmailFormatValid(String email) {
        // Use a regular expression to perform email format validation
        // This regex is a basic example and may need to be adjusted
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email.matches(emailRegex);
    }

    public boolean isEmailValid(User user) {

        UserEntity u = userDao.findUserByEmail(user.getEmail());
        // Check if the email format is valid
        if (isEmailFormatValid(user.getEmail()) && u==null) {
            return true;
        }

        return false;
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

    public boolean isPhoneNumberValid(User user) {
        boolean status = true;
        int i = 0;

        UserEntity u= userDao.findUserByPhone(user.getPhone());

        while (status && i < user.getPhone().length() - 1) {
            if (user.getPhone().length() == 9) {
                for (; i < user.getPhone().length(); i++) {
                    if (!Character.isDigit(user.getPhone().charAt(i))) {
                        status = false;
                    }
                }
            } else {
                status = false;
            }
        }

        //Se existir contacto na base de dados retorna false
        if (u != null){
            status = false;
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
            //writeIntoJsonFile();
        }
        return done;
    }

    public boolean updateTask(String username, Task task) {
        TaskBean taskBean = new TaskBean();
        boolean updated = false;

        if (taskBean.editTask(task, getUserAndHisTasks(username))) {
            //writeIntoJsonFile();
            updated = true;
        }
        return updated;
    }

    public boolean removeTask(String username, String id) {
        TaskBean taskBean = new TaskBean();
        boolean removed = false;

        if (taskBean.removeTask(id, getUserAndHisTasks(username))) {
            //writeIntoJsonFile();
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
                        //writeIntoJsonFile();
                        return true;
                    }
                }
            }
        }
        return false;
    }



    /*public void writeIntoJsonFile() {
        Jsonb jsonb = JsonbBuilder.create(new
                JsonbConfig().withFormatting(true));
        try {
            jsonb.toJson(users, new FileOutputStream(filename));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }*/

}