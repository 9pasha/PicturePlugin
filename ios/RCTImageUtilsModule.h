// RCTImageUtilsModule.h
#import <React/RCTBridgeModule.h>

@interface RCTImageUtilsModule : NSObject <RCTBridgeModule>

- (void)cropAndSaveImageAtPath:(NSString *)imagePath originX:(CGFloat)originX originY:(CGFloat)originY width:(CGFloat)width height:(CGFloat)height callback:(RCTResponseSenderBlock)callback;

@end
