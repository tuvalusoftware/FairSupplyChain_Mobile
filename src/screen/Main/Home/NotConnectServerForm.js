/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Flex, Button, Text, useTheme} from 'native-base';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Index(props) {
  console.log('render NoConnectServerForm');
  const {colors} = useTheme();
  const open = () => {
    props.setOpenLogin(true);
  };

  return (
    <Flex alignItems="center" px="22px">
      <Box {...styles.icon}>
        <MaterialCommunityIcons
          name={'arrange-send-to-back'}
          size={30}
          color={colors.primary[500]}
        />
      </Box>
      <Text bold mb="12px" fontSize={16}>
        Please connect your wallet
      </Text>
      <Text mb="22px" textAlign="center">
        All is almost done, please login to the system with your wallet to
        complete the connection process then you can create and verify the
        document.
      </Text>
      <Button w="200px" borderRadius="30px" onPress={open}>
        Login
      </Button>
    </Flex>
  );
}
