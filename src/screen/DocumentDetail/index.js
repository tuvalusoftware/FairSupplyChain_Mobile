import React, {useState} from 'react';
import {
  Box,
  Text,
  Flex,
  Image,
  Button,
  useDisclose,
  TextArea,
} from 'native-base';
import {TouchableOpacity, ScrollView} from 'react-native';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentStatus from '../../components/DocumentStatus';
import moment from 'moment';
import styles from './styles';
import Constants from '../../util/Constants';
import ConfirmSheet from '../../components/ConfirmSheet';
const _contentContainerStyle = {flexGrow: 1};

export default function DocumentDetail(props) {
  let id = props.route.params.id;
  let navigation = props.navigation;
  const {isOpen, onClose, onOpen} = useDisclose();
  const [dataForSheet, setData] = useState({});
  const [message, setMassage] = useState('');
  const {document, settings, user} = useShallowEqualSelector(state => ({
    document: state.documents.data.find(item => item.id === id),
    settings: state.settings,
    user: state.user,
  }));
  const ready = () => {
    let _dataForSheet = {
      title: 'Are you sure to verify this document?',
      description:
        'If confirmed the application can send this document to public and finished the verification',
      type: 'ready',
      icon: 'send-clock',
    };
    setData(_dataForSheet);
    onOpen();
  };
  console.log(message);
  const reject = () => {
    let _dataForSheet = {
      title: 'Are you sure to reject this document?',
      description: () => {
        return (
          <Box w="full" p="12px">
            <Text mb="12px">Why was it rejected?</Text>
            <TextArea
              bg="#F5F5F5"
              variant="filled"
              placeholder="Message for user"
              // value={message}
              onChangeText={e => setMassage(e)}
            />
          </Box>
        );
      },
      type: 'reject',
      icon: 'send-clock',
    };
    setData(_dataForSheet);
    onOpen();
  };
  const onOk = () => {
    if (dataForSheet.type === 'ready') {
      handleClose();
      return console.log('accept');
    }
    handleClose();
    console.log('reject');
  };
  const handleClose = () => {
    setData({});
    onClose();
  };
  const {image, title, verifiedAt, verifiedBy, status, type} = document;
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
          {title}
        </Text>
      </Flex>
      <ScrollView flex={1} _contentContainerStyle={_contentContainerStyle}>
        <Box {...styles.image}>
          <Image source={image} alt={document.title} />
        </Box>
        <Flex px="12px" mt="8px">
          <Text bold> {title}</Text>
          <DocumentStatus status={status} mt="-4px" />
        </Flex>
        <Box {...styles.box}>
          <Text color="#00000073" fontSize={12}>
            {' '}
            Verified at {moment(verifiedAt).format(' DD MMM YYYY')}
          </Text>
          <Text bold>By {verifiedBy}</Text>
        </Box>
        {settings?.document?.typeDocument[type]?.map((item, index) => {
          return (
            <Box {...styles.box} key={index}>
              <Text color="#00000073" fontSize={12}>
                {item.title}
              </Text>
              <Text bold>{document[item.key]}</Text>
            </Box>
          );
        })}
      </ScrollView>
      {Constants.isManager(user.role) ? (
        <Flex
          direction="row"
          w="full"
          bg="white"
          h="88px"
          p="12px"
          justifyContent="space-between">
          <Button
            w="47%"
            h="50px"
            colorScheme="error"
            variant="outline"
            onPress={reject}>
            Reject
          </Button>
          <Button w="47%" h="50px" onPress={ready}>
            Ready For Public
          </Button>
        </Flex>
      ) : (
        ''
      )}
      <ConfirmSheet
        {...dataForSheet}
        isOpen={isOpen}
        onClose={handleClose}
        onOk={onOk}>
        {dataForSheet.type === 'reject' ? 'x' : ''}
      </ConfirmSheet>
    </Box>
  );
}
