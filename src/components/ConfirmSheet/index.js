import React from 'react';
import {
  Box,
  Flex,
  Text,
  Actionsheet,
  useTheme,
  Button,
  ScrollView,
  FormControl,
  Input,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles/index.js';
export default function ConfirmSheet({
  isOpen,
  description,
  title,
  icon,
  onClose,
  onOk,
  cancelLabel,
  okLabel,
  cancelStyle = {},
  okStyle = {},
  withPassword = false,
  onPasswordChange = () => {},
  error = '',
  isRequesting = false,
  value,
}) {
  const {colors} = useTheme();
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content px="22px">
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
        {withPassword ? (
          <Box width="full">
            <Text bold mt="12px" mb="12px">
              Password
            </Text>
            <ScrollView maxHeight="150px">
              <FormControl w="full" isInvalid={Boolean(error)}>
                <Input
                  onChangeText={onPasswordChange}
                  placeholder="Enter your password"
                  type="password"
                  w="full"
                  isDisabled={isRequesting}
                />
                <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
              </FormControl>
            </ScrollView>
          </Box>
        ) : (
          ''
        )}
        <Flex {...styles.footer}>
          <Button
            onPress={onClose}
            w="40%"
            mw="200px"
            h="50px"
            variant="outline"
            {...cancelStyle}>
            {cancelLabel || 'Cancel'}
          </Button>
          <Button
            w="55%"
            mw="300px"
            h="50px"
            colorScheme="primary"
            onPress={onOk}
            {...okStyle}>
            {okLabel || 'Confirm'}
          </Button>
        </Flex>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
