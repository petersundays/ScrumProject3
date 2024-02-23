package cesarpedroproj3.service;

import cesarpedroproj3.bean.UserBean;
import cesarpedroproj3.dto.Login;
import cesarpedroproj3.dto.Task;
import cesarpedroproj3.dto.User;
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

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getUsers() {
        return userBean.getUsers();
    }


    @PUT
    @Path("/update/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@PathParam("username") String username, @HeaderParam("username") String usernameHeader, @HeaderParam("password") String password, User user) {
        Response response;

        if (userBean.isAuthenticated(usernameHeader, password)) {
            if (!userBean.isEmailValid(user)) {
                response = Response.status(422).entity("Invalid email").build();

            } else if (!userBean.isImageUrlValid(user.getPhotoURL())) {
                response = Response.status(422).entity("Image URL invalid").build(); //400

            } else if (!userBean.isPhoneNumberValid(user)) {
                response = Response.status(422).entity("Invalid phone number").build();

            } else if (usernameHeader.equals(username)) {
                boolean updatedUser = userBean.updateUser(user);
                response = Response.status(Response.Status.OK).entity(updatedUser).build(); //status code 200

            } else {
                response = Response.status(Response.Status.NOT_ACCEPTABLE).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }


    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username") String username, @HeaderParam("username") String usernameHeader, @HeaderParam("password") String password) {
        Response response;

        if (userBean.isAuthenticated(usernameHeader, password)) {
            if (usernameHeader.equals(username)) {
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

    @GET
    @Path("/{username}/tasks")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsersTasks(@HeaderParam("username") String usernameHeader, @HeaderParam("password") String password, @PathParam("username") String username) {

        Response response;

        if (userBean.isAuthenticated(usernameHeader, password)) {
            if (usernameHeader.equals(username)) {
                ArrayList<Task> userTasks = userBean.getUserAndHisTasks(username);
                userTasks.sort(Comparator.comparing(Task::getPriority, Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getLimitDate)));
                response = Response.status(Response.Status.OK).entity(userTasks).build();

            } else {
                response = Response.status(406).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
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
    public Response getFirstName(@HeaderParam("username") String username, @HeaderParam("password") String password) {
        Response response;
        User currentUser = userBean.getUser(username);

        if (!userBean.isAuthenticated(username, password)) {
            response = Response.status(401).entity("Invalid credentials").build();
        } else {
            response = Response.status(200).entity(currentUser.getFirstName()).build();
        }
        return response;
    }

    @GET
    @Path("/getPhotoUrl")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getImage(@HeaderParam("username") String username, @HeaderParam("password") String password) {
        Response response;
        User currentUser = userBean.getUser(username);

        if (!userBean.isAuthenticated(username, password)) {
            response = Response.status(401).entity("Invalid credentials").build();
        } else {
            response = Response.status(200).entity(currentUser.getPhotoURL()).build();
        }
        return response;
    }

    @POST
    @Path("/{username}/addTask")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response newTask(@HeaderParam("username") String usernameHeader, @HeaderParam("password") String password, @PathParam("username") String username, Task task) {
        Response response;

        if (userBean.isAuthenticated(usernameHeader, password)) {
            if (usernameHeader.equals(username)) {
                boolean added = userBean.addTaskToUser(username, task);
                if (added) {
                    response = Response.status(201).entity("Task created successfully").build();
                } else {
                    response = Response.status(404).entity("Impossible to create task. Verify all fields").build();
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
    @Path("/{username}/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTask(@HeaderParam("username") String usernameHeader, @HeaderParam("password") String password, @PathParam("username") String username, @PathParam("id") String id, Task task) {

        Response response;
        if (userBean.isAuthenticated(username, password)) {
            if (usernameHeader.equals(username)) {
                task.setId(id);
                boolean updated = userBean.updateTask(username, task);
                if (updated) {
                    response = Response.status(200).entity("Task updated successfully").build();
                } else {
                    response = Response.status(404).entity("Impossible to edit task. Verify all fields").build();
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
    @Path("/{username}/tasks/{taskId}/status")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTaskStatus(@HeaderParam("username") String usernameHeader,
                                     @HeaderParam("password") String password,
                                     @PathParam("username") String username,
                                     @PathParam("taskId") String taskId,
                                     int newStatus) {

        Response response;
        if (userBean.isAuthenticated(usernameHeader, password)) {
            if (usernameHeader.equals(username)) {
                boolean updated = userBean.updateTaskStatus(username, taskId, newStatus);
                if (updated) {
                    response = Response.status(200).entity("Task status updated successfully").build();
                } else {
                    response = Response.status(404).entity("Impossible to update task status. Task not found or invalid status").build();
                }
            } else {
                response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
            }
        } else {
            response = Response.status(401).entity("Invalid credentials").build();
        }
        return response;
    }


    @DELETE
    @Path("/{username}/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeTask(@HeaderParam("username") String usernameHeader, @HeaderParam("password") String password, @PathParam("username") String username, @PathParam("id") String id) {

        Response response;
        if (userBean.isAuthenticated(username, password)) {
            if (usernameHeader.equals(username)) {
                boolean removed = userBean.removeTask(username, id);
                if (removed) {
                    response = Response.status(200).entity("Task removed successfully").build();
                } else {
                    response = Response.status(404).entity("Task with this id is not found").build();
                }
            } else {
                response = Response.status(Response.Status.BAD_REQUEST).entity("Invalid username on path").build();
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
    public Response removeUser(@HeaderParam("username") String usernameHeader, @HeaderParam("password") String password, @PathParam("username") String username) {

        Response response;
        if (userBean.isAuthenticated(username, password)) {
            if (usernameHeader.equals(username)) {

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



}
