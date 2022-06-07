import React from 'react';
import {Box, Button} from 'native-base';
import Swiper from './Swiper';
export default function Index(props) {
  let navigation = props.navigation;
  const onPress = () => {
    navigation.navigate('Welcome');
  };
  return (
    <Box h="full" pb="4" px="4">
      <Swiper />
      <Button colorScheme="primary" p="4" onPress={onPress}>
        Get Started
      </Button>
    </Box>
  );
}
