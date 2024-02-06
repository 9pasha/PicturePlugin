import {NativeStackScreenProps} from '@react-navigation/native-stack';

interface ICropImageScreenParams {
  uri?: string;
  originPath?: string;
  imageWidth: number;
  imageHeight: number;
}

interface ISavedImageScreenParams {
  uri?: string;
  originPath?: string;
}

export type TRootNativeStackParamList = {
  PickImage: undefined;
  CropImage: ICropImageScreenParams;
  SavedImage: ISavedImageScreenParams;
};

export type TRootNativeStackScreenProps<
  T extends keyof TRootNativeStackParamList,
> = NativeStackScreenProps<TRootNativeStackParamList, T>;
