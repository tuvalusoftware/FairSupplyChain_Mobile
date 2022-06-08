import React from 'react';
import {Box, Flex, Image, Text} from 'native-base';

export default function VerifiedDocs(props) {
  let styles = {
    h: '117px',
    w: '48%',
    bgColor: '#4EB87A',
    borderRadius: '8px',
    p: 4,
  };
  return (
    <Box {...styles} {...props.styles}>
      <Flex direction="row" flex={1}>
        <Text flex={1} bold fontSize={38} color="white">
          {props.number}
        </Text>
        {props.logo ? (
          <Image source={props.logo} alt="logo" w="69px" h="57px" />
        ) : (
          ''
        )}
      </Flex>
      <Text color="white" bold>
        {props.text}
      </Text>
    </Box>
  );
}
