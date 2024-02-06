import Clipboard from '@react-native-clipboard/clipboard';
import {View, Image, StyleSheet, Text, Pressable} from 'react-native';
import {TRootNativeStackScreenProps} from '../..';

type TSavedImageScreenProps = TRootNativeStackScreenProps<'SavedImage'>;

export const SavedImageScreen = ({route}: TSavedImageScreenProps) => {
  const {uri: imageURI} = route.params;

  const copyPath = () => {
    Clipboard.setString(imageURI || '');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{uri: imageURI}}
        resizeMode="contain"
      />
      <View style={styles.settingsPanel}>
        <View style={styles.imageInfoContainer}>
          <Text style={styles.imagePathText}>{imageURI}</Text>
        </View>
        <Pressable style={styles.copyPathButton} onPress={copyPath}>
          <Text style={styles.copyPathButtonText}>Copy path</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  settingsPanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    minHeight: 120,
    backgroundColor: 'transparent',
    padding: 10,
    gap: 10,
    justifyContent: 'space-between',
  },
  imageInfoContainer: {},
  imagePathText: {
    fontSize: 16,
  },
  copyPathButton: {
    width: 120,
    height: 48,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyPathButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
});
