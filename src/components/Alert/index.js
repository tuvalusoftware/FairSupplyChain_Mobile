/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {useTheme, Box, Button, Flex, Modal, Text} from 'native-base';
export default function Index({title, message, buttons, isOpen, onClose}) {
  const {colors} = useTheme();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
      <Modal.Content>
        <Modal.Body p="22px">
          <Text bold fontSize="21px">
            {title}
          </Text>
          <Text mt="12px">{message}</Text>
          <Flex direction="row" justifyContent="space-between" mt="22px">
            {buttons.map(({text, ...orther}) => {
              return (
                <Button borderRadius="40px" {...orther}>
                  {text}
                </Button>
              );
            })}
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
