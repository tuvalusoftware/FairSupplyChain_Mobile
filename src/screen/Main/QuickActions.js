/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Flex, Box, Text, Actionsheet} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/core';
import {useTheme} from 'native-base';
function Button({icon, text, onClick, style = {}}) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}>
      <Box alignItems="center" {...style}>
        <Box
          bg={colors.blue[100]}
          w="56px"
          h="56px"
          borderRadius="28px"
          justifyContent="center"
          alignItems="center">
          <MaterialCommunityIcons
            name={icon}
            size={30}
            color={colors.blue[500]}
          />
        </Box>
        <Text bold>{text}</Text>
      </Box>
    </TouchableOpacity>
  );
}
export default function Index({isOpen, onClose}) {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const Buttons = [
    {
      icon: 'file-outline',
      onClick: () => {
        navigation.navigate('CreateDocument');
        onClose();
      },
      text: 'Create Doc',
    },
    {
      icon: 'file-check-outline',
      onClick: () => {
        navigation.navigate('VerifyDoc');
        onClose();
      },
      text: 'Verify Doc',
    },
    {
      icon: 'file-excel-outline',
      onClick: () => {
        navigation.navigate('RevokeDoc');
        onClose();
      },
      text: 'Revoke Doc',
    },
  ];
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Box w="full">
          <Text bold px="12px" mb="22px">
            Quick actions
          </Text>
          <Flex
            direction="row"
            flexWrap="wrap"
            justifyContent="space-around"
            borderBottomColor="#E9ECED"
            borderBottomWidth="1px"
            px="12px"
            pb="20px">
            {Buttons.map((item, index) => (
              <Button {...item} key={index} onClose={onClose} />
            ))}
          </Flex>
          <Box alignItems="center" p="12px">
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}>
              <Box alignItems="center" w="56px">
                <Box
                  bg={colors.blue[500]}
                  w="56px"
                  h="56px"
                  borderRadius="28px"
                  justifyContent="center"
                  alignItems="center">
                  <MaterialCommunityIcons
                    name={'close'}
                    size={30}
                    color={'white'}
                  />
                </Box>
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
