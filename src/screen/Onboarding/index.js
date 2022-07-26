import React from 'react';
import {Box, Button} from 'native-base';
import Swiper from './Swiper';
export default function Index(props) {
  const onPress = () => {
    props.start();
  };
  return (
    <Box h="full" pb="4" px="4" bg="white">
      <Swiper />
      <Button colorScheme="primary" p="4" onPress={onPress}>
        Get Started
      </Button>
    </Box>
  );
}
