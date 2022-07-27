/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {StatusBar, useColorScheme, AppState} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from './src/routes';
// import {PermissionsAndroid} from 'react-native';
import {LogBox} from 'react-native';
import {Provider, useDispatch} from 'react-redux';
import rootReducer from './src/redux/store';
import {userSliceActions} from './src/redux/reducer/user';
import Onboarding from './src/screen/Onboarding';
import {
  getCurrentAccount,
  getNetwork,
  setNetwork,
  getBalance,
} from './src/util/script';
import useShallowEqualSelector from './src/redux/customHook/useShallowEqualSelector';
import Constants, {
  getStorage,
  NETWORK_ID,
  NODE,
  setStorage,
} from './src/util/Constants';
// import splashScreen from './src/images/splashScreen.png';
import SplashScreen from 'react-native-splash-screen';
import CreateTheme from './src/util/CreateTheme';
LogBox.ignoreLogs(['NativeBase:']);
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
// const _contentContainerStyle = {flexGrow: 1};

const Stack = createNativeStackNavigator();
const App = () => {
  const dispatch = useDispatch();
  const {isLogged, network} = useShallowEqualSelector(state => ({
    network: state.user?.network,
    isLogged: state.user.isLogged,
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingViewed, setOnboarding] = useState(false);
  const initNetwork = async () => {
    let _network = await getNetwork();
    // console.log('initNetwork', _network);
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
      if (account) {
        dispatch(
          userSliceActions.setData({
            userInfo: account,
            isLogged: true,
          }),
        );
      }
      let _onboardingViewed = await getStorage(
        Constants.STORAGE.onboardingViewed,
      );
      _onboardingViewed = _onboardingViewed || false;
      setOnboarding(_onboardingViewed);
    } catch (err) {
      console.log('App Error', err);
    }
    setIsLoading(false);
    if (isLoading) {
      setTimeout(() => SplashScreen.hide(), 1000);
    }
  };
  // const requestCameraPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       {
  //         title: 'Cool Photo App Camera Permission',
  //         message:
  //           'Cool Photo App needs access to your camera ' +
  //           'so you can take awesome pictures.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('You can use the camera');
  //     } else {
  //       console.log('Camera permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };
  const _getBalanceFirstTime = async () => {
    console.log('_getBalanceFirstTime');
    const asset = await getBalance();
    dispatch(
      userSliceActions.setData({
        userInfo: {assets: [asset]},
      }),
    );
  };
  useEffect(() => {
    // setIsLoading(true);
    initUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);
  useEffect(() => {
    // requestCameraPermission();
    initNetwork();
    _getBalanceFirstTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = nextAppState => {
    console.log('nextAppState', nextAppState);
    if (nextAppState === 'inactive') {
      console.log('the app is closed');
    }
  };
  const isDarkMode = useColorScheme() === 'dark';
  if (isLoading) {
    return null;
  }
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={CreateTheme}>
        <SafeAreaView style={{height: '100%'}}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          {!onboardingViewed ? (
            <Onboarding
              start={async () => {
                await setStorage(Constants.STORAGE.onboardingViewed, 'true');
                setOnboarding(true);
              }}
            />
          ) : (
            <Stack.Navigator
              initialRouteName={isLogged ? 'RevokeDoc' : 'Welcome'}>
              {routes.map((item, index) => {
                return <Stack.Screen {...item} key={index} />;
              })}
            </Stack.Navigator>
          )}
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
