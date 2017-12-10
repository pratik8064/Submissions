package com.example.pratik.myapplication;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class InfoActivity extends AppCompatActivity {

    private WebView myView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_info);


        myView = (WebView)findViewById(R.id.myInfoWebView);

        myView.setHorizontalScrollBarEnabled(true);
        myView.setVerticalScrollBarEnabled(true);
        myView.setWebContentsDebuggingEnabled(true);

        myView.setWebViewClient(new WebViewClient(){
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return true;
            }
        });
        WebSettings webSettings = myView.getSettings();

        webSettings.setDomStorageEnabled(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        final String url = getIntent().getStringExtra("infoUrl");
        myView.loadUrl(url);

    }
}
