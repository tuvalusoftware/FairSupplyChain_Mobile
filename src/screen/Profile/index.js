/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Box, Flex, Text, useTheme} from 'native-base';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonLink from '../../components/ButtonLink';
import {logout} from '../../redux/actions/user';
import Clipboard from '@react-native-community/clipboard';
import {useDispatch} from 'react-redux';
import {userSliceActions} from '../../redux/reducer/user';
import EditModel from './EditDisplayName';
import ChangeNetwork from '../../components/ChangeNetwork';
import styles from './styles';
import LoginSheet from '../../components/LoginSheet';
import {
  // fetchPrice,
  getBalance,
} from '../../util/script';
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
          <Text bold mt="4px" key={index + item}>
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
  const {colors} = useTheme();
  const [openLogin, setOpenLogin] = useState(false);
  // const [price, setPrice] = useState(1);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();
  // let interval = '';
  const [interval, setInterval] = useState('');
  let navigation = props.navigation;
  useEffect(() => {
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
      setInterval(null);
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
    let _interval = setTimeout(() => fetchBalance(network), 60000);
    setInterval(_interval);
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
  const onChangeNetwork = () => {
    setOpenLogin(true);
  };
  return (
    <Box>
      <Flex bg="white" mb="12px" p="18px" mt="12px">
        <Text bold mb="12px" fontSize={16}>
          Wallet Info
        </Text>
        {ROWS.map((item, index) => (
          <Row key={index} data={item} />
        ))}
      </Flex>

      <ChangeNetwork
        containerStyle={{
          bg: 'white',
          mb: '12px',
          p: '18px',
        }}
        onChangeNetwork={onChangeNetwork}
      />

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
            Disconnect
          </Text>
        </Box>
      </TouchableOpacity>
      <EditModel
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        displayName={user.userInfo.name}
      />
      <LoginSheet
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        hideChangeNetwork
        // error={error}
      />
    </Box>
  );
}
