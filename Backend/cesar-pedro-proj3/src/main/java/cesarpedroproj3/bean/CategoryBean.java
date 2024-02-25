package cesarpedroproj3.bean;

import cesarpedroproj3.dao.CategoryDao;
import cesarpedroproj3.dao.TaskDao;
import cesarpedroproj3.entity.CategoryEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;

import java.io.Serializable;

@Stateless
public class CategoryBean implements Serializable {
    @EJB
    CategoryDao categoryDao;

    public boolean newCategory(String name){
        boolean created = false;
        if (name != null) {
            CategoryEntity categoryEntity = new CategoryEntity();
            categoryEntity.setName(name);
            categoryDao.persist(categoryEntity);
            created = true;
        }
        return created;
    }

    public boolean deleteCategory(String name){
        boolean deleted = false;
        if (name != null) {
            deleted = categoryDao.deleteCategory(name);
        }
        return deleted;
    }

    public boolean editCategory(String name, String newName){
        boolean edited = false;
        if (!name.isBlank() && !newName.isBlank()) {
            CategoryEntity categoryEntity = categoryDao.findCategoryByName(name);
            if (categoryEntity != null) {
                categoryEntity.setName(newName);
                categoryDao.merge(categoryEntity);
                edited = true;
            }
        }
        return edited;
    }
}

