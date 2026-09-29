package ir.keynu.hormuzmines;
import android.app.Activity;import android.os.Bundle;import android.os.VibrationEffect;import android.os.Vibrator;import android.content.Context;import android.view.View;import android.webkit.*;import java.io.*;
public class MainActivity extends Activity{
 private WebView web; private static final String PREFIX="/hormuz/";
 @Override public void onCreate(Bundle b){super.onCreate(b);immersive();web=new WebView(this);setContentView(web);WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(web,true);web.addJavascriptInterface(new NativeBridge(),"Android");web.setWebChromeClient(new WebChromeClient());web.setWebViewClient(new WebViewClient(){
  @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){String host=r.getUrl().getHost(),path=r.getUrl().getPath();if("keynu.ir".equalsIgnoreCase(host)&&path!=null&&path.startsWith(PREFIX)){String rel=path.substring(PREFIX.length());if(rel.isEmpty())rel="index.html";try{return new WebResourceResponse(mime(rel),"UTF-8",getAssets().open("game/"+rel));}catch(Exception e){return null;}}return super.shouldInterceptRequest(v,r);}
 });web.loadUrl("https://keynu.ir/hormuz/index.html");}

 private class NativeBridge {
  @JavascriptInterface public void vibrate(String pattern){
   try{
    String[] parts=pattern.split(","); long[] p=new long[parts.length+1]; p[0]=0;
    for(int i=0;i<parts.length;i++)p[i+1]=Math.max(0,Long.parseLong(parts[i].trim()));
    Vibrator v=(Vibrator)getSystemService(Context.VIBRATOR_SERVICE); if(v==null)return;
    if(android.os.Build.VERSION.SDK_INT>=26)v.vibrate(VibrationEffect.createWaveform(p,-1)); else v.vibrate(p,-1);
   }catch(Exception ignored){}
  }
 }
 private String mime(String p){p=p.toLowerCase();if(p.endsWith(".html"))return"text/html";if(p.endsWith(".css"))return"text/css";if(p.endsWith(".js"))return"application/javascript";if(p.endsWith(".png"))return"image/png";if(p.endsWith(".jpg")||p.endsWith(".jpeg"))return"image/jpeg";if(p.endsWith(".mp3"))return"audio/mpeg";if(p.endsWith(".ttf"))return"font/ttf";return"application/octet-stream";}
 private void immersive(){getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE);} @Override public void onWindowFocusChanged(boolean h){super.onWindowFocusChanged(h);if(h)immersive();}@Override protected void onPause(){if(web!=null)web.onPause();super.onPause();}@Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}@Override protected void onDestroy(){if(web!=null)web.destroy();super.onDestroy();}
}
