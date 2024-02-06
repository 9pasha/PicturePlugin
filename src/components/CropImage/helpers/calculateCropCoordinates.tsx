import {SharedValue} from 'react-native-reanimated';

type TSharedSize = SharedValue<number>;
type TSharedCoordinates = SharedValue<{x: number; y: number}>;

interface ICalculateCropCoordinatesProps {
  sizeOfImageContainer: {width: number; height: number};
  imageHeight: number;
  cropRectHeight: number;
  frameSize: TSharedSize;
  scale: TSharedSize;
  densityOfScreen: number;
  start: TSharedCoordinates;
  cropRectWidth: number;
}

interface IResolveMoveOutFrameReturn {}

export const calculateCropCoordinates = ({
  sizeOfImageContainer,
  imageHeight,
  cropRectHeight,
  frameSize,
  scale,
  densityOfScreen,
  start,
  cropRectWidth,
}: ICalculateCropCoordinatesProps) => {
  const widthOfCropRect = cropRectWidth * frameSize.value;
  const heightOfCropRect = cropRectHeight * frameSize.value;

  const widthOfCanvas = sizeOfImageContainer.width;
  const heightOfCanvas = sizeOfImageContainer.height;

  const imageHeightInScreen = imageHeight / densityOfScreen;

  const blankSpaceDiffY =
    ((heightOfCanvas * scale.value - imageHeightInScreen * scale.value) / 2) *
    densityOfScreen;

  const offsetX = start.value.x * densityOfScreen;
  const offsetY = start.value.y * densityOfScreen;
  const cropFrameX =
    ((widthOfCanvas * scale.value - widthOfCropRect) / 2) * densityOfScreen -
    offsetX;
  const cropFrameY =
    ((heightOfCanvas * scale.value - heightOfCropRect) / 2) * densityOfScreen -
    blankSpaceDiffY -
    offsetY;

  return {cropFrameX, cropFrameY, widthOfCropRect, heightOfCropRect};
};
