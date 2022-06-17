import React, {useEffect, useRef, useState} from 'react';
import {Box, Flex, Text, Switch, useTheme} from 'native-base';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonLink from '../../components/ButtonLink';
import {logout} from '../../redux/actions/user';
import Clipboard from '@react-native-community/clipboard';
import {useDispatch} from 'react-redux';
import {userSliceActions} from '../../redux/reducer/user';
import EditModel from './EditDisplayName';
import styles from './styles';
import {
  setNetwork,
  getNetwork,
  // fetchPrice,
  getBalance,
} from '../../util/script';
import {NETWORK_ID, NODE} from '../../util/Constants';

const Row = ({data}) => {
  const {colors} = useTheme();
  return (
    <Flex direction="row" mt="12px">
      <Box {...styles.icon}>
        <MaterialCommunityIcons
          name={data.icon}
          size={30}
          color={colors.primary[500]}
        />
      </Box>
      <Box flex={1} mx="12px">
        <Text color="#000000A5">{data.title}</Text>
        {data.value.map((item, index) => (
          <Text bold key={index + item}>
            {item}
          </Text>
        ))}
      </Box>
      {data.button()}
    </Flex>
  );
};
const copyToClipboard = text => {
  Clipboard.setString(text);
};
const ButtonCopy = ({text}) => {
  const {colors} = useTheme();
  return (
    <ButtonLink
      onPress={() => copyToClipboard(text)}
      text={
        <>
          <MaterialCommunityIcons
            name="content-copy"
            size={16}
            color={colors.primary[500]}
          />
          {'  '}
          Copy
        </>
      }
    />
  );
};
const ButtonEdit = props => {
  const {colors} = useTheme();
  return (
    <ButtonLink
      onPress={() => props.onPress()}
      text={
        <>
          <MaterialCommunityIcons
            name="pen"
            size={16}
            color={colors.primary[500]}
          />
          {'  '}
          Edit
        </>
      }
    />
  );
};
export default function Index(props) {
  const user = useShallowEqualSelector(state => state.user);
  const _network = useShallowEqualSelector(state => state.user.network);
  const [status, setStatus] = useState(false);
  const {colors} = useTheme();
  // const [price, setPrice] = useState(1);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();
  let interval = '';
  let navigation = props.navigation;
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
    if (!user.isLogged) {
      return;
    }
    if (interval) {
      clearInterval(interval);
    }
    // const _price = await fetchPrice();
    // setPrice(_price);
    const asset = await getBalance();
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

  const _logout = () => {
    if (interval) {
      clearInterval(interval);
    }
    dispatch(logout());
    navigation.navigate('Home');
    navigation.navigate('Welcome');
  };
  let asset = user?.userInfo?.assets[0];
  const ROWS = [
    {
      title: 'Display Name',
      value: [user.userInfo.name],
      icon: 'account',
      button: () => <ButtonEdit onPress={() => setOpenEdit(true)} />,
    },
    {
      title: 'Address Wallet',
      icon: 'home-roof',
      value: [
        compact(user.userInfo.paymentAddr, 35),
        `${asset?.amount || 0} ${asset?.unitName}`,
      ],
      button: () => <ButtonCopy text={user.userInfo.paymentAddr} />,
    },
  ];
  return (
    <Box>
      <Flex bg="white" mb="12px" p="12px" mt="12px">
        <Text bold mb="12px" fontSize={16}>
          Wallet Info
        </Text>
        {ROWS.map((item, index) => (
          <Row key={index} data={item} />
        ))}
      </Flex>

      <Flex bg="white" mb="12px" p="12px" mt="12px">
        <Text bold mb="12px">
          Network
        </Text>
        <Flex direction="row">
          <Text mr="8px">Mainnet</Text>
          <Switch
            size="md"
            onValueChange={onChangeNetwork}
            // disabled //disabled switch
            value={status}
          />
          <Text ml="8px">Testnet</Text>
        </Flex>
      </Flex>

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
            Disconnect Wallet
          </Text>
        </Box>
      </TouchableOpacity>
      <EditModel
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        displayName={user.userInfo.name}
      />
    </Box>
  );
}
