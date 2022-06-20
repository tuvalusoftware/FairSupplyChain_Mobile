import React from 'react';
import {Flex, Avatar, Text, useTheme} from 'native-base';
import avatar from '../../images/avatar.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
export default function AccountButton() {
  let {colors} = useTheme();
  const user = useShallowEqualSelector(state => state.user);
  const connected = user.connectedAuthServer;
  return (
    <Flex h="full" direction="row" justifyContent="center" alignItems="center">
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
        {user.userInfo.name}
      </Text>
      <MaterialCommunityIcons
        name="check-decagram"
        size={30}
        color={connected ? colors.green[400] : colors.gray[400]}
      />
    </Flex>
  );
}
