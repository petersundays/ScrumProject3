package cesarpedroproj3.bean;

import cesarpedroproj3.dao.CategoryDao;
import cesarpedroproj3.dao.TaskDao;
import cesarpedroproj3.dao.UserDao;
import cesarpedroproj3.dto.Category;
import cesarpedroproj3.dto.Task;
import cesarpedroproj3.dto.User;
import cesarpedroproj3.entity.CategoryEntity;
import cesarpedroproj3.entity.TaskEntity;
import cesarpedroproj3.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import java.io.Serializable;
import java.util.ArrayList;

@Stateless
public class TaskBean implements Serializable {

    @EJB
    TaskDao taskDao;

    @EJB
    private CategoryDao categoryDao;
    @EJB
    private UserDao userDao;
    @EJB
    private UserBean userBean;
    @EJB
    private CategoryBean categoryBean;



    public boolean newTask(Task task, String token) {
        boolean created = false;

        task.generateId();
        task.setInitialStateId();
        task.setOwner(userBean.convertUserEntitytoUserDto(userDao.findUserByToken(token)));
        task.setErased(false);
        task.setCategory(task.getCategory());
        if (validateTask(task)) {
            taskDao.persist(convertTaskToEntity(task));
            created = true;

        }

        return created;
    }

    public ArrayList<Task> getAllTasksFromUser(String username) {
        ArrayList<TaskEntity> entityUserTasks = taskDao.findTasksByUser(userDao.findUserByUsername(username));

        ArrayList<Task> userTasks = new ArrayList<>();
        if (entityUserTasks != null)
            for (TaskEntity taskEntity : entityUserTasks) {
                userTasks.add(convertTaskEntityToTaskDto(taskEntity));
            }
        return userTasks;
    }

    public boolean updateTask(Task task, String id, String token) {
        User taskOwner = userBean.convertUserEntitytoUserDto(userDao.findUserByUsername(taskDao.findTaskById(id).getOwner().getUsername()));
        User loggedUser = userBean.convertUserEntitytoUserDto(userDao.findUserByToken(token));
        boolean edited = false;

        if (loggedUser.getUsername().equals(taskOwner.getUsername()) || loggedUser.getTypeOfUser() == User.SCRUMMASTER || loggedUser.getTypeOfUser() == User.PRODUCTOWNER) {
            task.setId(id);
            task.setOwner(taskOwner);
            if (taskDao.findTaskById(task.getId()) != null) {
                if (validateTask(task)) {
                    taskDao.merge(convertTaskToEntity(task));
                    edited = true;
                }
            }
        }
        return edited;
    }

    public boolean updateTaskStatus(String taskId, int stateId) {
        boolean updated = false;
        if (stateId != 100 && stateId != 200 && stateId != 300) {
            updated = false;
        } else {
            TaskEntity taskEntity = taskDao.findTaskById(taskId);
            if (taskEntity != null) {
                taskEntity.setStateId(stateId);
                taskDao.merge(taskEntity);
                updated = true;
            }
        }
        return updated;
    }



    public boolean switchErasedTaskStatus(String id) {
        boolean swithedErased = false;
        TaskEntity taskEntity = taskDao.findTaskById(id);
        if(taskEntity != null) {
            taskEntity.setErased(!taskEntity.getErased());
            taskDao.merge(taskEntity);
            swithedErased = true;
        }
        return swithedErased;
    }

    public boolean permanentlyDeleteTask(String id) {
        boolean removed = false;
        TaskEntity taskEntity = taskDao.findTaskById(id);
        if(taskEntity != null) {
            taskDao.remove(taskEntity);
            removed = true;
        }
        return removed;
    }

    public ArrayList<Task> getTasksByCategory(String category) {
        ArrayList<TaskEntity> entityTasks = categoryDao.findTasksByCategory(category);
        ArrayList<Task> tasks = new ArrayList<>();
        if (entityTasks != null) {
            for (TaskEntity taskEntity : entityTasks) {
                tasks.add(convertTaskEntityToTaskDto(taskEntity));
            }
        }
        return tasks;
    }

    public boolean validateTask(Task task) {
        boolean valid = true;
        if ((task.getStartDate() == null
                || task.getLimitDate() == null
                || task.getLimitDate().isBefore(task.getStartDate())
                || task.getTitle().isBlank()
                || task.getDescription().isBlank()
                || task.getOwner() == null
                || task.getPriority() == 0
                || task.getCategory() == null
                || !categoryExists(task.getCategory().getName())
                || (task.getPriority() != Task.LOWPRIORITY && task.getPriority() != Task.MEDIUMPRIORITY && task.getPriority() != Task.HIGHPRIORITY)
                || (task.getStateId() != Task.TODO && task.getStateId() != Task.DOING && task.getStateId() != Task.DONE)
        )) {
            valid = false;
        }
        return valid;
    }

    private TaskEntity convertTaskToEntity(Task task) {
        TaskEntity taskEntity = new TaskEntity();
        taskEntity.setId(task.getId());
        taskEntity.setTitle(task.getTitle());
        taskEntity.setDescription(task.getDescription());
        taskEntity.setPriority(task.getPriority());
        taskEntity.setStateId(task.getStateId());
        taskEntity.setStartDate(task.getStartDate());
        taskEntity.setLimitDate(task.getLimitDate());
        taskEntity.setCategory(categoryDao.findCategoryByName(task.getCategory().getName()));
        taskEntity.setErased(task.getErased());
        taskEntity.setOwner(userBean.convertUserDtotoUserEntity(task.getOwner()));
        return taskEntity;
    }

    public Task convertTaskEntityToTaskDto(TaskEntity taskEntity) {
        Task task = new Task();
        task.setId(taskEntity.getId());
        task.setTitle(taskEntity.getTitle());
        task.setDescription(taskEntity.getDescription());
        task.setPriority(taskEntity.getPriority());
        task.setStateId(taskEntity.getStateId());
        task.setStartDate(taskEntity.getStartDate());
        task.setLimitDate(taskEntity.getLimitDate());
        task.setCategory(categoryBean.convertCategoryEntityToCategoryDto(taskEntity.getCategory()));
        task.setErased(taskEntity.getErased());
        task.setOwner(userBean.convertUserEntitytoUserDto(taskEntity.getOwner()));
        return task;
    }

    private boolean categoryExists(String category) {
        boolean exists = false;
        if(categoryDao.findCategoryByName(category) != null) {
            exists = true;
        }
        return exists;
    }

}
