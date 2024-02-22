package cesarpedroproj3.bean;

import cesarpedroproj3.dao.TaskDao;
import cesarpedroproj3.dao.UserDao;
import cesarpedroproj3.dto.Task;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.enterprise.context.ApplicationScoped;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;

@Stateless
public class TaskBean implements Serializable {

    @EJB
    TaskDao taskDao;

    @EJB
    UserDao userDao;

    public boolean newTask(Task task) {
        task.generateId();
        task.setInitialStateId();
        return validateTask(task);
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
                || task.getPriority() == 0
                || (task.getPriority() != Task.LOWPRIORITY && task.getPriority() != Task.MEDIUMPRIORITY && task.getPriority() != Task.HIGHPRIORITY)
                || (task.getStateId() != Task.TODO && task.getStateId() != Task.DOING && task.getStateId() != Task.DONE)
        )) {
            valid = false;
        }
        return valid;
    }

}
