/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {Box, Text, Divider, Flex, Button} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'native-base';
export default function Index(props) {
  const {colors} = useTheme();
  return (
    <Box bg="white" p="12px">
      <TouchableOpacity onPress={() => {}}>
        <Flex
          justifyContent="center"
          flexDirection="row"
          bg="#F5F5F5"
          mt="12px"
          borderRadius="4px"
          borderRightStyle="dotted"
          borderWidth="1px"
          borderColor="#00000026">
          <Box
            // bg={colors.blue[100]}
            w="56px"
            h="56px"
            borderRadius="28px"
            justifyContent="center"
            alignItems="center"
            mt="16px">
            <MaterialCommunityIcons
              name="cloud-upload"
              size={30}
              color={colors.primary[500]}
            />
          </Box>

          <Box flex={1} pr="22px" pl="12px" pt="26px" pb="32px">
            <Text bold>Tap to upload files</Text>
            <Text color="#00000073" fontSize={10}>
              Upload your configuration file to revoke document
            </Text>
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="center"
              mt="12px">
              <Divider w="34%" bg="#00000019" />
              <Text bold mx="22px">
                Or
              </Text>
              <Divider w="34%" bg="#00000019" />
            </Flex>
            <Button color="primary" borderRadius="30px" mt="32px">
              Select Document
            </Button>
          </Box>
        </Flex>
      </TouchableOpacity>
      <Flex direction="row" mt="22px" justifyContent="center">
        <Text bold>Don’t have a config file? </Text>
        <TouchableOpacity>
          <Text color="primary.500">Learn how to create one</Text>
        </TouchableOpacity>
      </Flex>
    </Box>
  );
}
