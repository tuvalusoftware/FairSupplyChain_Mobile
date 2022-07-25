/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Flex,
  Skeleton,
  // Image,
  // Button,
  // useDisclose,
  // TextArea,
} from 'native-base';
import {TouchableOpacity, ScrollView} from 'react-native';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import DocumentTemplate from '../../components/DocumentTemplate';
import {compact} from '../../util/script';
import {isCanTrade} from '../../util/Constants';
import {useTheme} from 'native-base';
import Constants, {getStorage} from '../../util/Constants';
import moment from 'moment';
import {getDidDocument} from '../../libs/fuixlabs-documentor/utils/document';

const _contentContainerStyle = {flexGrow: 1, backgroundColor: '#607077'};
export default function DocumentDetail(props) {
  const {colors} = useTheme();
  const [info, setInfo] = useState();
  const [requesting, setRequesting] = useState(true);
  let id = props.route.params.id;
  let navigation = props.navigation;
  const {document} = useShallowEqualSelector(state => ({
    document: state.documents.data.find(item => item.data.fileName === id),
  }));

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
  const {data, history} = document;
  const {name, issuers, fileName} = data;
  // const {policy} = mintingNFTConfig;
  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    setRequesting(true);
    let access_token = await getStorage(Constants.STORAGE.access_token);
    try {
      let didDoc = await getDidDocument(fileName, access_token);
      setInfo(didDoc.didDoc);
      // let res = await _pullNFTs(
      //   'resolver/nfts/',
      //   {policyId: policy.id},
      //   access_token,
      // );

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
  return (
    <Box {...styles.container}>
      <Flex {...styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <Text bold fontSize={18} ml="8px">
          {name}
        </Text>
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
