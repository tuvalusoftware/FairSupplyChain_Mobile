/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Image, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
const LISTS = [
  {
    icon: '',
    name: 'Nami Wallet',
  },
  {
    icon: '',
    name: 'MetaMask',
  },
  {
    icon: '',
    name: 'Yoroi Wallet',
  },
  {
    icon: '',
    name: 'WalletConnect',
  },
];
export default function Index(props) {
  return (
    <Box>
      <Text color="#77808B">Please select a wallet to connect</Text>
      {LISTS.map((item, index) => {
        return (
          <TouchableOpacity key={index}>
            <Box
              w="full"
              borderWidth="1px"
              borderColor="#2190DE"
              h="50px"
              borderRadius="8px"
              justifyContent="center"
              px="22px"
              mt="12px">
              <Image source={item.icon} alt={item.name} />
              <Text bold>{item.name}</Text>
            </Box>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
}
