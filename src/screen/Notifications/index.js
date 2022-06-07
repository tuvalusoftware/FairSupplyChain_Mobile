import React from 'react';
import {Box} from 'native-base';
import NotificationItem from '../../components/NotificationItem';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {ScrollView} from 'react-native';
const _contentContainerStyle = {flexGrow: 1};
export default function Notifications(props) {
  const notifications = useShallowEqualSelector(state => state.notifications);
  return (
    <Box h="full" px="12px">
      <ScrollView flex={1} _contentContainerStyle={_contentContainerStyle}>
        {notifications?.data.map((item, index) => {
          return <NotificationItem {...item} key={index} />;
        })}
      </ScrollView>
    </Box>
  );
}
