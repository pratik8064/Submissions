package com.example.pratik.myapplication;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import static android.app.Activity.RESULT_OK;

public class MainActivity extends AppCompatActivity {

    private WebView myView;

    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        intent.putExtra("thirdCity", WebAppInterface.thirdCity);
        setResult(Activity.RESULT_OK, intent);
        finish();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        myView = (WebView)findViewById(R.id.myWebView);
        myView.setHorizontalScrollBarEnabled(true);
        myView.setVerticalScrollBarEnabled(true);
        myView.setWebContentsDebuggingEnabled(true);
        myView.setWebChromeClient(new WebChromeClient());

        WebSettings webSettings = myView.getSettings();

        // enable JS
        webSettings.setDomStorageEnabled(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        final String cityList = getIntent().getStringExtra("SELECTED_CITIES");

        myView.setWebViewClient(new WebViewClient() {
            public void onPageFinished(WebView view, String url) {
                myView.evaluateJavascript("getCityList(\"" + cityList + "\")", null);
            }
        });
        WebAppInterface temp = new WebAppInterface(this.getApplicationContext());
        myView.addJavascriptInterface(temp, "Android");

        myView.loadUrl("file:///android_asset/www/ajaxweatherupdated.html");

    }
}

class WebAppInterface {
    private Context mContext;
    public static String thirdCity;
    public static String cityList;
    WebAppInterface(Context c) {
        mContext = c;
    }

    @JavascriptInterface
    public void sendThirdCity(String thirdCity) {
        this.thirdCity = thirdCity;
    }

}