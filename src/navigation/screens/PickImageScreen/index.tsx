import {View, Button, StyleSheet} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {TRootNativeStackScreenProps} from '../../types';
import {errorHandler} from '../../../utils';

type TPickImageScreenProps = TRootNativeStackScreenProps<'PickImage'>;

export const PickImageScreen = ({navigation}: TPickImageScreenProps) => {
  const onPickedImage = (image: Pick<ImagePickerResponse, 'assets'>) => {
    const assets = image.assets || [];

    navigation.navigate('CropImage', {
      uri: assets[0].uri,
      imageWidth: assets[0].width || 0,
      imageHeight: assets[0].height || 0,
      originPath: assets[0].originalPath,
    });
  };

  const handleLoadImage = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'photo'});
      onPickedImage(result);
    } catch (e) {
      console.log(e);
      errorHandler(() => {
        navigation.navigate('PickImage');
      });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Image" onPress={handleLoadImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
