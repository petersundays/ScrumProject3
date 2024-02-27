package cesarpedroproj3.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;

@Entity
@Table(name="category")
@NamedQuery(name="Category.findTasksByCategory", query="SELECT t FROM CategoryEntity c JOIN c.taskList t WHERE c.name = :name")
@NamedQuery(name="Category.findCategories", query="SELECT a FROM CategoryEntity a")
@NamedQuery(name="Category.findCategoryByName", query="SELECT a FROM CategoryEntity a WHERE a.name = :name")
@NamedQuery(name="Category.deleteCategory", query="DELETE FROM CategoryEntity a WHERE a.name = :name")

public class CategoryEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable=false, unique = true, updatable = false)
    private int id;

    @Id
    @Column(name="name", nullable=false, unique = true, updatable = true)
    private String name;
    @OneToMany(mappedBy = "category")
    private ArrayList<TaskEntity> taskList;

    public CategoryEntity() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<TaskEntity> getTaskList() {
        return taskList;
    }

    public void setTaskList(ArrayList<TaskEntity> task) {
        this.taskList = task;
    }
}
