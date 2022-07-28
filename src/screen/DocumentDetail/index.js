/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {Box, Text, Flex, Skeleton} from 'native-base';
import {TouchableOpacity, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import DocumentTemplate from '../../components/DocumentTemplate';
import {compact} from '../../util/script';
import {isCanTrade} from '../../util/Constants';
import {useTheme} from 'native-base';
import Constants, {getStorage} from '../../util/Constants';
import moment from 'moment';
import {getDidDocument} from '../../libs/fuixlabs-documentor/utils/document';
import RNFS from 'react-native-fs';
import {saltData} from '../../libs/fuixlabs-documentor/utils/data';
import {Platform} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {PermissionsAndroid} from 'react-native';
const _contentContainerStyle = {flexGrow: 1, backgroundColor: '#607077'};
export default function DocumentDetail(props) {
  const {colors} = useTheme();
  const [info, setInfo] = useState();
  const [requesting, setRequesting] = useState(true);
  let navigation = props.navigation;
  let document = {};
  if (props.route.params.document) {
    document = props.route.params.document;
  }
  const requestCameraPermission = async () => {
    console.log(PermissionsAndroid.PERMISSIONS);
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const renderAsset = () => {
    if (!isCanTrade(name)) {
      return null;
    }
    return (
      <Box {...styles.box}>
        <Text {...styles.title}>Assets</Text>
        <Box
          bg={colors.blue[500]}
          w="130px"
          alignItems="center"
          justifyContent="center"
          borderRadius="12px"
          height="24px">
          <Text bold color="white">
            TRANSFERABLE
          </Text>
        </Box>
      </Box>
    );
  };
  const {data, history = []} = document;
  const {name, issuers, fileName, companyName} = data;
  // const {policy} = mintingNFTConfig;
  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    setRequesting(true);
    let access_token = await getStorage(Constants.STORAGE.access_token);
    try {
      let didDoc = await getDidDocument(fileName, access_token, companyName);
      setInfo(didDoc.didDoc);
      // console.log(companyName);
      // let res = await _pullNFTs(
      //   'resolver/nfts/',
      //   {policyId: policy.id},
      //   access_token,
      // );
      // console.log('res', res.data);
      // let _history = res.data.data.map((item, index) => {
      //   return item?.onchainMetadata[policy.id][item.assetName]?.timestamp;
      // });
      // _history.sort((a, b) => a - b);
      // setHistory(_history);
    } catch (err) {
      console.log('getHistory', err);
    }
    setRequesting(false);
  };
  const download = async () => {
    try {
      await requestCameraPermission();
      let _name = (Math.random() + 1).toString(36).substring(7);
      // let dir = await DocumentPicker.pickDirectory();
      // console.log(dir.uri);
      let path =
        `content://com.android.providers.downloads.documents/document/` +
        `${_name}.fl`;
      // `content://com.android.providers.downloads.documents/document` +
      // dir.uri + `/${_name}.fl`;
      console.log('path', 'path2', path);

      let _document = saltData(document);
      delete _document.history;
      await RNFS.writeFile(path, JSON.stringify(_document), 'utf8');
      console.log('FILE WRITTEN!');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box {...styles.container}>
      <Flex {...styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="black" />
        </TouchableOpacity>
        <Text bold fontSize={18} ml="8px" flex={1}>
          {name}
        </Text>
        {/* <TouchableOpacity onPress={download}>
          <MaterialCommunityIcons
            name="tray-arrow-down"
            size={28}
            color="black"
          />
        </TouchableOpacity> */}
      </Flex>
      <Box flex={1} bg="#607077" p="12px">
        <ScrollView flex={1} _contentContainerStyle={_contentContainerStyle}>
          <DocumentTemplate document={document} />

          <Text color="white" mt="22px" fontSize="20px" bold>
            Certificate Details
          </Text>
          <Box {...styles.box}>
            <Text {...styles.title}>Issued by</Text>
            <Text bold>{compact(issuers[0]?.address, 20)}</Text>
          </Box>
          {renderAsset()}
          {requesting && !info ? (
            <Skeleton borderRadius="8px" mt="16px" h="75px" />
          ) : (
            <Box {...styles.box}>
              <Text {...styles.title}>Owner</Text>
              <Text bold>{compact(info?.owner, 20, 'end')}</Text>
            </Box>
          )}
          {requesting && !info ? (
            <Skeleton borderRadius="8px" mt="16px" h="75px" />
          ) : (
            <Box {...styles.box}>
              <Text {...styles.title}>Holder</Text>
              <Text bold>{compact(info?.holder, 20, 'end')}</Text>
            </Box>
          )}

          <Text color="white" mt="22px" fontSize="20px" bold>
            History
          </Text>
          {requesting && !history.length ? (
            <Skeleton borderRadius="8px" mt="16px" h="75px" />
          ) : null}
          {history.map((item, index) => {
            return (
              <Box {...styles.box} key={index}>
                <Text {...styles.title}>
                  {index === 0
                    ? 'Document has been issued'
                    : 'Document has been updated'}
                </Text>
                <Text bold>{moment(item).format('DD MMMM YYYY, hh:mm A')}</Text>
              </Box>
            );
          })}
        </ScrollView>
      </Box>
    </Box>
  );
}
