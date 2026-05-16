package com.anonymous.flow_

import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Flow_"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Configurer la status bar pour qu'elle soit opaque et pousse le contenu (ne soit pas par-dessus)
    // React Native peut ignorer fitsSystemWindows, donc on force le comportement de plusieurs façons
    
    // 1. Configuration pour Android 11+ (API 30+)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.setDecorFitsSystemWindows(true)
    }
    
    // 2. Forcer fitsSystemWindows sur la vue racine après que React Native l'ait initialisée
    // On utilise plusieurs post() pour s'assurer que ça soit appliqué
    window.decorView.post {
      val rootView = window.decorView.rootView
      rootView?.fitsSystemWindows = true
      
      // Forcer aussi sur les enfants si nécessaire
      if (rootView is android.view.ViewGroup) {
        rootView.fitsSystemWindows = true
      }
    }
    
    // 3. Répéter après un court délai pour s'assurer que React Native n'a pas écrasé la valeur
    window.decorView.postDelayed({
      val rootView = window.decorView.rootView
      rootView?.fitsSystemWindows = true
    }, 100)
  }
}
