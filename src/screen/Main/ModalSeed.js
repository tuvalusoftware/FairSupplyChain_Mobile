/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {useTheme, Box, Button, Flex, Modal, Text} from 'native-base';
import ButtonLink from '../../components/ButtonLink';
import Clipboard from '@react-native-community/clipboard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Index(props) {
  const {open, handleClose} = props;
  const {colors} = useTheme();
  const copyToClipboard = text => {
    Clipboard.setString(text);
  };
  return (
    <Modal isOpen={open} onClose={handleClose} size={'lg'}>
      <Modal.Content>
        <Modal.Body>
          <Flex
            justifyContent="center"
            w="full"
            direction="row"
            mb="22px"
            mt="12px">
            <Box
              h="44px"
              w="44px"
              borderRadius="22px"
              bg="#2190DE34"
              justifyContent="center"
              alignItems="center"
              mr="12px">
              <MaterialCommunityIcons
                name="key"
                size={30}
                color={colors.primary[500]}
              />
            </Box>
          </Flex>
          <Text bold textAlign="center" mb="8px">
            Protect your Wallet
          </Text>

          <Text textAlign="center">
            This is the seed phase for your account. Anyone with your seed phase
            can fully control your account. Please protect your key by saving it
            in various places like on a piece of paper, password manager, and/or
            the cloud…
          </Text>

          <Flex
            direction="row"
            justifyContent="space-between"
            mt="22px"
            mb="12px">
            <Text bold mb="12px">
              Seed Phase
            </Text>
            <ButtonLink
              onPress={() => copyToClipboard(props.seed)}
              text={
                <>
                  <MaterialCommunityIcons
                    name="content-copy"
                    size={16}
                    color={colors.primary[500]}
                  />
                  Copy
                </>
              }
            />
          </Flex>
          <Box bg="#F5F5F5" w="full" p="8px" mb="32px">
            <Text>{props.seed}</Text>
          </Box>
          <Button
            colorScheme="primary"
            borderRadius="30px"
            mb="22px"
            onPress={() => {
              handleClose(false);
            }}>
            Done
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
