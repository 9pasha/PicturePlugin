import {
  Dimensions,
  Image,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ImageUtils from '../../libs/nativeModules/imageCrop';
import {Slider} from '..';
import {useRef} from 'react';
import {calculateCropCoordinates} from './helpers/calculateCropCoordinates';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface ICropImageProps {
  uri: string;
  originPath?: string;
  imageWidth: number;
  imageHeight: number;
  cropRectWidth: number;
  cropRectHeight: number;
  onSuccess: (path: string) => void;
  onError?: (err?: string) => void;
}

export const CropImage = ({
  uri,
  originPath = '',
  imageWidth,
  imageHeight,
  cropRectWidth,
  cropRectHeight,
  onSuccess,
  onError,
}: ICropImageProps) => {
  const styles = stylesFn(cropRectWidth, cropRectHeight);

  const sizeOfImageContainer = useRef<{width: number; height: number}>({
    width: 0,
    height: 0,
  });
  const onLayoutHandler = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    sizeOfImageContainer.current = {width, height};
  };

  const densityOfScreen = imageWidth / screenWidth;

  const frameSize = useSharedValue(1);

  const offset = useSharedValue({x: 0, y: 0});
  const scale = useSharedValue(1);

  const animatedImageContainerStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: withSpring(offset.value.x)},
      {translateY: withSpring(offset.value.y)},
      {scale: withSpring(scale.value)},
    ],
  }));

  const start = useSharedValue({x: 0, y: 0});
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
      // FIX: Move to helpers
      // Resolve move out of picture frame
      const sizeOfCropReact = cropRectHeight * frameSize.value;

      const widthOfImageInScreen =
        (imageWidth * scale.value) / densityOfScreen / 2 - sizeOfCropReact / 2;

      const halfWidthWithDiff = widthOfImageInScreen;
      const halfHeightWithDiff =
        (imageHeight * scale.value - sizeOfCropReact * densityOfScreen) /
        2 /
        densityOfScreen;

      if (start.value.x > halfWidthWithDiff) {
        start.value = {...start.value, x: halfWidthWithDiff};
        offset.value = {...offset.value, x: halfWidthWithDiff};
      } else if (start.value.x < -halfWidthWithDiff) {
        start.value = {...start.value, x: -halfWidthWithDiff};
        offset.value = {...offset.value, x: -halfWidthWithDiff};
      }

      if (start.value.y > halfHeightWithDiff) {
        start.value = {...start.value, y: halfHeightWithDiff};
        offset.value = {...offset.value, y: halfHeightWithDiff};
      } else if (start.value.y < -halfHeightWithDiff) {
        start.value = {...start.value, y: -halfHeightWithDiff};
        offset.value = {...offset.value, y: -halfHeightWithDiff};
      }
    });

  const pinchGesture = Gesture.Pinch().onUpdate(e => {
    scale.value = e.scale;
  });

  const composedGestures = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedFrameStyles = useAnimatedStyle(() => {
    return {
      width: withSpring(frameSize.value * cropRectWidth),
      height: withSpring(frameSize.value * cropRectHeight),
    };
  });

  // Crop image calling native modules
  const cropImage = async () => {
    const {cropFrameX, cropFrameY, widthOfCropRect, heightOfCropRect} =
      calculateCropCoordinates({
        sizeOfImageContainer: {
          width: sizeOfImageContainer.current.width,
          height: sizeOfImageContainer.current.height,
        },
        imageHeight,
        cropRectHeight,
        frameSize,
        scale,
        densityOfScreen,
        start,
        cropRectWidth,
      });

    try {
      if (Platform.OS === 'ios') {
        // FIX: Need to refactor native IOS module
        // @ts-ignore
        ImageUtils.cropAndSaveImageAtPath(
          uri,
          cropFrameX / scale.value,
          cropFrameY / scale.value,
          (widthOfCropRect * densityOfScreen) / scale.value,
          (heightOfCropRect * densityOfScreen) / scale.value,
          (data: string | null, croppedImagePath: string) => {
            console.log('Success', data, croppedImagePath);
            onSuccess(croppedImagePath);
          },
        );
      } else if (Platform.OS === 'android') {
        const {croppedImagePath} = await ImageUtils.cropImage(
          originPath,
          cropFrameX / scale.value,
          cropFrameY / scale.value,
          (widthOfCropRect * densityOfScreen) / scale.value,
          (heightOfCropRect * densityOfScreen) / scale.value,
        );

        onSuccess(croppedImagePath);
      }
    } catch (e) {
      onError && onError(e as string);
      console.log(e);
    }
  };

  const defaultSliderValue = 1;
  const minSliderValue = 0.3;
  const changeFrameSize = (value: number) => {
    frameSize.value = value;
  };

  return (
    <View style={styles.container} onLayout={onLayoutHandler}>
      <GestureDetector gesture={composedGestures}>
        <View style={styles.container}>
          <Animated.View style={[styles.cropRound, animatedFrameStyles]} />
          <Animated.View
            style={[styles.animatedContainer, animatedImageContainerStyles]}>
            <Image style={styles.image} source={{uri}} resizeMode="contain" />
          </Animated.View>
        </View>
      </GestureDetector>
      <View style={styles.settingsPanel}>
        <View style={styles.changeFrameSizeContainer}>
          <Text style={styles.changeFrameSizeLabel}>Change frame size:</Text>
          <Slider
            onValueChange={changeFrameSize}
            value={defaultSliderValue}
            minimumValue={minSliderValue}
          />
        </View>
        <Pressable style={styles.cropButton} onPress={cropImage}>
          <Text style={styles.cropButtonText}>Crop</Text>
        </Pressable>
      </View>
    </View>
  );
};

const stylesFn = (rectWidth: number, reactHeight: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'red',
      justifyContent: 'center',
    },
    cropRound: {
      position: 'absolute',
      alignSelf: 'center',
      width: rectWidth,
      height: reactHeight,
      borderWidth: 2,
      borderColor: 'black',
      zIndex: 1000,
    },
    animatedContainer: {
      width: '100%',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    settingsPanel: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 90,
      backgroundColor: 'transparent',
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    changeFrameSizeContainer: {},
    changeFrameSizeLabel: {
      paddingLeft: 14,
      fontSize: 18,
      fontWeight: '600',
    },
    cropButton: {
      width: 120,
      height: 48,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cropButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
    },
  });
