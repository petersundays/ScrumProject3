package cesarpedroproj3.bean;

import cesarpedroproj3.dao.UserDao;
import cesarpedroproj3.dto.User;
import cesarpedroproj3.entity.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserBeanTest {

    UserBean userBean;
    UserDao userDao;

    @BeforeEach
    void setup() {

        //criar objeto mock
        userDao = mock(UserDao.class);

        //class em teste
        userBean = new UserBean(userDao);
    }

    @Test
    void testFindUserByUsername() {
        // Criação do user mock
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("junitTest");
        userEntity.setPassword("123");
        userEntity.setFirstName("junit");
        userEntity.setLastName("test");
        userEntity.setEmail("junit@test.pt");
        userEntity.setPhone("976458123");
        userEntity.setTypeOfUser(100);
        userEntity.setVisible(true);

        // Comportamento esperado para o método findUserByUsername do UserDao
        when(userDao.findUserByUsername("junitTest")).thenReturn(userEntity);

        // Executando o método
        UserEntity foundUser = userDao.findUserByUsername("junitTest");

        // Verificando se o método retorna o user esperado
        assertNotNull(foundUser);
        assertEquals("junitTest", foundUser.getUsername());
        assertEquals("junit", foundUser.getFirstName());
    }

    @Test
    void testFindAllUsers() {
        // Criação de user mock
        UserEntity user1 = new UserEntity();
        user1.setUsername("user1");
        UserEntity user2 = new UserEntity();
        user2.setUsername("user2");
        ArrayList<UserEntity> userList = new ArrayList<>();
        userList.add(user1);
        userList.add(user2);

        // Comportamento esperado para o método findAllUsers do UserDao
        when(userDao.findAllUsers()).thenReturn(userList);

        // Executa o método do UserBean que depende do UserDao
        ArrayList<User> foundUsers = userBean.getUsers();

        // Verificação se o método do UserBean retorna a lista de users esperada
        assertNotNull(foundUsers);
        assertEquals(2, foundUsers.size());
        assertEquals("user1", foundUsers.get(0).getUsername());
        assertEquals("user2", foundUsers.get(1).getUsername());
    }

    @Test
    void testFindUserByToken() {
        // Criação do user mock
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("junitTest");
        userEntity.setToken("testToken");

        // Configurando o comportamento esperado para o método findUserByToken do UserDao
        when(userDao.findUserByToken("testToken")).thenReturn(userEntity);

        // Executa o método do UserBean que depende do UserDao
        boolean foundUser = userBean.thisTokenIsFromThisUsername("testToken","junitTest");

        // Verifica se o método do UserBean retorna o user esperado
        assertNotNull(foundUser);
    }

    @Test
    void testGetUsersByType() {
        // tipo de user esperado
        int typeOfUser = 100; // DEVELOPER

        // Criação de users mock
        ArrayList<UserEntity> userEntities = new ArrayList<>();
        UserEntity user1 = new UserEntity();
        user1.setUsername("user1");
        user1.setTypeOfUser(100); // DEVELOPER
        userEntities.add(user1);

        // Configurando o comportamento esperado para o método findAllUsersByTypeOfUser do UserDao
        when(userDao.findAllUsersByTypeOfUser(typeOfUser)).thenReturn(userEntities);

        // Executando o método do UserBean
        ArrayList<User> foundUsers = userBean.getUsersByType(typeOfUser);

        // Verificando se o método do UserBean retorna a lista de usuários esperada
        assertNotNull(foundUsers);
        assertEquals(1, foundUsers.size());
        assertEquals("user1", foundUsers.get(0).getUsername());
        assertEquals(100, foundUsers.get(0).getTypeOfUser()); // Verifica se o tipo de usuário é o esperado
    }

    @Test
    void testUpdateUserEntityVisibility() {
        // Configuração do cenário
        String username = "testUser";
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setVisible(true);

        when(userDao.findUserByUsername(username)).thenReturn(userEntity);

        // Execução do método sob teste
        boolean updated = userBean.updateUserEntityVisibility(username);

        // Verifica o resultado
        assertTrue(updated);
        assertFalse(userEntity.isVisible()); // Verifica se a visibilidade do user foi atualizada
    }

    @Test
    void testUpdateUserEntityRole() {
        // Configuração do cenário
        String username = "testUser";
        int newTypeOfUser = 200; // SCRUMMASTER
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setTypeOfUser(100); // DEVELOPER

        when(userDao.findUserByUsername(username)).thenReturn(userEntity);

        // Execução do método sob teste
        boolean updated = userBean.updateUserEntityRole(username, newTypeOfUser);

        // Verificação do resultado
        assertTrue(updated);
        assertEquals(newTypeOfUser, userEntity.getTypeOfUser()); // Verifica se o tipo de user foi atualizado
    }

    @Test
    void testIsAuthenticated() {
        // Configuração do cenário
        String token = "testToken";
        String username = "testUser";
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setVisible(true);

        when(userDao.findUserByToken(token)).thenReturn(userEntity);

        // Execução do método sob teste
        boolean authenticated = userBean.isAuthenticated(token);

        // Verificação do resultado
        assertTrue(authenticated);
    }

    @Test
    void testIsDeveloper() {
        // Configuração do cenário
        int typeOfUser = 100;
        String username = "testUser";
        String token = "123";
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setTypeOfUser(typeOfUser);
        userEntity.setVisible(true);

        when(userDao.findUserByToken(token)).thenReturn(userEntity);

        // Execução do método sob teste
        boolean authenticated = userBean.userIsDeveloper(token);

        // Verificação do resultado
        assertTrue(authenticated);
    }

    @Test
    void testIsScrumMaster() {
        // Configuração do cenário
        int typeOfUser = 200;
        String username = "testUser";
        String token = "123";
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setTypeOfUser(typeOfUser);
        userEntity.setVisible(true);

        when(userDao.findUserByToken(token)).thenReturn(userEntity);

        // Execução do método sob teste
        boolean authenticated = userBean.userIsScrumMaster(token);

        // Verificação do resultado
        assertTrue(authenticated);
    }

    @Test
    void testIsProductOwner() {
        // Configuração do cenário
        int typeOfUser = 300;
        String username = "testUser";
        String token = "123";
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setTypeOfUser(typeOfUser);
        userEntity.setVisible(true);

        when(userDao.findUserByToken(token)).thenReturn(userEntity);

        // Execução do método sob teste
        boolean authenticated = userBean.userIsProductOwner(token);

        // Verificação do resultado
        assertTrue(authenticated);
    }


}