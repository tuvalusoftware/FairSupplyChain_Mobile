/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {Box, Text, Center, Input, Button, FormControl} from 'native-base';
import {TouchableOpacity} from 'react-native';
export default function Index(props) {
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState({});
  const mb = '12px';
  const isDisabled = () => {
    return !(password && userName);
  };
  const create = () => {
    let _error = {...error},
      hasError = false;
    if (!userName.trim()) {
      _error.userName = 'Value invalid!';
      hasError = true;
    }
    if (password && password.length < 8) {
      _error.password = 'Password at least 8 characters!';
      hasError = true;
    }
    // if (password !== confirmPassword) {
    //   _error.confirmPassword = 'Confirm password is not same as password!';
    //   hasError = true;
    // }

    if (hasError) {
      return setError(_error);
    }
    props.createWallet(userName, password);
  };
  return (
    <Box>
      <Text bold mb={mb}>
        User name
      </Text>
      <FormControl mb={mb} isInvalid={Boolean(error.userName)}>
        <Input
          placeholder="Enter user name"
          value={userName}
          onChangeText={text => {
            setUserName(text);
            setError({...error, userName: ''});
          }}
        />
        <FormControl.ErrorMessage>{error.userName}</FormControl.ErrorMessage>
      </FormControl>

      <Text bold mb={mb}>
        Password
      </Text>
      <FormControl mb={mb} isInvalid={Boolean(error.password)}>
        <Input
          placeholder="Enter password"
          value={password}
          onChangeText={text => {
            setPassword(text);
            setError({...error, password: ''});
          }}
          type="password"
        />
        <FormControl.ErrorMessage>{error.password}</FormControl.ErrorMessage>
      </FormControl>
      {/* <Text bold mb={mb}>
        Confirm Password
      </Text> */}
      {/* <FormControl mb={mb} isInvalid={Boolean(error.confirmPassword)}>
        <Input
          placeholder="Enter confirm password"
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            setError({...error, confirmPassword: ''});
          }}
          type="password"
        />
        <FormControl.ErrorMessage>
          {error.confirmPassword}
        </FormControl.ErrorMessage>
      </FormControl> */}
      <Button mt="22px" h="50px" isDisabled={isDisabled()} onPress={create}>
        Create
      </Button>
      <Center flexDirection="row" mt="22px">
        <Text>Already have a seed phase?</Text>
        <TouchableOpacity onPress={props.onBack}>
          <Text
            bold
            textAlign="center"
            color="black"
            display="flex"
            justifyContent="center"
            alignItems="center"
            ml="4px">
            Import wallet
          </Text>
        </TouchableOpacity>
      </Center>
    </Box>
  );
}
