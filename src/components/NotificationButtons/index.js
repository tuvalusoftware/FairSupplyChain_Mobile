import React from 'react';
import {Box, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
export default function NotificationButton() {
  let navigation = useNavigation();
  const notifications = useShallowEqualSelector(state => state.notifications);
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
      <Box position="relative" mr="10px" h="50px" justifyContent="center">
        <MaterialCommunityIcons name="bell" size={30} />
        <Box
          bgColor="white"
          position="absolute"
          top="2px"
          right="-10px"
          borderRadius="30px"
          w="24px"
          h="24px"
          p="0px"
          alignItems="center"
          justifyContent="center">
          <Box
            bgColor="yellow.600"
            position="absolute"
            borderRadius="30px"
            w="20px"
            h="20px"
            p="0px"
            alignItems="center"
            justifyContent="center">
            <Text bold color="white" fontSize={12}>
              {notifications?.data.length}
            </Text>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
