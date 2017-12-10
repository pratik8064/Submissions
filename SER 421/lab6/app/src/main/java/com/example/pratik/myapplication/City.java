package com.example.pratik.myapplication;

/**
 * Created by Pratik on 11/27/2017.
 */

public class City{

    String name;
    boolean isChecked;

    public City(String name, boolean isChecked) {
        this.name = name;
        this.isChecked = isChecked;
    }

    public String getName() {
        return name;
    }

    public boolean isChecked() {
        return isChecked;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setChecked(boolean checked) {
        isChecked = checked;
    }
}
