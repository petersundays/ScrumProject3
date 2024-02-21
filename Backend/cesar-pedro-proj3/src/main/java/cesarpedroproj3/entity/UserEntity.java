package cesarpedroproj3.entity;

import java.io.Serializable;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="user")
@NamedQuery(name = "User.findUserByUsername", query = "SELECT u FROM UserEntity u WHERE u.username = :username")
@NamedQuery(name = "User.findUserByEmail", query = "SELECT u FROM UserEntity u WHERE u.email = :email")
@NamedQuery(name = "User.findUserByToken", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.token = :token")
public class UserEntity implements Serializable{

    private static final long serialVersionUID = 1L;

    //user unique email has ID - not updatable, unique, not null, min size = 3
    @Id
    @Column(name="email", nullable=false, unique = true, updatable = false)
    private String email;

    //user's name
    @Column(name="name", nullable=false, unique = false, updatable = true)
    private String name;


    @Column(name="token", nullable=true, unique = true, updatable = true)
    private String token;

    @Column(name="password", nullable=false, unique = false, updatable = true)
    private String password;

    @Column(name="username", nullable=false, unique = false, updatable = true)
    private String username;

    @OneToMany(mappedBy = "owner")
    private Set<TaskEntity> activities;


    //default empty constructor
    public UserEntity() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<TaskEntity> getActivities() {
        return activities;
    }

    public void setActivities(Set<TaskEntity> activities) {
        this.activities = activities;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


}
