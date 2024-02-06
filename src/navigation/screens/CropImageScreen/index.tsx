import {View, StyleSheet} from 'react-native';
import {CropImage} from '../../../components';
import {TRootNativeStackScreenProps} from '../..';
import {errorHandler} from '../../../utils';

const MAX_CROP_RECT_WIDTH = 250;
const MAX_CROP_RECT_HEIGHT = 250;

type TCropImageScreenProps = TRootNativeStackScreenProps<'CropImage'>;

export const CropImageScreen = ({route, navigation}: TCropImageScreenProps) => {
  const {uri = '', originPath = '', imageWidth, imageHeight} = route.params;

  const onCropHandler = (path: string) => {
    navigation.navigate('SavedImage', {uri: `file://${path}`});
  };

  const showError = () => {
    errorHandler(() => {
      navigation.navigate('PickImage');
    });
  };

  return (
    <View style={styles.container}>
      <CropImage
        uri={uri}
        originPath={originPath}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        cropRectWidth={MAX_CROP_RECT_WIDTH}
        cropRectHeight={MAX_CROP_RECT_HEIGHT}
        onSuccess={onCropHandler}
        onError={showError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
});
