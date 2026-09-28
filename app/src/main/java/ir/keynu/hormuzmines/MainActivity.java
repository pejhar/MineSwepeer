package ir.keynu.hormuzmines;

import android.app.Activity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;
import java.io.ByteArrayInputStream;

public class MainActivity extends Activity {
  private WebView web;
  private AdView adView;
  @Override public void onCreate(Bundle b){ super.onCreate(b); immersive();
    FrameLayout root = new FrameLayout(this);
    web = new WebView(this);
    root.addView(web, new FrameLayout.LayoutParams(-1,-1));
    setContentView(root);
    web.setBackgroundColor(0xff0b3d36);
    WebSettings s=web.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setMediaPlaybackRequiresUserGesture(false); s.setAllowFileAccess(true); s.setAllowContentAccess(false); s.setBuiltInZoomControls(false); s.setDisplayZoomControls(false);
    // Game content is strictly local. HTTP(S) requests originating from the WebView are blocked.
    web.setWebViewClient(new WebViewClient(){
      private WebResourceResponse blocked(){ return new WebResourceResponse("text/plain","UTF-8",new ByteArrayInputStream(new byte[0])); }
      @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r){ String u=r.getUrl().toString(); return (u.startsWith("http://")||u.startsWith("https://")) ? blocked() : super.shouldInterceptRequest(v,r); }
    });
    web.setWebChromeClient(new WebChromeClient());
    web.loadUrl("file:///android_asset/game/index.html");

    // Ads are the only online component. Test banner ID is safe for development.
    MobileAds.initialize(this, status -> {});
    adView = new AdView(this); adView.setAdSize(AdSize.BANNER); adView.setAdUnitId("ca-app-pub-3940256099942544/6300978111");
    FrameLayout.LayoutParams ap = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM|Gravity.CENTER_HORIZONTAL);
    ap.bottomMargin = 4; root.addView(adView, ap); adView.loadAd(new AdRequest.Builder().build());
  }
  private void immersive(){ getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE); }
  @Override public void onWindowFocusChanged(boolean h){ super.onWindowFocusChanged(h); if(h) immersive(); }
  @Override protected void onPause(){ if(web!=null) web.onPause(); if(adView!=null) adView.pause(); super.onPause(); }
  @Override protected void onResume(){ super.onResume(); if(web!=null) web.onResume(); if(adView!=null) adView.resume(); }
  @Override protected void onDestroy(){ if(adView!=null) adView.destroy(); if(web!=null) web.destroy(); super.onDestroy(); }
  @Override public void onBackPressed(){ if(web!=null && web.canGoBack()) web.goBack(); else super.onBackPressed(); }
}
