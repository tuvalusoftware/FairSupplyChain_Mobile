/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {Box, Center, Text, Input, Button} from 'native-base';
import styles from './styles/LoginPrivateKey';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {userSliceActions} from '../../redux/reducer/user';
export default function Index(props) {
  const [privateKey, setPrivateKey] = useState('');
  const {onBack} = props;
  const dispatch = useDispatch();
  let navigation = useNavigation();
  const onChangeText = e => {
    setPrivateKey(e);
  };
  const login = () => {
    dispatch(
      userSliceActions.setData({
        isLogged: true,
        role: 3,
        userInfo: {privateKey, id: 'User1234'},
      }),
    );
    navigation.navigate('Main');
    onBack();
  };
  return (
    <Box bg="white">
      <Text bold mb="12px">
        Private Key
      </Text>
      <Input
        bg="#F5F5F5"
        variant="filled"
        placeholder="Enter Private Key"
        onChangeText={onChangeText}
        value={privateKey}
      />
      <Button {...styles.button} isDisabled={!privateKey} onPress={login}>
        Login
      </Button>
      <Center {...styles.center}>
        <Text textAlign="center" mr="6px">
          Don’t remember your key?
        </Text>
        <TouchableOpacity onPress={onBack}>
          <Text
            bold
            textAlign="center"
            color="black"
            display="flex"
            justifyContent="center"
            alignItems="center">
            Sign up as New User
          </Text>
        </TouchableOpacity>
      </Center>
    </Box>
  );
}
