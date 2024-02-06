import {Alert} from 'react-native';

export const errorHandler = (callback: () => void) => {
  Alert.alert('Something went wrong :(', 'Pls try again and pick new image', [
    {
      text: 'OK',
      onPress: () => callback(),
    },
  ]);
};
