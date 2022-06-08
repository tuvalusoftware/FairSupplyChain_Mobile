import React from 'react';
import {Box, Flex, Text, useTheme} from 'native-base';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonLink from '../../components/ButtonLink';
import {logout} from '../../redux/actions/user';
import Clipboard from '@react-native-community/clipboard';
import {useDispatch} from 'react-redux';
export default function Index(props) {
  const user = useShallowEqualSelector(state => state.user);
  const {colors} = useTheme();
  const [off, setOff] = React.useState(true);
  const dispatch = useDispatch();
  let navigation = props.navigation;
  const compact = string => {
    // if (string?.length > 30) {
    //   return (
    //     string.substring(0, 15) +
    //     '...' +
    //     string.substring(string.length - 15, string.length)
    //   );
    // }
    return string;
  };
  const copyToClipboard = () => {
    Clipboard.setString(user.userInfo.privateKey);
  };

  const _logout = () => {
    dispatch(logout());
    navigation.navigate('Welcome');
  };
  return (
    <Box>
      <Box bg="white" h="130px" mb="12px" p="12px" mt="8px">
        <Flex direction="row" justifyContent="space-between">
          <Text bold>Private Key</Text>
          <ButtonLink
            onPress={copyToClipboard}
            text={
              <>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={16}
                  color={colors.primary[500]}
                />
                copy
              </>
            }
          />
        </Flex>
        <Flex direction="row" alignItems="center" mt="12px">
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
          <Text mr="12px" flex={1}>
            {off ? '**************' : compact(user.userInfo.privateKey)}
          </Text>
          <TouchableOpacity onPress={() => setOff(!off)}>
            <MaterialCommunityIcons name={off ? 'eye-off' : 'eye'} size={16} />
          </TouchableOpacity>
        </Flex>
      </Box>
      <TouchableOpacity>
        <Box
          w="full"
          bg="white"
          h="50px"
          alignItems="center"
          pl="12px"
          flexDirection="row"
          mb="22px">
          <MaterialCommunityIcons
            name="help-circle"
            size={30}
            color={'#E6A70D'}
          />
          <Text ml="4px">See how to protect your Private key</Text>
        </Box>
      </TouchableOpacity>

      <TouchableOpacity onPress={_logout}>
        <Box
          w="full"
          bg="white"
          h="50px"
          alignItems="center"
          justifyContent="center"
          flexDirection="row">
          <MaterialCommunityIcons
            name="logout"
            size={30}
            color={colors.primary[500]}
          />
          <Text ml="4px" color="primary.500">
            Log Out
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}
