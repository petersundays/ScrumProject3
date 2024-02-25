package cesarpedroproj3.dao;

import cesarpedroproj3.dto.Category;
import cesarpedroproj3.dto.Task;
import cesarpedroproj3.entity.CategoryEntity;
import jakarta.ejb.Stateless;

import java.util.ArrayList;

@Stateless
public class CategoryDao extends AbstractDao<CategoryEntity> {

    private static final long serialVersionUID = 1L;

    public CategoryDao() {
        super(CategoryEntity.class);
    }

    public ArrayList<Task> findTasksByCategory(String name) {
        try {
            ArrayList<Task> taskEntities = (ArrayList<Task>) em.createNamedQuery("Category.findTasksByCategory").setParameter("name", name).getResultList();
            return taskEntities;
        } catch (Exception e) {
            return null;
        }
    }

    public ArrayList<CategoryEntity> findAllCategories() {
        try {
            ArrayList<CategoryEntity> categoryEntities = (ArrayList<CategoryEntity>) em.createNamedQuery("Category.findCategories").getResultList();
            return categoryEntities;
        } catch (Exception e) {
            return null;
        }
    }

    public CategoryEntity findCategoryByName(String name) {
        try {
            return (CategoryEntity) em.createNamedQuery("Category.findCategoryByName").setParameter("name", name).getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

 public boolean deleteCategory(String name) {
        boolean deleted = false;
        if (name == null) {
            deleted = false;
        } else {
            try {
                ArrayList<CategoryEntity> categoryTasks = (ArrayList<CategoryEntity>) em.createNamedQuery("Category.findTasksByCategory").setParameter("name", name).getResultList();
                if (categoryTasks.isEmpty()) {
                    em.createNamedQuery("Category.deleteCategory").setParameter("name", name).executeUpdate();
                    deleted = true;
                }
            } catch (Exception e) {
                deleted = false;
            }
        }
        return deleted;
    }
}