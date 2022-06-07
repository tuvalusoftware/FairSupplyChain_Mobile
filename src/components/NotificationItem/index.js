/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Text, Flex} from 'native-base';
import {TouchableOpacity} from 'react-native';
import moment from 'moment';
import styles from './styles';
import {useNavigation} from '@react-navigation/core';
export default function Index(props) {
  let {title, description, createAt, documentId} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DocumentDetail', {id: documentId});
      }}>
      <Box {...styles.container}>
        <Flex {...styles.header}>
          <Text bold>{title}</Text>
          <Text>{moment(createAt).fromNow()}</Text>
        </Flex>
        <Text {...styles.description}>{description}</Text>
      </Box>
    </TouchableOpacity>
  );
}
