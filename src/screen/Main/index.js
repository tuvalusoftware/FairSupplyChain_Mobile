/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Box, useTheme} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeTab from './Home/HomeTab';
import CreateDocument from '../CreateDocument';
import styles from './styles';
import {TouchableOpacity} from 'react-native';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import Constants, {setStorage} from '../../util/Constants';
import Documents from '../Documents';
import ModalSeed from './ModalSeed';
import LoginSheet from '../../components/LoginSheet';
import {verifyAccessToken, getAddress, getTransitions} from '../../util/script';
import {useDispatch} from 'react-redux';
import {userSliceActions} from '../../redux/reducer/user';
import {getStorage} from '../../util/Constants';
import {documentsSliceActions} from '../../redux/reducer/documents';
import Gallery from '../Gallery';
const Tab = createBottomTabNavigator();
export default function Main(props) {
  const [open, setOpen] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [openLogin, setOpenLogin] = useState(false);
  const [isInitData, setInitData] = useState(false);
  const {user} = useShallowEqualSelector(state => ({
    user: state.user,
  }));
  const {colors} = useTheme();
  const dispatch = useDispatch();
  useEffect(() => {
    initData();
  }, [props.route?.params?.mnemonic]);
  useEffect(() => {
    if (props.route?.params?.fetchNew) {
      _getTransition();
    }
  }, [props.route?.params]);
  const initData = async () => {
    setInitData(true);
    let _mnemonic = props.route?.params?.mnemonic;
    setMnemonic(_mnemonic);
    setOpen(Boolean(_mnemonic));
    await checkConnected(_mnemonic);
    setInitData(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (!connected) {
      setOpenLogin(true);
    }
  };

  const dispatchUser = data => {
    dispatch(userSliceActions.setData(data));
  };

  const checkConnected = async _mnemonic => {
    let _access_token = await getStorage(Constants.STORAGE.access_token);
    setConnected(Boolean(_access_token));
    if (_access_token) {
      //call verify api
      let res;
      try {
        res = await verifyAccessToken(_access_token);
        console.log('checkConnected', res?.data);
        if (!res.data?.error_code) {
          dispatchUser({
            connectedAuthServer: true,
          });
          _getTransition();
          // await setStorage(
          //   Constants.STORAGE.access_token,
          //   res?.data?.access_token,
          // );
        } else {
          throw new Error('Login session expired, please login again');
        }
      } catch (err) {
        dispatchUser({
          connectedAuthServer: false,
        });
        setOpenLogin(true);
        setError('Login session expired, please login again');
      }
      return;
    }
    if (!_mnemonic) {
      console.log('checkConnected2');
      setOpenLogin(true);
    }
  };
  const _getTransition = async () => {
    dispatch(documentsSliceActions.setFetchingDocuments({status: true}));
    try {
      let data = await getTransitions();
      dispatch(documentsSliceActions.fetchDocuments({data}));
    } catch (err) {
      console.log(err);
    }
    dispatch(documentsSliceActions.setFetchingDocuments({status: false}));
  };
  if (isInitData) {
    //render skeleton
    return null;
  }
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: {height: 66, paddingBottom: 6},
        }}>
        <Tab.Screen
          name="Home"
          component={HomeTab}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size, focused}) => {
              return (
                <MaterialCommunityIcons
                  name="home-outline"
                  size={30}
                  color={focused ? colors.primary[500] : color}
                />
              );
            },
          }}
        />
        {Constants.isManager(user.role) ? (
          <Tab.Screen
            name="Docs"
            component={Documents}
            options={{
              headerShown: true,
              tabBarLabel: 'Docs',
              title: 'All Requests',
              tabBarIcon: ({color, focused}) => (
                <MaterialCommunityIcons
                  name="file-outline"
                  size={30}
                  color={focused ? colors.primary[500] : color}
                />
              ),
            }}
          />
        ) : (
          <Tab.Screen
            name="Create"
            component={CreateDocument}
            options={{
              headerShown: false,
              tabBarLabel: '',
              tabBarButton: _props => (
                <TouchableOpacity
                  {..._props}
                  activeOpacity={1}
                  onPress={() => props.navigation.navigate('CreateDocument')}
                />
              ),
              tabBarIcon: _props => {
                return (
                  <Box {...styles.containerCreateButton}>
                    <Box {...styles.createButton}>
                      <MaterialCommunityIcons
                        name="file-plus-outline"
                        size={30}
                        color="white"
                      />
                    </Box>
                    <Box {...styles.createButtonBorderWrapper}>
                      <Box {...styles.border} />
                    </Box>
                  </Box>
                );
              },
            }}
          />
        )}
        <Tab.Screen
          name="Gallery"
          component={Gallery}
          options={{
            headerShown: true,
            tabBarLabel: 'Gallery',
            tabBarIcon: ({color, focused}) => (
              <MaterialCommunityIcons
                name="folder-outline"
                size={30}
                color={focused ? colors.primary[500] : color}
              />
            ),
          }}
        />
      </Tab.Navigator>
      <ModalSeed seed={mnemonic} open={open} handleClose={handleClose} />
      <LoginSheet
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        error={error}
      />
    </>
  );
}
