import React, {useEffect, useRef, useState} from 'react';
import {Box, Flex, Text, Switch, useTheme} from 'native-base';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonLink from '../../components/ButtonLink';
// import {logout} from '../../redux/actions/user';
import Clipboard from '@react-native-community/clipboard';
import {useDispatch} from 'react-redux';
import {userSliceActions} from '../../redux/reducer/user';
import {
  setNetwork,
  getNetwork,
  fetchPrice,
  getBalance,
} from '../../util/script';
import {NETWORK_ID, NODE} from '../../util/Constants';

export default function Index(props) {
  const user = useShallowEqualSelector(state => state.user);
  const _network = useShallowEqualSelector(state => state.user.network);
  const [status, setStatus] = useState(false);
  const {colors} = useTheme();
  const [price, setPrice] = useState(1);
  // const [off, setOff] = React.useState(true);
  const dispatch = useDispatch();
  let interval = '';
  // let navigation = props.navigation;
  const _setStatus = async () => {
    let network = await getNetwork();
    if (network.id === NETWORK_ID.mainnet) {
      return setStatus(false);
    }
    setStatus(true);
  };
  useEffect(() => {
    _setStatus();
    fetchBalance(_network);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_network]);
  const countEl = useRef(user);
  countEl.current = user;
  const fetchBalance = async network => {
    if (interval) {
      clearInterval(interval);
    }
    const _price = await fetchPrice();
    setPrice(_price);
    const asset = await getBalance();
    console.log('user.network', countEl.current.network, 'network', network);
    if (countEl.current.network !== network) {
      return;
    }
    dispatch(
      userSliceActions.setData({
        userInfo: {assets: [asset]},
      }),
    );
    interval = setTimeout(() => fetchBalance(network), 60000);
  };
  const onChangeNetwork = _status => {
    if (!_status) {
      dispatch(
        userSliceActions.setData({
          network: NETWORK_ID.mainnet,
        }),
      );
      setNetwork({
        id: NETWORK_ID.mainnet,
        node: NODE.mainnet,
      });
      return;
    }
    dispatch(
      userSliceActions.setData({
        network: NETWORK_ID.testnet,
      }),
    );
    setNetwork({
      id: NETWORK_ID.testnet,
      node: NODE.testnet,
    });
  };
  const compact = (string, length) => {
    if (string?.length > length) {
      return (
        string.substring(0, length / 2) +
        '...' +
        string.substring(string.length - length / 2, string.length)
      );
    }
    return string;
  };
  const copyToClipboard = text => {
    Clipboard.setString(text);
  };

  // const _logout = () => {
  //   dispatch(logout());
  //   navigation.navigate('Welcome');
  // };
  // console.log(user?.userInfo);
  let asset = user?.userInfo?.assets[0];
  return (
    <Box>
      {/* <Box bg="white" h="130px" mb="12px" p="12px" mt="8px">
        <Flex direction="row" justifyContent="space-between">
          <Text bold>Private Key</Text>
          <ButtonLink
            onPress={() => copyToClipboard(user.userInfo.privateKey)}
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
      </Box> */}
      <Flex bg="white" mb="12px" p="12px">
        <Text bold mb="12px">
          Network
        </Text>
        <Flex direction="row">
          <Text mr="8px">Mainnet</Text>
          <Switch
            size="md"
            onValueChange={onChangeNetwork}
            disabled //disabled switch
            value={status}
          />
          <Text ml="8px">Testnet</Text>
        </Flex>
      </Flex>
      <Flex bg="white" mb="12px" p="12px">
        <Flex direction="row" justifyContent="space-between">
          <Text bold mb="12px">
            Address
          </Text>
          <ButtonLink
            onPress={() => copyToClipboard(user.userInfo.paymentAddr)}
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
        <Text mr="8px">{compact(user.userInfo.paymentAddr, 45)}</Text>
      </Flex>
      <Flex bg="white" mb="12px" p="12px">
        <Text bold mb="12px">
          Balance
        </Text>
        <Flex direction="row" justifyContent="space-between">
          <Text mr="8px">
            {asset?.amount || 0} {asset?.unitName}
          </Text>
          <Text>{((asset?.amount || 0) * (price || 0)).toFixed(4)} $</Text>
        </Flex>
      </Flex>

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

      {/* <TouchableOpacity onPress={_logout}>
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
      </TouchableOpacity> */}
    </Box>
  );
}
