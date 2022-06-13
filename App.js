/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {StatusBar, useColorScheme, ScrollView} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from './src/routes';
import {PermissionsAndroid} from 'react-native';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import rootReducer from './src/redux/store';
LogBox.ignoreLogs(['NativeBase:']);
import * as HaskellShelley from './src/libs/HaskellShelley';
import * as CardanoMessageSigning from './src/libs/CardanoMessageSigning';
try {
  console.log('HaskellShelley');
  console.log(HaskellShelley);
  console.log('CardanoMessageSigning');
  console.log(CardanoMessageSigning);
} catch (e) {
  console.log(e);
}
// const _contentContainerStyle = {flexGrow: 1};

const Stack = createNativeStackNavigator();
const App = () => {
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    requestCameraPermission();
  });
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={rootReducer}>
      <NavigationContainer>
        <NativeBaseProvider>
          <SafeAreaView style={{height: '100%'}}>
            {/* <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              bg="white"
              h="full"
              _contentContainerStyle={_contentContainerStyle}> */}
            {/* <Header /> */}
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Stack.Navigator initialRouteName="Welcome">
              {routes.map((item, index) => {
                return <Stack.Screen {...item} key={index} />;
              })}
            </Stack.Navigator>
            {/* </ScrollView> */}
          </SafeAreaView>
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
