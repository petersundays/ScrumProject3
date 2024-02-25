package cesarpedroproj3.dao;

import cesarpedroproj3.entity.TaskEntity;
import cesarpedroproj3.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;

import java.util.ArrayList;

@Stateless
public class TaskDao extends AbstractDao<TaskEntity> {

	private static final long serialVersionUID = 1L;

	public TaskDao() {
		super(TaskEntity.class);
	}
	

	public TaskEntity findTaskById(int id) {
		try {
			return (TaskEntity) em.createNamedQuery("Task.findTaskById").setParameter("id", id)
					.getSingleResult();

		} catch (NoResultException e) {
			return null;
		}

	}

	public ArrayList<TaskEntity> findTaskByUser(UserEntity userEntity) {
		try {
            return (ArrayList<TaskEntity>) em.createNamedQuery("Task.findTaskByUser").setParameter("owner", userEntity).getResultList();
		} catch (Exception e) {
			return null;
		}
	}

	public ArrayList<TaskEntity> findErasedTasks() {
		try {
            return (ArrayList<TaskEntity>) em.createNamedQuery("Task.findErasedTasks").getResultList();
		} catch (Exception e) {
			return null;
		}
	}

	public ArrayList<TaskEntity> findAllTasks() {
		try {
            return (ArrayList<TaskEntity>) em.createNamedQuery("Task.findAllTasks").getResultList();
		} catch (Exception e) {
			return null;
		}
	}
}
