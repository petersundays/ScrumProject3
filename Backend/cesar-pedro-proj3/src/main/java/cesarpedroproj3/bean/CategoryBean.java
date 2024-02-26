package cesarpedroproj3.bean;

import cesarpedroproj3.dao.CategoryDao;
import cesarpedroproj3.entity.CategoryEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;

import java.io.Serializable;
import java.util.ArrayList;

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
        return created;  // FALTA FAZER VERIFICAÇÃO DAS PERMISSÕES DO UTILIZADOR PARA CRIAR CATEGORIA
    }

    public boolean categoryExists(String name){
        boolean exists = false;
        if (name != null) {
            CategoryEntity categoryEntity = categoryDao.findCategoryByName(name);
            if (categoryEntity != null) {
                exists = true;
            }
        }
        return exists;
    }

    public ArrayList<String> findAllCategories(){
        ArrayList<String> categories = new ArrayList<>();
        ArrayList<CategoryEntity> categoryEntities = categoryDao.findAllCategories();
        for (CategoryEntity categoryEntity : categoryEntities) {
            categories.add(categoryEntity.getName());
        }
        return categories;
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
        if (name != null && newName != null) {
            edited = categoryDao.editCategory(name, newName);
        }
        return edited;
    }
}

