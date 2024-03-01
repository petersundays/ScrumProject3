package com.scrum;

import java.time.LocalDate;

public class Task {
    private String title;
    private String description;
    private int priority;
    private int stateId;
    private LocalDate startDate;
    private LocalDate limitDate;

    public Task() {
    }

    public Task(String title, String description, int priority, LocalDate startDate, LocalDate limitDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.startDate = startDate;
        this.limitDate = limitDate;
    }

    @Override
    public String toString() {
        return "{" +
                "\"title\":\"" + title + "\"" +
                ", \"description\":\"" + description + "\"" +
                ", \"priority\":" + priority  +
                ", \"initialDate\":\"" + startDate + "\"" +
                ", \"endDate\":\"" + limitDate + "\"}";
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate initialDate) {
        this.startDate = initialDate;
    }

    public LocalDate getLimitDate() {
        return limitDate;
    }

    public void setLimitDate(LocalDate limitDate) {
        this.limitDate = limitDate;
    }
}
