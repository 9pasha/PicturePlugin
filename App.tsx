import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CropImageScreen,
  PickImageScreen,
  SavedImageScreen,
  TRootNativeStackParamList,
} from './src/navigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const {Navigator, Screen} =
  createNativeStackNavigator<TRootNativeStackParamList>();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Navigator>
          <Screen
            name="PickImage"
            component={PickImageScreen}
            options={{title: 'Pick your image'}}
          />
          <Screen
            name="CropImage"
            component={CropImageScreen}
            options={{title: 'Crop your image'}}
          />
          <Screen
            name="SavedImage"
            component={SavedImageScreen}
            options={{title: 'Check your image'}}
          />
        </Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
