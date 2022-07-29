/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {Box, Text, Flex, Button} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'native-base';
import {useNavigation} from '@react-navigation/core';
import DocumentPicker from 'react-native-document-picker';
import Constants, {getStorage} from '../../util/Constants';
import {deepUnsalt} from '../../libs/fuixlabs-documentor/utils/data';
import RNFS from 'react-native-fs';
import {getHistory} from '../../util/script';
export default function Index(props) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [document, setDocument] = useState(null);

  const pickDocument = async () => {
    try {
      // console.log(await DocumentPicker.pickDirectory());
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setError(null);
      setDocument(null);
      setFile(null);
      console.log('res', res);
      if (res && res[0] && res[0].uri) {
        let endFile = res[0].name.split('.');
        if (endFile[endFile.length - 1] !== 'fl') {
          setError('Extension is not valid!');
          return;
        }
        setFile(res[0]);
        let data = await RNFS.readFile(res[0].uri);
        data = JSON.parse(data);
        let access_token = await getStorage(Constants.STORAGE.access_token);
        let _document = deepUnsalt(data);
        let {policy} = _document.mintingNFTConfig;
        let history = await getHistory(policy?.id, access_token);
        _document = {..._document, history};
        console.log('_document', _document);
        setDocument(_document);
      }
    } catch (e) {
      // error
      console.log('pickDocument', e);
    }
  };
  const selectDoc = () => {
    navigation.navigate('RevokeDocsReview', {document});
  };

  return (
    <Box bg="white" p="12px">
      <TouchableOpacity onPress={pickDocument}>
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
              Upload your configuration file to revoke document
            </Text>
            <Text color="red.500">{error}</Text>
            <Button
              onPress={selectDoc}
              color="primary"
              borderRadius="30px"
              mt="32px"
              isDisabled={!Boolean(document)}>
              Select Document
            </Button>
          </Box>
        </Flex>
      </TouchableOpacity>
      <Flex direction="row" mt="22px" justifyContent="center">
        <Text bold>Don’t have a config file? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateDocument')}>
          <Text color="primary.500">Create one</Text>
        </TouchableOpacity>
      </Flex>
    </Box>
  );
}
