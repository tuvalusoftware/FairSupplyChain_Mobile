/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState, useEffect} from 'react';
import {
  Box,
  Select,
  Text,
  Divider,
  Flex,
  Button,
  useTheme,
  useDisclose,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {verifyWrappedDocument} from '../../libs/fuixlabs-documentor/verifyDocument';
import {useNavigation} from '@react-navigation/core';
import {deepUnsalt} from '../../libs/fuixlabs-documentor/utils/data';
import {getAddress, getHistory} from '../../util/script';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import Constants, {getStorage} from '../../util/Constants';
import LoginSheet from '../../components/LoginSheet';
const ITEMS = ['Cardano Network'];
function DocError() {
  return (
    <Flex
      justifyContent="center"
      flexDirection="row"
      bg="#EE42500D"
      mt="12px"
      borderRadius="4px"
      borderRightStyle="dotted"
      borderWidth="1px"
      borderColor="#BD2328">
      <Box
        // bg={colors.blue[100]}
        w="56px"
        h="56px"
        borderRadius="28px"
        justifyContent="center"
        alignItems="center"
        mt="16px">
        <MaterialCommunityIcons
          name="delete-variant"
          size={30}
          color={'#BD2328'}
        />
      </Box>

      <Box flex={1} pr="22px" pl="12px" pt="26px" pb="32px">
        <Text bold>This document is not valid</Text>
        <Text color="#00000073" fontSize={10}>
          This document is not valid. Please upload a valid document.
        </Text>
        <Box
          borderWidth="1px"
          borderColor="#BD2328"
          borderRadius="30px"
          variant="outline"
          mt="32px"
          h="45px"
          alignItems="center"
          justifyContent="center">
          <Text color="#BD2328" bold>
            Try another document
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
export default function Index(props) {
  const [network, setNetwork] = useState(ITEMS[0]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [docError, setDocError] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {isOpen, onClose, onOpen} = useDisclose();
  const connectedAuthServer = useShallowEqualSelector(
    state => state.user.connectedAuthServer,
  );

  useEffect(() => {
    setFile(null);
    setDocError(null);
    setError(null);
  }, []);
  const pickDocument = async () => {
    try {
      // console.log(await DocumentPicker.pickDirectory());
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setError(null);
      setDocError(null);
      if (res && res[0] && res[0].uri) {
        let endFile = res[0].name.split('.');
        if (endFile[endFile.length - 1] !== 'fl') {
          setError('Extension is not valid!');
          return;
        }
        setFile(res[0]);
      }
    } catch (e) {
      // error
      console.log('err', e);
    }
  };
  const verify = async () => {
    try {
      setIsRequesting(true);
      let data = await RNFS.readFile(file.uri);
      let address = await getAddress();
      data = JSON.parse(data);
      let access_token = await getStorage(Constants.STORAGE.access_token);
      await verifyWrappedDocument(data, address, 'cardano', access_token);
      let document = deepUnsalt(data);
      let {policy} = document.mintingNFTConfig;
      let history = await getHistory(policy?.id, access_token);
      document = {...document, history};
      navigation.navigate('DocumentDetail', {document});
    } catch (err) {
      if (err.error_code) {
        setDocError(true);
        setFile(null);
      }
      console.log('verify error', err);
    }
    setIsRequesting(false);
  };
  return (
    <>
      <Box bg="white" p="12px">
        <Text>Verify Document on</Text>
        <Select
          selectedValue={network}
          minWidth="100px"
          borderWidth={0}
          color="black"
          fontWeight="bold"
          _selectedItem={{
            bg: 'teal.600',
            _text: {
              color: 'white',
            },
          }}
          mt={1}
          bgColor="#F5F5F5"
          onValueChange={itemValue => setNetwork(itemValue)}>
          {ITEMS.map((item, index) => (
            <Select.Item key={index} label={item} value={item} />
          ))}
        </Select>
        <TouchableOpacity onPress={pickDocument} disabled={isRequesting}>
          {docError ? (
            <DocError />
          ) : (
            <Flex
              justifyContent="center"
              flexDirection="row"
              bg="#F5F5F5"
              mt="12px"
              borderRadius="4px"
              borderRightStyle="dotted"
              borderWidth="1px"
              borderColor="#00000026">
              <Box
                // bg={colors.blue[100]}
                w="56px"
                h="56px"
                borderRadius="28px"
                justifyContent="center"
                alignItems="center"
                mt="16px">
                <MaterialCommunityIcons
                  name="cloud-upload"
                  size={30}
                  color={colors.primary[500]}
                />
              </Box>
              <Box flex={1} pr="22px" pl="12px" pt="26px" pb="32px">
                <Text bold>{file?.name || 'Tap to upload files'}</Text>
                <Text color="#00000073" fontSize={10}>
                  Upload your (.fl) file to view its contents
                </Text>
                <Text color="red.500">{error}</Text>
                <Button
                  color="primary"
                  isDisabled={!file || isRequesting}
                  borderRadius="30px"
                  mt="32px"
                  onPress={connectedAuthServer ? verify : onOpen}
                  isLoading={isRequesting}
                  isLoadingText="Select Document">
                  Verify Document
                </Button>
              </Box>
            </Flex>
          )}
        </TouchableOpacity>
      </Box>
      <Flex direction="row" bg="white" mt="12px" p="12px" w="full">
        <MaterialCommunityIcons
          size={30}
          name="lightbulb-multiple"
          color={colors.primary[500]}
        />
        <Box flex={1} px="12px" pb="12px">
          <Text>Note</Text>
          <Text>
            A document can only be successfully verified on the same network
            where the document was created in. If unsure, do check with the
            document issuer.
          </Text>
        </Box>
      </Flex>
      <LoginSheet openLogin={isOpen} setOpenLogin={onClose} onLogin={verify} />
    </>
  );
}
