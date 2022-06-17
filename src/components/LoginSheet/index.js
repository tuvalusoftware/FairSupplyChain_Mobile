/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, {useState} from 'react';
import {Box, Input, FormControl, Text} from 'native-base';
import Constants, {setStorage} from '../../util/Constants';

import ConfirmSheet from '../../components/ConfirmSheet';
import {
  getRandomNumber,
  signData,
  loginAuthServer,
  getAddress,
} from '../../util/script';
import {useDispatch} from 'react-redux';
import {userSliceActions} from '../../redux/reducer/user';
export default function LoginSheet({openLogin, setOpenLogin}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const dispatch = useDispatch();
  const onPasswordChange = text => {
    setPassword(text);
  };
  const dispatchUser = data => {
    dispatch(userSliceActions.setData(data));
  };

  const _getRandomNumber = async () => {
    try {
      let res = await getRandomNumber();
      let f_access_token = res?.data?.access_token || '';
      let data = f_access_token.split('.');
      data = data.length ? data[1] : '';
      data = Buffer.from(data, 'base64').toString('ascii');
      data = JSON.parse(data);
      return {dataRandomNumber: data.data, access_token: f_access_token};
    } catch (err) {
      console.log('_getRandomNumber error', err);
      throw new Error(err.message);
    }
  };
  const login = async () => {
    setIsRequesting(true);

    try {
      let {dataRandomNumber, access_token} = await _getRandomNumber();
      let address = await getAddress();
      let payload = Buffer.from(
        JSON.stringify(dataRandomNumber),
        'utf8',
      ).toString('hex');
      let _signData = await signData(address, payload, password, 0);
      let res = await loginAuthServer(
        {
          address,
          randomNumber: dataRandomNumber.randomNumber,
          timestamp: dataRandomNumber.timestamp,
          signedData: _signData,
          rememberMe: true,
        },
        access_token,
      );
      console.log('loginAuthServer', res.data);
      if (!res.data?.error_code) {
        await setStorage(
          Constants.STORAGE.access_token,
          res.data?.data?.access_token,
        );
        dispatchUser({
          connectedAuthServer: true,
        });
      }
    } catch (err) {
      setError('Incorrect password');
      console.log('login error', err);
    }
    setIsRequesting(false);
    setOpenLogin(false);
  };
  return (
    <ConfirmSheet
      isOpen={openLogin}
      onOk={login}
      onClose={setOpenLogin}
      title="Connect your Wallet"
      icon="arrange-send-to-back"
      cancelStyle={{
        borderRadius: '30px',
        isDisabled: isRequesting,
      }}
      okStyle={{
        borderRadius: '30px',
        isDisabled: isRequesting,
      }}
      okLabel="Login"
      description={() => {
        return (
          <Box mt="12px">
            <Text textAlign="center">
              All is almost done, please login to the system with your wallet to
              complete the connection process then you can create and verify the
              document.
            </Text>
            <Text bold mt="12px" mb="12px">
              Password
            </Text>
            <FormControl w="full" isInvalid={Boolean(error)}>
              <Input
                onChangeText={onPasswordChange}
                placeholder="Enter your password"
                type="password"
                w="full"
              />
              <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
            </FormControl>
          </Box>
        );
      }}
    />
  );
}
