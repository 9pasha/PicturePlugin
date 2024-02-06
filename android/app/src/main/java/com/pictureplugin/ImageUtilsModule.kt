package com.pictureplugin // replace your-apps-package-name with your app’s package name

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Rect
import android.os.Environment
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

class ImageUtilsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ImageUtils"
    }

    @ReactMethod
    fun cropImage(imagePath: String, x: Int, y: Int, width: Int, height: Int, promise: Promise) {
        val originalBitmap = BitmapFactory.decodeFile(imagePath)
        if (originalBitmap != null) {
            val croppedBitmap = Bitmap.createBitmap(originalBitmap, x, y, width, height)
//            val outputDir = reactApplicationContext.filesDir
            val outputDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
            val fileName = "cropped_image_${System.currentTimeMillis()}.jpg"
            val outputFile = File(outputDir, fileName)

            try {
                FileOutputStream(outputFile).use { outputStream ->
                    croppedBitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream)
                }

                val resultMap = Arguments.createMap()
                resultMap.putString("croppedImagePath", outputFile.absolutePath)
                promise.resolve(resultMap)
            } catch (e: IOException) {
                promise.reject("CROP_FAILED", "Failed to save cropped image")
            }
        } else {
            promise.reject("INVALID_IMAGE", "Invalid image path")
        }
        }
    }