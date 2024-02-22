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

	public ArrayList<TaskEntity> findActivityByUser(UserEntity userEntity) {
		try {
			ArrayList<TaskEntity> taskEntityEntities = (ArrayList<TaskEntity>) em.createNamedQuery("Task.findTaskByUser").setParameter("owner", userEntity).getResultList();
			return taskEntityEntities;
		} catch (Exception e) {
			return null;
		}
	}
}
