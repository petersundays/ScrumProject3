package cesarpedroproj3.entity;

import cesarpedroproj3.dto.Task;
import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="category")
@NamedQuery(name="Category.findTasksByCategory", query="SELECT t FROM CategoryEntity c JOIN c.task t WHERE c.name = :name")
@NamedQuery(name="Category.findCategories", query="SELECT a FROM CategoryEntity a")
@NamedQuery(name="Category.findCategoryByName", query="SELECT a FROM CategoryEntity a WHERE a.name = :name")
@NamedQuery(name="Category.deleteCategory", query="DELETE FROM CategoryEntity a WHERE a.name = :name")

public class CategoryEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name="name", nullable=false, unique = true, updatable = false)
    private String name;
    @ManyToOne
    @JoinColumn(name = "task_id", referencedColumnName = "id")
    private TaskEntity task;

    public CategoryEntity() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TaskEntity getTask() {
        return task;
    }

    public void setTask(TaskEntity task) {
        this.task = task;
    }
}
