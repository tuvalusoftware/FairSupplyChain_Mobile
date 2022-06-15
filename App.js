/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from './src/routes';
import {PermissionsAndroid} from 'react-native';
import {LogBox} from 'react-native';
import {Provider, useDispatch} from 'react-redux';
import rootReducer from './src/redux/store';
import {userSliceActions} from './src/redux/reducer/user';
import {
  getCurrentAccount,
  getNetwork,
  setNetwork,
  getBalance,
} from './src/util/script';
import useShallowEqualSelector from './src/redux/customHook/useShallowEqualSelector';
import {NETWORK_ID, NODE} from './src/util/Constants';
import SplashScreen from 'react-native-splash-screen';
LogBox.ignoreLogs(['NativeBase:']);

// const _contentContainerStyle = {flexGrow: 1};

const Stack = createNativeStackNavigator();
const App = () => {
  const dispatch = useDispatch();
  const network = useShallowEqualSelector(state => state.user?.network);
  console.log('App network', network);
  const initNetwork = async () => {
    let _network = await getNetwork();
    console.log('initNetwork', _network);
    if (_network.id === NETWORK_ID.mainnet) {
      dispatch(
        userSliceActions.setData({
          network: NETWORK_ID.mainnet,
        }),
      );
      setNetwork({
        id: NETWORK_ID.mainnet,
        node: NODE.mainnet,
      });
      return;
    }
    dispatch(
      userSliceActions.setData({
        network: NETWORK_ID.testnet,
      }),
    );
    setNetwork({
      id: NETWORK_ID.testnet,
      node: NODE.testnet,
    });
  };

  const initUser = async () => {
    try {
      let account = await getCurrentAccount();
      dispatch(
        userSliceActions.setData({
          userInfo: account,
          isLogged: true,
        }),
      );
    } catch (err) {
      console.log('App Error', err);
    }
  };
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
  const _getBalanceFirstTime = async () => {
    console.log('_getBalanceFirstTime');
    const asset = await getBalance();
    dispatch(
      userSliceActions.setData({
        userInfo: {assets: [asset]},
      }),
    );
    console.log('asset', asset);
  };
  useEffect(() => {
    initUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);
  useEffect(() => {
    requestCameraPermission();
    initNetwork();
    _getBalanceFirstTime();
    SplashScreen.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <SafeAreaView style={{height: '100%'}}>
          {/* <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              bg="white"
              h="full"
              _contentContainerStyle={_contentContainerStyle}> */}
          {/* <Header /> */}
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Stack.Navigator initialRouteName="Welcome">
            {routes.map((item, index) => {
              return <Stack.Screen {...item} key={index} />;
            })}
          </Stack.Navigator>
          {/* </ScrollView> */}
        </SafeAreaView>
      </NativeBaseProvider>
    </NavigationContainer>
  );
};

export default function Container(props) {
  return (
    <Provider store={rootReducer}>
      <App {...props} />
    </Provider>
  );
}
