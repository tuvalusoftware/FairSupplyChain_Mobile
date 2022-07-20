import React from 'react';
import {Flex, Avatar, Text, useTheme} from 'native-base';
import avatar from '../../images/avatar.png';
import {useNavigation} from '@react-navigation/core';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
export default function AccountButton() {
  let {colors} = useTheme();
  const user = useShallowEqualSelector(state => state.user);
  const connected = user.connectedAuthServer;
  const navigation = useNavigation();
  const compact = (string, lg = 20) => {
    if (string?.length > lg) {
      return (
        string.substring(0, lg / 2) +
        '...' +
        string.substring(string.length - lg / 2, string.length)
      );
    }
    return string;
  };
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <Flex
        h="60px"
        direction="row"
        justifyContent="center"
        alignItems="center">
        <Avatar
          bg="cyan.500"
          source={avatar}
          borderColor="primary.200"
          borderWidth={2}
          w="36px"
          h="36px">
          USER
        </Avatar>
        <Text bold fontSize={16} ml="6px" mr="6px">
          {compact(user.userInfo.name)}
        </Text>
        <MaterialCommunityIcons
          name="check-decagram"
          size={30}
          color={connected ? colors.green[400] : colors.gray[400]}
        />
      </Flex>
    </TouchableOpacity>
  );
}
