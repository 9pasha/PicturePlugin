package com.imageutils; // replace your-apps-package-name with your app’s package name

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Rect;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class ImageUtilsModule extends ReactContextBaseJavaModule {

    public ImageUtilsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ImageUtils";
    }

    @ReactMethod
    public void cropImage(String imagePath, int x, int y, int width, int height, Promise promise) {
        Bitmap originalBitmap = BitmapFactory.decodeFile(imagePath);
        if (originalBitmap != null) {
            Bitmap croppedBitmap = Bitmap.createBitmap(originalBitmap, x, y, width, height);
            File outputFile = new File(getReactApplicationContext().getFilesDir(), "cropped_image.jpg");

            try {
                FileOutputStream outputStream = new FileOutputStream(outputFile);
                croppedBitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);
                outputStream.close();

                WritableMap resultMap = Arguments.createMap();
                resultMap.putString("croppedImagePath", outputFile.getAbsolutePath());
                promise.resolve(resultMap);
            } catch (IOException e) {
                promise.reject("CROP_FAILED", "Failed to save cropped image");
            }
        } else {
            promise.reject("INVALID_IMAGE", "Invalid image path");
        }
    }
}
