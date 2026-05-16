package com.anonymous.flow_

import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.view.View
import android.view.WindowInsetsController
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class StatusBarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "StatusBarModule"
    }

    @ReactMethod
    fun setStatusBarColor(color: String, promise: Promise) {
        try {
            val activity = getCurrentActivity()
            if (activity != null) {
                activity.runOnUiThread {
                    val window = activity.window
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        // Convertir la couleur hex en int
                        val colorInt = Color.parseColor(color)
                        window.statusBarColor = colorInt
                        
                        // Forcer les icônes de la barre d'état à être noires (dark)
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                            // Android 11+ (API 30+)
                            val controller = window.insetsController
                            controller?.setSystemBarsAppearance(
                                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS,
                                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                            )
                        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            // Android 6.0+ (API 23-29)
                            val decorView = window.decorView
                            var flags = decorView.systemUiVisibility
                            flags = flags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                            decorView.systemUiVisibility = flags
                        }
                        
                        promise.resolve(true)
                    } else {
                        promise.reject("UNSUPPORTED", "Android version too old")
                    }
                }
            } else {
                promise.reject("NO_ACTIVITY", "No current activity")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message ?: "Unknown error")
        }
    }
}

