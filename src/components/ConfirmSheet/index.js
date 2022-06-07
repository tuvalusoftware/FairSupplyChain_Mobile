import React from 'react';
import {Box, Flex, Text, Actionsheet, useTheme, Button} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles/index.js';
export default function ConfirmSheet({
  isOpen,
  description,
  title,
  icon,
  onClose,
  onOk,
}) {
  console.log('type', typeof description);
  const {colors} = useTheme();
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {icon ? (
          <Box {...styles.icon}>
            <MaterialCommunityIcons
              name={icon}
              size={30}
              color={colors.primary[500]}
            />
          </Box>
        ) : (
          ''
        )}
        <Text bold>{title}</Text>
        {typeof description === 'string' ? (
          <Text px="30px" textAlign="center" mt="12px">
            {description}
          </Text>
        ) : (
          description && description()
        )}
        <Flex {...styles.footer}>
          <Button
            onPress={onClose}
            w="40%"
            mw="200px"
            h="50px"
            variant="outline">
            Cancel
          </Button>
          <Button w="55%" mw="300px" h="50px" onPress={onOk}>
            Confirm
          </Button>
        </Flex>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
