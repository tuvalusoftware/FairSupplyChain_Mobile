/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
import Constants, {setStorage} from '../../util/Constants';
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
  console.log(text);
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
  const [openLogin, setOpenLogin] = useState(false);
  // const [price, setPrice] = useState(1);
  const [openEdit, setOpenEdit] = useState(false);
  const dispatch = useDispatch();
  // let interval = '';

  let navigation = props.navigation;

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
      button: () => {
        return <ButtonCopy text={user.userInfo.paymentAddr} />;
      },
    },
  ];
  const onChangeNetwork = () => {
    dispatch(
      userSliceActions.setData({
        connectedAuthServer: false,
      }),
    );
    setStorage(Constants.STORAGE.access_token, '');
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
      <Box py="8px" bg="white">
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Box
            w="full"
            bg="white"
            h="50px"
            alignItems="center"
            justifyContent="flex-start"
            flexDirection="row"
            px="22px">
            <MaterialCommunityIcons name="face-agent" size={30} />
            <Text ml="8px" color="black" flex={1}>
              About Fuixlabs Wallet
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={30} />
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={_logout}>
          <Box
            w="full"
            bg="white"
            h="50px"
            alignItems="center"
            justifyContent="flex-start"
            flexDirection="row"
            px="22px">
            <MaterialCommunityIcons name="logout" size={30} />
            <Text ml="8px" color="black">
              Disconnect
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
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
