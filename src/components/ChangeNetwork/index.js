/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState, useEffect} from 'react';
import {Flex, Text, Radio, Stack} from 'native-base';
import {NETWORK_ID, NODE} from '../../util/Constants';
import {userSliceActions} from '../../redux/reducer/user';
import {useDispatch} from 'react-redux';
import {setNetwork, getNetwork} from '../../util/script';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
export default function Index({containerStyle, isRequesting, onChangeNetwork}) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(NETWORK_ID.mainnet);
  const _network = useShallowEqualSelector(state => state.user.network);
  const _setStatus = async () => {
    let network = await getNetwork();
    setStatus(network.id);
  };
  useEffect(() => {
    _setStatus();
  }, [_network]);
  const _onChangeNetwork = network => {
    if (onChangeNetwork) {
      onChangeNetwork();
    }
    if (network === NETWORK_ID.mainnet) {
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
  return (
    <Flex {...containerStyle}>
      <Text bold mb="12px">
        Network
      </Text>
      <Radio.Group
        onChange={_onChangeNetwork}
        value={status}
        isDisabled={isRequesting}>
        <Stack
          mt="12px"
          direction={{
            base: 'row',
            md: 'row',
          }}
          alignItems={{
            base: 'flex-start',
            md: 'center',
          }}
          space={12}
          w="75%"
          maxW="300px">
          <Radio isDisabled={isRequesting} value={NETWORK_ID.testnet}>
            Testnet
          </Radio>
          <Radio isDisabled={isRequesting} value={NETWORK_ID.mainnet}>
            Mainnet
          </Radio>
        </Stack>
      </Radio.Group>
    </Flex>
  );
}
