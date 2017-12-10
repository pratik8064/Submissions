package com.example.pratik.myapplication;

import android.view.View;
import android.webkit.WebView;

/**
 * Created by Pratik on 11/28/2017.
 */

public class InfoListener implements View.OnClickListener {

    static void launchInfoActivity(String url){
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

            default:
                break;
        }
    }
}
