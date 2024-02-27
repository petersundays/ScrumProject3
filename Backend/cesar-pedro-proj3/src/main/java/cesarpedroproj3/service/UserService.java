package cesarpedroproj3.service;

import cesarpedroproj3.bean.CategoryBean;
import cesarpedroproj3.bean.TaskBean;
import cesarpedroproj3.bean.UserBean;
import cesarpedroproj3.dao.TaskDao;
import cesarpedroproj3.dao.UserDao;
import cesarpedroproj3.dto.Category;
import cesarpedroproj3.dto.Login;
import cesarpedroproj3.dto.Task;
import cesarpedroproj3.dto.User;
import cesarpedroproj3.entity.UserEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Path("/users")
public class UserService {

    @Inject
    UserBean userBean;
    @Inject
    TaskBean taskBean;
    @Inject
    CategoryBean categoryBean;
    @Inject
    UserDao userDao;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Login login) {

        String token = userBean.login(login);
        Response response;

        if (token != null) {
            response = Response.status(200).entity(token).build();
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @POST
    @Path("/logout")
    @Produces(MediaType.APPLICATION_JSON)
    public Response logout(@HeaderParam("token") String token) {

        if (userBean.logout(token)) return Response.status(200).entity("Logout Successful!").build();

        return Response.status(401).entity("Invalid Token!").build();
    }

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(User user) {
        Response response;

        boolean isUsernameAvailable = userBean.isUsernameAvailable(user);
        boolean isEmailValid = userBean.isEmailValid(user);
        boolean isFieldEmpty = userBean.isAnyFieldEmpty(user);
        boolean isPhoneNumberValid = userBean.isPhoneNumberValid(user);
        boolean isImageValid = userBean.isImageUrlValid(user.getPhotoURL());

        if (isFieldEmpty) {
            response = Response.status(422).entity("There's an empty field. ALl fields must be filled in").build();
        } else if (!isEmailValid) {
            response = Response.status(422).entity("Invalid email").build();
        } else if (!isUsernameAvailable) {
            response = Response.status(Response.Status.CONFLICT).entity("Username already in use").build(); //status code 409
        } else if (!isImageValid) {
            response = Response.status(422).entity("Image URL invalid").build(); //400
        } else if (!isPhoneNumberValid) {
            response = Response.status(422).entity("Invalid phone number").build();
        } else if (userBean.register(user)) {
            response = Response.status(Response.Status.CREATED).entity("User registered successfully").build(); //status code 201
        } else {
            response = Response.status(Response.Status.BAD_REQUEST).entity("Something went wrong").build(); //status code 400
        }
        return response;
    }

    @GET
    @Path("/getFirstName")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFirstName(@HeaderParam("token") String token) {
        Response response;
        UserEntity currentUserEntity = userDao.findUserByToken(token);
        User currentUser = userBean.convertUserEntitytoUserDto(currentUserEntity);

        if (!userBean.isAuthenticated(token)) {
            response = Response.status(401).entity("Invalid credentials").build();
        } else {
            response = Response.status(200).entity(currentUser.getFirstName()).build();
        }
        return response;
    }

    @GET
    @Path("/getPhotoUrl")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getImage(@HeaderParam("token") String token) {
        Response response;
        UserEntity currentUserEntity = userDao.findUserByToken(token);
        User currentUser = userBean.convertUserEntitytoUserDto(currentUserEntity);

        if (!userBean.isAuthenticated(token)) {
            response = Response.status(401).entity("Invalid credentials").build();
        } else {
            response = Response.status(200).entity(currentUser.getPhotoURL()).build();
        }
        return response;
    }

    @GET
    @Path("/getUsername")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsername(@HeaderParam("token") String token) {
        Response response;
        UserEntity currentUserEntity = userDao.findUserByToken(token);
        User currentUser = userBean.convertUserEntitytoUserDto(currentUserEntity);

        if (!userBean.isAuthenticated(token)) {
            response = Response.status(401).entity("Invalid credentials").build();
        } else {
            response = Response.status(200).entity(currentUser.getUsername()).build();
        }
        return response;
    }

    @PUT
    @Path("/update/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("username") String username, @HeaderParam("token") String token, User user) {
        Response response;

        if (userBean.isAuthenticated(token)) {
            if (!userBean.isEmailValid(user)) {
                response = Response.status(422).entity("Invalid email").build();

            } else if (!userBean.isImageUrlValid(user.getPhotoURL())) {
                response = Response.status(422).entity("Image URL invalid").build(); //400

            } else if (!userBean.isPhoneNumberValid(user)) {
                response = Response.status(422).entity("Invalid phone number").build();

            } else if (userDao.findUserByToken(token).getUsername().equals(username)) {
                boolean updatedUser = userBean.updateUser(user, username);
                response = Response.status(Response.Status.OK).entity(updatedUser).build(); //status code 200

            } else {
                response = Response.status(Response.Status.NOT_ACCEPTABLE).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    //Apagar utilizador
    @DELETE
    @Path("/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeUser(@HeaderParam("token") String token, @PathParam("username") String username) {

        Response response;
        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getUsername().equals(username)) {

                boolean removed = userBean.delete(username);

                if (removed) {
                    response = Response.status(200).entity("User removed successfully").build();
                } else {
                    response = Response.status(404).entity("User is not found").build();
                }
            } else {
                response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsers(@HeaderParam("token") String token) {
        Response response;
        if (userBean.isAuthenticated(token)) {
            List<User> allUsers = userBean.getUsers();
            response = Response.status(200).entity(allUsers).build();
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
        public Response getUser(@PathParam("username") String username, @HeaderParam("token") String token) {
        Response response;

        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getUsername().equals(username)) {
                User user = userBean.getUser(username);
                response = Response.ok().entity(user).build();
            } else {
                response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @GET
    @Path("/{username}/tasks")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsersTasks(@HeaderParam("token") String token, @PathParam("username") String username) {

        Response response;

        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getUsername().equals(username) || userDao.findUserByToken(token).getTypeOfUser() == User.PRODUCTOWNER || userDao.findUserByToken(token).getTypeOfUser() == User.SCRUMMASTER){
                ArrayList<Task> userTasks = taskBean.getAllTasksFromUser(username);
                userTasks.sort(Comparator.comparing(Task::getPriority, Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getLimitDate)));
                response = Response.status(Response.Status.OK).entity(userTasks).build();
            } else {
                response = Response.status(406).entity("You don't have permission for this request").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @POST
    @Path("/{username}/addTask")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response newTask(@HeaderParam("token") String token, @PathParam("username") String username, Task task) {
        Response response;

        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getUsername().equals(username)) {
                try {
                    boolean added = taskBean.newTask(task, token);
                    if (added) {
                        response = Response.status(201).entity("Task created successfully").build();
                    } else {
                        response = Response.status(404).entity("Impossible to create task. Verify all fields").build();
                    }
                } catch (Exception e) {
                    response = Response.status(404).entity("Something went wrong. A new category was not created.").build();
                }
            } else {
                response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }

        return response;
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTask(@HeaderParam("token") String token, @PathParam("id") String id, Task task) {

        Response response;
        if (userBean.isAuthenticated(token)) {
                boolean updated = taskBean.updateTask(task, id, token);
                if (updated) {
                    response = Response.status(200).entity("Task updated successfully").build();
                } else {
                    response = Response.status(404).entity("Impossible to update task. Verify all fields").build();
                }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @PUT
    @Path("/tasks/{taskId}/{newStateId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTaskStatus(@HeaderParam("token") String token, @PathParam("taskId") String taskId, @PathParam("newStateId") int stateId) {

        Response response;
        if (userBean.isAuthenticated(token)) {
            boolean updated = taskBean.updateTaskStatus(taskId, stateId);
            if (updated) {
                response = Response.status(200).entity("Task status updated successfully").build();
            } else {
                response = Response.status(404).entity("Impossible to update task status. Task not found or invalid status").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @PUT
    @Path("/{taskId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response eraseTask(@HeaderParam("token") String token, @PathParam("taskId") String id) {

        Response response;
        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getTypeOfUser() == User.PRODUCTOWNER || userDao.findUserByToken(token).getTypeOfUser() == User.SCRUMMASTER) {
                try {
                    boolean switched = taskBean.switchErasedTaskStatus(id);
                    if (switched) {
                        response = Response.status(200).entity("Task erased status switched successfully").build();
                    } else {
                        response = Response.status(404).entity("Task with this id is not found").build();
                    }
                } catch (Exception e) {
                    response = Response.status(404).entity("Something went wrong. The task erased status was switched.").build();
                }
            } else {
                response = Response.status(403).entity("You don't have permission to switch the erased status of a task").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @DELETE
    @Path("/delete/{taskId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteTask(@HeaderParam("token") String token, @PathParam("taskId") String id) {

        Response response;
        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getTypeOfUser() == User.PRODUCTOWNER) {
                try {
                    boolean deleted = taskBean.permanentlyDeleteTask(id);
                    if (deleted) {
                        response = Response.status(200).entity("Task removed successfully").build();
                    } else {
                        response = Response.status(404).entity("Task with this id is not found").build();
                    }
                } catch (Exception e) {
                    response = Response.status(404).entity("Something went wrong. The task was not removed.").build();
                }
            } else {
                response = Response.status(403).entity("You don't have permission to delete a task").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @GET
    @Path("/tasks/{category}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTasksByCategory(@HeaderParam("token") String token, @PathParam("category") String category) {

        Response response;
        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getTypeOfUser() == User.PRODUCTOWNER || userDao.findUserByToken(token).getTypeOfUser() == User.SCRUMMASTER) {
                ArrayList<Task> tasksByCategory = taskBean.getTasksByCategory(category);
                response = Response.status(200).entity(tasksByCategory).build();
            } else {
                response = Response.status(403).entity("You don't have permission for this request").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }


    @POST
    @Path("/{username}/newCategory")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response newCategory(@HeaderParam("token") String token, @PathParam("username") String username, Category category) {

        Response response;

        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getUsername().equals(username)) {
                if (userDao.findUserByToken(token).getTypeOfUser() == User.PRODUCTOWNER) {
                    if (categoryBean.categoryExists(category.getName())) {
                        response = Response.status(409).entity("Category with this name already exists").build();
                    } else {
                        try {
                            boolean added = categoryBean.newCategory(category.getName());
                            if (added) {
                                response = Response.status(201).entity("Category created successfully").build();
                            } else {
                                response = Response.status(404).entity("Impossible to create category. Verify all fields").build();
                            }
                        } catch (Exception e) {
                            response = Response.status(404).entity("Something went wrong. A new category was not created.").build();
                        }
                    }
                } else {
                    response = Response.status(403).entity("You don't have permission to create a category").build();
                }
            } else {
                response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response; // FALTA FAZER VERIFICAÇÃO DAS PERMISSÕES DO UTILIZADOR PARA CRIAR CATEGORIA
    }

    @DELETE
    @Path("/{username}/deleteCategory/{categoryName}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteCategory(@HeaderParam("token") String token, @PathParam("username") String username, @PathParam("categoryName") String categoryName) {

        Response response;

        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getUsername().equals(username)) {
                if (userDao.findUserByToken(token).getTypeOfUser() == User.PRODUCTOWNER) {
                try {
                    boolean deleted = categoryBean.deleteCategory(categoryName);
                    if (deleted) {
                        response = Response.status(200).entity("Category removed successfully").build();
                    } else {
                        response = Response.status(404).entity("Category with this name is not found").build();
                    }
                } catch (Exception e) {
                    response = Response.status(404).entity("Something went wrong. The category was not removed.").build();
                }
                } else {
                    response = Response.status(403).entity("You don't have permission to delete a category").build();
                }
            } else {
                response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @PUT
    @Path("/{username}/editCategory/{categoryName}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response editCategory(@HeaderParam("token") String token, @PathParam("username") String username, @PathParam("categoryName") String categoryName, String newCategoryName) {

        Response response;

        if (userBean.isAuthenticated(token)) {
            if (userDao.findUserByToken(token).getUsername().equals(username)) {
                if (userDao.findUserByToken(token).getTypeOfUser() == User.PRODUCTOWNER) {
                    try {
                        boolean edited = categoryBean.editCategory(categoryName, newCategoryName);
                        if (edited) {
                            response = Response.status(200).entity("Category edited successfully").build();
                        } else {
                            response = Response.status(404).entity("Category with this name is not found").build();
                        }
                    } catch (Exception e) {
                        response = Response.status(404).entity("Something went wrong. The category was not edited.").build();
                    }
                } else {
                    response = Response.status(403).entity("You don't have permission to edit a category").build();
                }
            } else {
                response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

    @GET
    @Path("/{username}/categories")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategories(@HeaderParam("token") String token, @PathParam("username") String username) {

        Response response;

        if (userBean.isAuthenticated(token)) {
            try {
                if (userDao.findUserByToken(token).getUsername().equals(username)) {
                    List<String> allCategories = categoryBean.findAllCategories();
                    response = Response.status(200).entity(allCategories).build();
                } else {
                    response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
                }
            } catch (Exception e) {
                response = Response.status(404).entity("Something went wrong. The categories were not found.").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }

}
