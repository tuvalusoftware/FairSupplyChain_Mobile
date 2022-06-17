/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {Box, Center, TextArea, Text, Button} from 'native-base';
import styles from './styles/LoginPrivateKey';
import {TouchableOpacity} from 'react-native';
export default function Index(props) {
  const [privateKey, setPrivateKey] = useState('');
  const {onBack} = props;
  const onChangeText = e => {
    setPrivateKey(e);
  };

  return (
    <Box bg="white">
      <Text bold mb="12px">
        Seed phrase
      </Text>
      <TextArea
        bg="#F5F5F5"
        variant="filled"
        placeholder="Enter your seed phrase"
        onChangeText={onChangeText}
        value={privateKey}
        row={6}
      />
      <Button
        {...styles.button}
        isDisabled={!privateKey}
        onPress={() => props.login(privateKey)}>
        Import
      </Button>
      <Center {...styles.center}>
        <Text textAlign="center" mr="6px">
          Don’t remember seed phrase?
        </Text>
        <TouchableOpacity onPress={onBack}>
          <Text
            bold
            textAlign="center"
            color="black"
            display="flex"
            justifyContent="center"
            alignItems="center">
            Create new wallet
          </Text>
        </TouchableOpacity>
      </Center>
    </Box>
  );
}
