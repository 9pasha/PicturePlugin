import {NativeModules} from 'react-native';

const {ImageUtils} = NativeModules;

interface IImageUtils {
  cropImage(
    imagePath: string,
    x: number,
    y: number,
    dx: number,
    dy: number,
  ): Promise<{croppedImagePath: string}>;
}

export default ImageUtils as IImageUtils;
