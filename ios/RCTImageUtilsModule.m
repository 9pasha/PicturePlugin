// RCTImageUtilsModule.m
#import "RCTImageUtilsModule.h"
#import <UIKit/UIKit.h>

@implementation RCTImageUtilsModule

RCT_EXPORT_MODULE(ImageUtils);
RCT_EXPORT_METHOD(cropAndSaveImageAtPath:(NSString *)imagePath originX:(CGFloat)originX originY:(CGFloat)originY width:(CGFloat)width height:(CGFloat)height callback:(RCTResponseSenderBlock)callback) {
  
      if (!imagePath) {
          NSLog(@"Error: Image path is nil");
          callback(@[@"Error: Image path is nil", [NSNull null]]);

          return;
      }
      
      NSURL *url = [NSURL URLWithString:imagePath];
      if (!url) {
          NSLog(@"Error: Invalid image path URL");
          callback(@[@"Error: Invalid image path URL", [NSNull null]]);

          return;
      }
      
      NSString *filePath = [url path];
      if (!filePath) {
          NSLog(@"Error: Failed to extract file path from URL");
          callback(@[@"Error: Failed to extract file path from URL", [NSNull null]]);

          return;
      }
      
      UIImage *image = [UIImage imageWithContentsOfFile:filePath];
      if (!image) {
          NSLog(@"Error: Failed to load image at path %@", filePath);
          callback(@[[NSString stringWithFormat:@"Error: Failed to load image at path %@", filePath], [NSNull null]]);

          return;
      }
      
      CGRect rect = CGRectMake(originX, originY, width, height);
      CGImageRef imageRef = CGImageCreateWithImageInRect([image CGImage], rect);
      if (!imageRef) {
          NSLog(@"Error: Failed to crop image");
          callback(@[@"Error: Failed to crop image", [NSNull null]]);

          return;
      }
      
      UIImage *croppedImage = [UIImage imageWithCGImage:imageRef];
      CGImageRelease(imageRef);
      
      NSData *croppedImageData = UIImageJPEGRepresentation(croppedImage, 1.0);
      
      NSString *tmpDir = NSTemporaryDirectory();
      NSString *tmpFilePath = [tmpDir stringByAppendingPathComponent:@"croppedImage.jpg"];
      
      if ([croppedImageData writeToFile:tmpFilePath atomically:YES]) {
          NSLog(@"Cropped image saved at path: %@", tmpFilePath);
          callback(@[[NSNull null], tmpFilePath]);
      } else {
          NSLog(@"Error: Failed to save cropped image");
          callback(@[@"Error: Failed to save cropped image", [NSNull null]]);
      }
}

@end
