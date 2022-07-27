/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
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
let interval;
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

  // countEl.current = network;
  const fetchBalance = async _network => {
    let account = await getCurrentAccount();
    let network_2 = await getNetwork();
    if (!account) {
      return;
    }
    if (interval) {
      clearInterval(interval);
    }
    // const _price = await fetchPrice();
    // setPrice(_price);
    const asset = await getBalance();
    if (network_2.id !== _network) {
      return;
    }
    dispatch(
      userSliceActions.setData({
        userInfo: {assets: [asset]},
      }),
    );
    interval = setTimeout(() => fetchBalance(_network), 60000);
  };
  const init = async () => {
    await initUser();
    fetchBalance(network);
  };
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);
  useEffect(() => {
    initNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Stack.Navigator initialRouteName={isLogged ? 'Main' : 'Welcome'}>
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
