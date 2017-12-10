package com.example.pratik.myapplication;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.Toast;

import java.util.ArrayList;

public class Native extends AppCompatActivity implements View.OnClickListener{

    CheckBox checkBox1;
    CheckBox checkBox2;
    CheckBox checkBox3;
    CheckBox checkBox4;
    CheckBox checkBox5;
    CheckBox checkBox6;
    CheckBox checkBox7;
    CheckBox checkBox8;
    CheckBox checkBox9;
    CheckBox checkBox10;
    ArrayList<CheckBox> checkBoxList;

    String selectedCities="Denver:Tucson:Boston:Houston:Miami:";
    String thirdCity = "Denver";

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 1) {
            if(resultCode == Activity.RESULT_OK) {
                String thirdCity = data.getStringExtra("thirdCity");
                this.thirdCity = thirdCity;

                Toast.makeText(getApplicationContext(), "thirdCity : " + thirdCity, Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_native);
        checkBoxList = new ArrayList<CheckBox>();
        checkBox1 = (CheckBox) findViewById(R.id.checkbox_id_1);
        checkBox1.setSelected(true);
        checkBox1.toggle();
        checkBox1.setOnClickListener(this);
        checkBox2 = (CheckBox) findViewById(R.id.checkbox_id_2);
        checkBox2.setSelected(true);
        checkBox2.toggle();
        checkBox2.setOnClickListener(this);
        checkBox3 = (CheckBox) findViewById(R.id.checkbox_id_3);
        checkBox3.setSelected(true);
        checkBox3.toggle();
        checkBox3.setOnClickListener(this);
        checkBox4 = (CheckBox) findViewById(R.id.checkbox_id_4);
        checkBox4.setSelected(true);
        checkBox4.toggle();
        checkBox4.setOnClickListener(this);
        checkBox5 = (CheckBox) findViewById(R.id.checkbox_id_5);
        checkBox5.setSelected(true);
        checkBox5.toggle();
        checkBox5.setOnClickListener(this);
        checkBox6 = (CheckBox) findViewById(R.id.checkbox_id_6);
        checkBox6.setOnClickListener(this);
        checkBox7 = (CheckBox) findViewById(R.id.checkbox_id_7);
        checkBox7.setOnClickListener(this);
        checkBox8 = (CheckBox) findViewById(R.id.checkbox_id_8);
        checkBox8.setOnClickListener(this);
        checkBox9 = (CheckBox) findViewById(R.id.checkbox_id_9);
        checkBox9.setOnClickListener(this);
        checkBox10 = (CheckBox) findViewById(R.id.checkbox_id_10);
        checkBox10.setOnClickListener(this);

        checkBoxList.add(checkBox1);
        checkBoxList.add(checkBox2);
        checkBoxList.add(checkBox3);
        checkBoxList.add(checkBox4);
        checkBoxList.add(checkBox5);
        checkBoxList.add(checkBox6);
        checkBoxList.add(checkBox7);
        checkBoxList.add(checkBox8);
        checkBoxList.add(checkBox9);
        checkBoxList.add(checkBox10);

        Button changeButton = (Button) findViewById(R.id.button_change);
        Button showWeatherButton = (Button) findViewById(R.id.button_weather);

        Button infoCity1 = (Button) findViewById(R.id.button_city1);
        infoCity1.setOnClickListener(this);
        Button infoCity2 = (Button) findViewById(R.id.button_city2);
        infoCity2.setOnClickListener(this);
        Button infoCity3 = (Button) findViewById(R.id.button_city3);
        infoCity3.setOnClickListener(this);
        Button infoCity4 = (Button) findViewById(R.id.button_city4);
        infoCity4.setOnClickListener(this);
        Button infoCity5 = (Button) findViewById(R.id.button_city5);
        infoCity5.setOnClickListener(this);
        Button infoCity6 = (Button) findViewById(R.id.button_city6);
        infoCity6.setOnClickListener(this);
        Button infoCity7 = (Button) findViewById(R.id.button_city7);
        infoCity7.setOnClickListener(this);
        Button infoCity8 = (Button) findViewById(R.id.button_city8);
        infoCity8.setOnClickListener(this);
        Button infoCity9 = (Button) findViewById(R.id.button_city9);
        infoCity9.setOnClickListener(this);
        Button infoCity10 = (Button) findViewById(R.id.button_city10);
        infoCity10.setOnClickListener(this);

        changeButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(getCount()){
                    selectedCities = getSelectedCities();
                    Toast.makeText(getApplicationContext(), "selected : " + selectedCities, Toast.LENGTH_LONG).show();
                }
            }
        });

        showWeatherButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent webIntent = new Intent(Native.this, MainActivity.class);
                webIntent.putExtra("SELECTED_CITIES", selectedCities);
                startActivityForResult(webIntent, 1);
            }
        });
    }

    public  boolean getCount(){
        int count = 0;
        for(CheckBox temp : checkBoxList){
            if(temp.isChecked())
                count++;
        }
        if (count > 5){
            Toast.makeText(getApplicationContext(), "Select only 5 cities", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(count < 5) {
            Toast.makeText(getApplicationContext(), "Select 5 cities", Toast.LENGTH_LONG).show();
            return false;
        }else {
            return true;
        }
    }

    public String getSelectedCities(){
        String cities = "";
        if (checkBox1.isChecked()) {
            cities += "Denver:";
        }
        if (checkBox2.isChecked()){
            cities += "Tucson:";
        }
        if (checkBox3.isChecked()) {
            cities += "Boston:";
        }
        if (checkBox4.isChecked()) {
            cities += "Houston:";
        }
        if (checkBox5.isChecked()) {
            cities += "Miami:";
        }
        if (checkBox6.isChecked()) {
            cities += "Seattle:";
        }
        if (checkBox7.isChecked()) {
            // cancel this check and set it for Tampa
            cities += "Tampa:";
        }
        if (checkBox8.isChecked()) {
            cities += "Chicago:";
        }
        if (checkBox9.isChecked()) {
            cities += "Detroit:";
        }
        if (checkBox10.isChecked()) {
            cities += "Austin:";
        }return
         cities;
    }

    public void launchInfoActivity(String url){
        Intent webIntent = new Intent(Native.this, InfoActivity.class);
        webIntent.putExtra("infoUrl", url);
        startActivityForResult(webIntent, 1);
    }

    public void checkThirdCity(CheckBox checkBox, String name){
        if (!checkBox.isChecked() && thirdCity.equals(name)){
            Toast.makeText(getApplicationContext(), "Can't uncheck third city : " + thirdCity, Toast.LENGTH_LONG).show();
            checkBox.setChecked(true);
        }
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.button_city1:
                String url = "http://www.city-data.com/cityw/Denver-CO.html";
                launchInfoActivity(url);
                break;

            case R.id.button_city2:
                url = "http://www.city-data.com/cityw/Tucson-AZ.html";
                launchInfoActivity(url);
                break;

            case R.id.button_city3:
                url = "http://www.city-data.com/cityw/Boston-MA.html";
                launchInfoActivity(url);
                break;

            case R.id.button_city4:
                url = "http://www.city-data.com/cityw/Houston-TX.html";
                launchInfoActivity(url);
                break;

            case R.id.button_city5:
                url = "http://www.city-data.com/cityw/Miami-FL.html";
                launchInfoActivity(url);
                break;

            case R.id.button_city6:
                url = "http://www.city-data.com/cityw/Seattle-WA.html";
                launchInfoActivity(url);
                break;

            case R.id.button_city7:
                url = "http://www.city-data.com/cityw/Tampa-FL.html";
                launchInfoActivity(url);
                break;


            case R.id.button_city8:
                url = "http://www.city-data.com/cityw/Chicago-IL.html";
                launchInfoActivity(url);
                break;

            case R.id.button_city9:
                url = "http://www.city-data.com/cityw/Detroit-MI.html";
                launchInfoActivity(url);
                break;

            case R.id.button_city10:
                url = "http://www.city-data.com/cityw/Austin-TX.html";
                launchInfoActivity(url);
                break;

            case R.id.checkbox_id_1:
                checkThirdCity(checkBox1, "Denver");
                break;
            case R.id.checkbox_id_2:
                checkThirdCity(checkBox2, "Tucson");
                break;
            case R.id.checkbox_id_3:
                checkThirdCity(checkBox3, "Boston");
                break;
            case R.id.checkbox_id_4:
                checkThirdCity(checkBox4, "Houston");
                break;
            case R.id.checkbox_id_5:
                checkThirdCity(checkBox5, "Miami");
                break;
            case R.id.checkbox_id_6:
                checkThirdCity(checkBox6, "Seattle");
                break;
            case R.id.checkbox_id_7:
                checkThirdCity(checkBox7, "Tampa");
                break;
            case R.id.checkbox_id_8:
                checkThirdCity(checkBox8, "Chicago");
                break;
            case R.id.checkbox_id_9:
                checkThirdCity(checkBox9, "Detroit");
                break;
            case R.id.checkbox_id_10:
                checkThirdCity(checkBox10, "Austin");
                break;

            default:
                break;
        }

    }
}
