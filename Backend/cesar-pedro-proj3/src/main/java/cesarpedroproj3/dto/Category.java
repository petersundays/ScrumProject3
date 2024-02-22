package cesarpedroproj3.dto;

import jakarta.xml.bind.annotation.XmlElement;

import java.util.ArrayList;

public class Category {
    @XmlElement
    private String name;
    @XmlElement
    private ArrayList<Task> tasks;


    public Category() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<Task> getTasks() {
        return tasks;
    }

    public void setTasks(ArrayList<Task> tasks) {
        this.tasks = tasks;
    }
}
