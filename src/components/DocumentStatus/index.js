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
  Revoked: '#283646',
  Issued: 'green.500',
};
const icon = {
  Revoked: 'file-excel-outline',
  Issued: 'check-decagram',
};
export default function Index(props) {
  let {status, ...other} = props;
  return (
    <Box {...styles.status} {...other} bgColor={color[status]}>
      <Text color="white" bold mr="8px" fontSize={14}>
        {status}
      </Text>
      <MaterialCommunityIcons name={icon[status]} size={20} color={'#ffffff'} />
    </Box>
  );
}
