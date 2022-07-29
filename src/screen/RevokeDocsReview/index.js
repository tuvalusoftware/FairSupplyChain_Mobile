/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {Box, Button, useTheme, useDisclose} from 'native-base';
import DocumentDetail from '../DocumentDetail';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {revokeDocument} from '../../libs/fuixlabs-documentor';
import Constants, {getStorage} from '../../util/Constants';
import {useNavigation} from '@react-navigation/core';
import LoginSheet from '../../components/LoginSheet';
import {Alert, ScrollView} from 'react-native';
export default function Index(props) {
  const [isRequesting, setIsRequesting] = useState(false);
  const navigation = useNavigation();
  const {isOpen, onClose, onOpen} = useDisclose();
  const connectedAuthServer = useShallowEqualSelector(
    state => state.user.connectedAuthServer,
  );
  console.log('connectedAuthServer', connectedAuthServer);
  const revoke = async () => {
    try {
      setIsRequesting(true);
      let document = JSON.parse(JSON.stringify(props.route.params.document));
      delete document.history;
      // document = saltData(document);
      let {mintingNFTConfig} = document;
      let access_token = await getStorage(Constants.STORAGE.access_token);
      await revokeDocument(mintingNFTConfig, access_token);
      navigation.navigate('Main', {fetchNew: true});
      Alert.alert('Revoke Success!', 'Document is revoked!', [
        {
          text: '',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    } catch (err) {
      Alert.alert(
        'Revoke Failed!',
        'The uploaded document is invalid or might have been revoked already.',
        [
          {
            text: '',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
      );
      console.log('revoke error', err);
    }
    setIsRequesting(false);
  };
  return (
    <Box h="full" pb="80px">
      <DocumentDetail {...props} title="Revoke Document" />
      <Box
        bg="white"
        position="absolute"
        bottom="0px"
        w="full"
        h="80px"
        justifyContent="center"
        px="12px">
        <Button
          onPress={connectedAuthServer ? revoke : onOpen}
          h="50px"
          isDisabled={isRequesting}
          isLoading={isRequesting}
          isLoadingText="Revoke Document">
          Revoke Document
        </Button>
      </Box>
      <LoginSheet openLogin={isOpen} setOpenLogin={onClose} onLogin={revoke} />
    </Box>
  );
}
