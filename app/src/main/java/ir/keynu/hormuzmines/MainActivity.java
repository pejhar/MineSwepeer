package ir.keynu.hormuzmines;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

public class MainActivity extends Activity {
  private WebView web;
  // Official Tapsell Plus test app key. Replace with the production app key before publishing.
  private static final String TAPSELL_TEST_APP_KEY = "alsoatsrtrotpqacegkehkaiieckldhrgsbspqtgqnbrrfccrtbdomgjtahflchkqtqosa";

  @Override public void onCreate(Bundle b){
    super.onCreate(b); immersive();
    web = new WebView(this);
    setContentView(web);
    web.setBackgroundColor(0xff0b3d36);
    WebSettings s=web.getSettings();
    s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setMediaPlaybackRequiresUserGesture(false);
    s.setAllowFileAccess(true); s.setAllowContentAccess(false); s.setBuiltInZoomControls(false); s.setDisplayZoomControls(false);
    // Gameplay remains offline. Only native advertising SDK traffic is allowed outside the WebView.
    web.setWebViewClient(new WebViewClient(){
      private WebResourceResponse blocked(){ return new WebResourceResponse("text/plain","UTF-8",new ByteArrayInputStream(new byte[0])); }
      @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r){
        String u=r.getUrl().toString();
        return (u.startsWith("http://")||u.startsWith("https://")) ? blocked() : super.shouldInterceptRequest(v,r);
      }
    });
    web.setWebChromeClient(new WebChromeClient());
    web.loadUrl("file:///android_asset/game/index.html");
    initializeTapsellPlus();
  }

  // Reflection keeps the WebView shell independent of SDK API surface changes while still packaging/initializing Tapsell Plus.
  private void initializeTapsellPlus(){
    try {
      Class<?> c=Class.forName("ir.tapsell.plus.TapsellPlus");
      for(Method m:c.getMethods()){
        if(!m.getName().equals("initialize") || !Modifier.isStatic(m.getModifiers())) continue;
        Class<?>[] p=m.getParameterTypes();
        if(p.length==2 && android.content.Context.class.isAssignableFrom(p[0]) && p[1]==String.class){
          m.invoke(null,this,TAPSELL_TEST_APP_KEY); return;
        }
        if(p.length==2 && p[0]==String.class && android.content.Context.class.isAssignableFrom(p[1])){
          m.invoke(null,TAPSELL_TEST_APP_KEY,this); return;
        }
      }
    } catch(Throwable ignored) { }
  }

  private void immersive(){ getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE); }
  @Override public void onWindowFocusChanged(boolean h){ super.onWindowFocusChanged(h); if(h) immersive(); }
  @Override protected void onPause(){ if(web!=null) web.onPause(); super.onPause(); }
  @Override protected void onResume(){ super.onResume(); if(web!=null) web.onResume(); }
  @Override protected void onDestroy(){ if(web!=null) web.destroy(); super.onDestroy(); }
  @Override public void onBackPressed(){ if(web!=null && web.canGoBack()) web.goBack(); else super.onBackPressed(); }
}
