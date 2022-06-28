import React, {useState} from 'react';
import styles from './styles';
import {Button, Box, Center, Text, Image} from 'native-base';
// import {Link} from '@react-navigation/native';
import logo from '../../images/logo.png';
import LoginPrivateKey from './LoginPrivatekey';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {ScrollView, KeyboardAvoidingView} from 'react-native';
import {createWallet, getCurrentAccount} from '../../util/script';
import bip39 from 'react-native-bip39';
// import * as HaskellShelley from '../../libs/HaskellShelley';
// import * as CardanoMessageSigning from '../../libs/CardanoMessageSigning';
import {useDispatch} from 'react-redux';
import Constants, {getStorage} from '../../util/Constants';
import AuthForm from './AuthForm';
import {userSliceActions} from '../../redux/reducer/user';
const STORAGE = Constants.STORAGE;

export default function Welcome(props) {
  let navigation = props.navigation;
  const dispatch = useDispatch();
  const [status, setStatus] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const onBack = () => setStatus('');
  const account = async (name, password) => {
    const checkStore = await getStorage(STORAGE.encryptedKey);
    console.log('checkStore', checkStore);
    let _mnemonic = mnemonic;
    try {
      if (!_mnemonic) {
        _mnemonic = await bip39.generateMnemonic(256);
      }
      console.log('_mnemonic', _mnemonic);
      let success = await createWallet(name, _mnemonic, password);
      if (success) {
        navigation.navigate('Main', {mnemonic: _mnemonic});
        try {
          let _account = await getCurrentAccount();
          if (_account) {
            dispatch(
              userSliceActions.setData({
                userInfo: _account,
                isLogged: true,
              }),
            );
            setStatus('');
          }
        } catch (err) {
          console.log('account Error', err);
        }
      }
    } catch (e) {
      console.log('account error', e);
    }
  };
  const initMnemonic = async () => {
    let _mnemonic = await bip39.generateMnemonic(256);
    console.log('initMnemonic', _mnemonic);
    setMnemonic(_mnemonic);
    setStatus('authForm');
  };
  const importSeed = seed => {
    console.log('importSeed', seed);
    setMnemonic(seed);
    setTimeout(() => {
      setStatus('authForm');
    }, 500);
  };
  const _createWallet = (userName, password) => {
    console.log('_createWallet');
    account(userName, password);
  };
  return (
    <Box p="4" h="full" bg="white">
      <Box h="30px">
        {/* {status === 'wallet' ? (
          <TouchableOpacity
            onPress={() => {
              setStatus('');
            }}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        ) : (
          ''
        )} */}
      </Box>
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={-400}
        keyboardShouldPersistTaps="always">
        <ScrollView h="full">
          <Center flex={1} minH="300px">
            <Image source={logo} alt="logo" w="170" h="170px" />
            <Text fontSize={16} bold>
              Welcome to
            </Text>
            <Text bold fontSize={32}>
              Fair Supply Chain
            </Text>
          </Center>

          <Box pb="50">
            {status === 'privateKey' ? (
              <LoginPrivateKey onBack={onBack} login={importSeed} />
            ) : (
              ''
            )}
            {status === 'authForm' ? (
              <AuthForm createWallet={_createWallet} />
            ) : (
              ''
            )}
            {!status ? (
              <>
                <Button
                  {...styles.buttonPhone}
                  onPress={() => {
                    initMnemonic();
                  }}>
                  Create new wallet
                </Button>
                <Button
                  {...styles.buttonPhone}
                  variant="outline"
                  onPress={() => setStatus('privateKey')}>
                  Import wallet
                </Button>
              </>
            ) : (
              ''
            )}
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
