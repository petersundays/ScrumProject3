package cesarpedroproj3.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name="category")
@NamedQuery(name="Category.findTasksByCategory", query="SELECT a FROM CategoryEntity a WHERE a.name = :name")
@NamedQuery(name="Category.findCategories", query="SELECT a FROM CategoryEntity a")
@NamedQuery(name="Category.replaceCategory", query="UPDATE TaskEntity a SET a.category = :newCategory WHERE a.category = :oldCategory")
@NamedQuery(name="Category.deleteCategory", query="DELETE FROM CategoryEntity a WHERE a.name = :name")

public class CategoryEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name="name", nullable=false, unique = true, updatable = false)
    private String name;

    public CategoryEntity() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }



}
