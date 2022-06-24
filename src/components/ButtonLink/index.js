import React from 'react';
import {Flex, Text, useTheme} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Index(props) {
  const {colors} = useTheme();
  const primary = colors.primary[500];
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Flex direction="row" alignItems="center">
        <Text color={primary}>
          {props.text}{' '}
          {props.icon ? (
            <MaterialCommunityIcons
              name={props.icon}
              size={20}
              color={primary}
            />
          ) : (
            ''
          )}
        </Text>
      </Flex>
    </TouchableOpacity>
  );
}
