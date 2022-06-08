import React, {useState, useEffect} from 'react';
import styles from './styles';
import {Button, Box, Center, Text, Image} from 'native-base';
import {Link} from '@react-navigation/native';
import logo from '../../images/logo.png';
import LoginPrivateKey from './LoginPrivatekey';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import LoginWallet from './LoginWallet';
import {generateMnemonic} from 'bip39';
import bip39 from 'react-native-bip39';
export default function Index(props) {
  let navigation = props.navigation;
  const [status, setStatus] = useState('');
  const onBack = () => setStatus('');
  const user = useShallowEqualSelector(state => {
    return state.user;
  });
  console.log(status);
  useEffect(() => {
    if (user.isLogged) {
      navigation.navigate('Main');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const createAccount = async () => {
    let mnemonic;
    try {
      mnemonic = await bip39.generateMnemonic(256); // default to 128
    } catch (e) {
      console.log(e);
    }
    console.log('account', mnemonic);
  };
  return (
    <Box p="4" h="full" bg="white">
      <Box h="30px">
        {status === 'wallet' ? (
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
        )}
      </Box>
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        keyboardVerticalOffset={-100}>
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
            {status === 'privateKey' ? <LoginPrivateKey onBack={onBack} /> : ''}
            {status === 'wallet' ? <LoginWallet /> : ''}
            {!status ? (
              <>
                <Button
                  {...styles.buttonEmail}
                  onPress={() => {
                    setStatus('wallet');
                  }}>
                  Connect with Wallet
                </Button>
                <Button
                  {...styles.buttonPhone}
                  onPress={() => setStatus('privateKey')}>
                  Login with Private key
                </Button>
                <Button
                  {...styles.buttonPhone}
                  variant="outline"
                  onPress={() => {
                    createAccount();
                  }}>
                  Sign up as New User
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
