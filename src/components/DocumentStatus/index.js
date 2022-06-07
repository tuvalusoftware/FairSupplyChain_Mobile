/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Text} from 'native-base';
import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const color = {
  Rejected: '#283646',
  Verifying: '#E6A70D',
  Verified: '#4EB87A',
};
export default function Index(props) {
  let {status, ...other} = props;
  return (
    <Box {...styles.status} {...other} bgColor={color[status]}>
      <Text color="white" bold mr="8px" fontSize={12}>
        {status}
      </Text>
      <MaterialCommunityIcons
        name="check-decagram"
        size={20}
        color={'#ffffff'}
      />
    </Box>
  );
}
