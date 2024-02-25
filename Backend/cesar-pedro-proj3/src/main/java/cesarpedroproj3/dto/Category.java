package cesarpedroproj3.dto;

import jakarta.xml.bind.annotation.XmlElement;

import java.util.ArrayList;

public class Category {
    @XmlElement
    private String name;

    public Category() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
