import React from 'react';
import {Flex, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Index(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Flex direction="row" alignItems="center">
        <Text color="#2190DE">
          {props.text}{' '}
          {props.icon ? (
            <MaterialCommunityIcons
              name={props.icon}
              size={20}
              color="#2190DE"
            />
          ) : (
            ''
          )}
        </Text>
      </Flex>
    </TouchableOpacity>
  );
}
