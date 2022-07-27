import React, {useState} from 'react';
import styles from './styles';
import {Button, Box, Center, Text, Image} from 'native-base';
import logo from '../../images/logo.png';
import LoginPrivateKey from './LoginPrivatekey';
import {ScrollView, KeyboardAvoidingView} from 'react-native';
import {createWallet, getCurrentAccount} from '../../util/script';
import bip39 from 'react-native-bip39';
import {useDispatch} from 'react-redux';
import AuthForm from './AuthForm';
import {userSliceActions} from '../../redux/reducer/user';

export default function Welcome(props) {
  let navigation = props.navigation;
  const dispatch = useDispatch();
  const [status, setStatus] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const onBack = () => setStatus('');
  const account = async (name, password) => {
    let _mnemonic = mnemonic;
    try {
      if (!_mnemonic) {
        _mnemonic = await bip39.generateMnemonic(256);
      }
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
    setMnemonic(_mnemonic);
    setStatus('authForm');
  };
  const importSeed = seed => {
    setMnemonic(seed);
    setTimeout(() => {
      setStatus('authForm');
    }, 500);
  };
  const _createWallet = (userName, password) => {
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
              Fuixlabs Wallet
            </Text>
          </Center>

          <Box pb="50">
            {status === 'privateKey' ? (
              <LoginPrivateKey onBack={onBack} login={importSeed} />
            ) : (
              ''
            )}
            {status === 'authForm' ? (
              <AuthForm createWallet={_createWallet} onBack={onBack} />
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
