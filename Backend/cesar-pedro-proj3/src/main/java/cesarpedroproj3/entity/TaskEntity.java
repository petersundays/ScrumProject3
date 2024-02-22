package cesarpedroproj3.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDate;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;

@Entity
@Table(name="Task")
@NamedQuery(name="Task.findTaskById", query="SELECT a FROM TaskEntity a WHERE a.id = :id")// os : significam que, neste caso o id é um parametro/atributo
@NamedQuery(name="Task.findTaskByUser", query="SELECT a FROM TaskEntity a WHERE a.owner = :owner")
@NamedQuery(name="Task.findErasedTasks", query="SELECT a FROM TaskEntity a WHERE a.erased = true")
@NamedQuery(name="Task.findAllTasks", query="SELECT a FROM TaskEntity a")
@NamedQuery(name="Task.deleteTask", query="DELETE FROM TaskEntity a WHERE a.id = :id")
@NamedQuery(name="Task.updateTitle", query="UPDATE TaskEntity a SET a.title = :newTitle WHERE a.id = :id")
@NamedQuery(name="Task.updateDescription", query="UPDATE TaskEntity a SET a.description = :newDescription WHERE a.id = :id")
@NamedQuery(name="Task.updateState", query="UPDATE TaskEntity a SET a.stateId = :newState WHERE a.id = :id")
@NamedQuery(name="Task.updatePriority", query="UPDATE TaskEntity a SET a.priority = :newPriority WHERE a.id = :id")
@NamedQuery(name="Task.updateStartDate", query="UPDATE TaskEntity a SET a.startDate = :newStartDate WHERE a.id = :id")
@NamedQuery(name="Task.updateLimitDate", query="UPDATE TaskEntity a SET a.limitDate = :newLimitDate WHERE a.id = :id")
@NamedQuery(name="Task.updateCategory", query="UPDATE TaskEntity a SET a.category = :newCategory WHERE a.id = :id")
@NamedQuery(name="Task.updateErased", query="UPDATE TaskEntity a SET a.erased = :newErased WHERE a.id = :id")


public class TaskEntity implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name="id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column (name="title", nullable = false, unique = false, length = 100)
    private String title;

    @Column (name="description", nullable = false, unique = false, length = 20000, columnDefinition = "TEXT")
    private String description;

    @Column (name="stateId", nullable = false, unique = false, updatable = true)
    private int stateId;

    @Column (name="priority", nullable = false, unique = false, updatable = true)
    private int priority;

    @CreationTimestamp
    @Column (name="creation_date", nullable = false, unique = false, updatable = false)
    private Timestamp creationDate;

    @Column (name="startDate", nullable = false, unique = false, updatable = true)
    private LocalDate startDate;

    @Column (name="limitDate", nullable = false, unique = false, updatable = true)
    private LocalDate limitDate;

    @Column (name="category", nullable = false, unique = false, updatable = true)
    private String category;

    @Column (name="erased", nullable = false, unique = false, updatable = true)
    private boolean erased;

    //Owning Side User - task
    @ManyToOne
    private UserEntity owner;


    public TaskEntity() {

    }

    public int getId()
    {
        return id;
    }

    public void setId(int id)
    {
        this.id = id;
    }

    public Timestamp getCreationDate()
    {
        return creationDate;
    }

    public void setCreationDate(Timestamp creationDate)
    {
        this.creationDate = creationDate;
    }

    public UserEntity getOwner() {
        return owner;
    }

    public void setOwner(UserEntity owner) {
        this.owner = owner;
    }


    public String getTitle() {
        return title;
    }


    public void setTitle(String title) {
        this.title = title;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }

    public int getStateId() {
        return stateId;
    }

    public void setStateId(int stateId) {
        this.stateId = stateId;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getLimitDate() {
        return limitDate;
    }

    public void setLimitDate(LocalDate limitDate) {
        this.limitDate = limitDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean getErased() {
        return erased;
    }

    public void setErased(boolean erased) {
        this.erased = erased;
    }
}
