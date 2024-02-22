package cesarpedroproj3.dao;

import cesarpedroproj3.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;

@Stateless
public class UserDao extends AbstractDao<UserEntity> {

	private static final long serialVersionUID = 1L;

	public UserDao() {
		super(UserEntity.class);
	}


	public UserEntity findUserByToken(String token) {
		try {
			return (UserEntity) em.createNamedQuery("User.findUserByToken").setParameter("token", token)
					.getSingleResult();

		} catch (NoResultException e) {
			return null;
		}
	}

	public UserEntity findUserByUsername(String username) {
		try {
			return (UserEntity) em.createNamedQuery("User.findUserByUsername").setParameter("username", username)
					.getSingleResult();

		} catch (NoResultException e) {
			return null;
		}
	}


	public UserEntity findUserByEmail(String email) {
		try {
			return (UserEntity) em.createNamedQuery("User.findUserByEmail").setParameter("email", email)
					.getSingleResult();

		} catch (NoResultException e) {
			return null;
		}
	}

	public UserEntity findUserByPhone(String phone) {
		try {
			return (UserEntity) em.createNamedQuery("User.findUserByPhone").setParameter("phone", phone)
					.getSingleResult();

		} catch (NoResultException e) {
			return null;
		}
	}

}
