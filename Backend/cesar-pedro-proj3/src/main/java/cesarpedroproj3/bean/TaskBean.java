package cesarpedroproj3.bean;

import cesarpedroproj3.dao.TaskDao;
import cesarpedroproj3.dao.UserDao;
import cesarpedroproj3.dto.Task;
import cesarpedroproj3.dto.User;
import cesarpedroproj3.entity.TaskEntity;
import cesarpedroproj3.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;

@Stateless
public class TaskBean implements Serializable {

    @EJB
    TaskDao taskDao;

    @EJB
    UserBean userBean;

    @EJB
    UserDao userDao;

    public boolean newTask(Task task, String username) {
        boolean created = false;
        UserEntity userEntity = userDao.findUserByUsername(username);
        System.out.println("*****************************************************************" + userEntity.getUsername());
        User user = userBean.convertUserEntitytoUserDto(userEntity);
        System.out.println("*****************************************************************" + user.getUsername());
        //task.generateId();
        task.setId("123");
        task.setInitialStateId();
        task.setCategory(task.getCategory());
        task.setOwner(user);
        System.out.println("###################################################################" + task.getOwner().getUsername());
        if (validateTask(task)) {
            System.out.println("#*#*#*#*# ENTROU NO IF #*#*#*#*#");
            taskDao.persist(convertTaskToEntity(task));
            created = true;
        }
        return created;
    }

    public boolean editTask(Task task, ArrayList<Task> tasks) {
        boolean edited = false;

        for (Task a : tasks) {
            if (a.getId().equals(task.getId())) {
                if (task.getStateId() != 0) {
                    a.setTitle(task.getTitle());
                    a.setDescription(task.getDescription());
                    a.setPriority(task.getPriority());
                    a.editStateId(task.getStateId());
                    a.setStartDate(a.getStartDate());
                    a.setLimitDate(a.getLimitDate());
                    edited = validateTask(a);
                }
            }
        }

        return edited;
    }

    public boolean removeTask(String id, ArrayList<Task> tasks) {
        boolean removed = false;
        Iterator<Task> iterator = tasks.iterator();
        while (iterator.hasNext()) {
            Task task = iterator.next();
            if (task.getId().equals(id)) {
                iterator.remove();
                removed = true;
            }
        }
        return removed;
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
        //taskEntity.setCategory(task.getCategory().getName());
        taskEntity.setErased(task.getErased());
        taskEntity.setOwner(userBean.convertUserDtotoUserEntity(task.getOwner()));
        return taskEntity;
    }

}
