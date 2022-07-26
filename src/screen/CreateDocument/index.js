/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Box,
  Text,
  ScrollView,
  Button,
  useTheme,
  Flex,
  Select,
  Image,
  useDisclose,
  Input,
  Divider,
} from 'native-base';
import Constants from '../../util/Constants';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmSheet from './ConfirmSheet';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import styles from './styles';
import {createDocument} from '../../libs/fuixlabs-documentor';
import {getStorage} from '../../util/Constants';
import {signData, getAddress} from '../../util/script';
import LoginSheet from '../../components/LoginSheet';
const _contentContainerStyle = {flexGrow: 1};

export default function CreateDocument(props) {
  const navigation = props.navigation;
  const [type, setType] = useState('');
  const [issuer, setIssuer] = useState(Constants.LIST_ISSUER[0]);
  const [files, setFiles] = useState([]);
  const [data, setData] = useState({});
  const [password, setPassword] = useState('');
  const [isRequesting, setIsRequesting] = useState('');
  const [error, setError] = useState('');
  const {isOpen, onOpen, onClose} = useDisclose();
  const {settings, user} = useShallowEqualSelector(state => ({
    settings: state.settings,
    user: state.user,
  }));
  const connectedAuthServer = user.connectedAuthServer;
  const [openLogin, setOpenLogin] = useState(false);
  const {colors} = useTheme();
  const openCamera = async () => {
    try {
      const result = await launchCamera();
      if (result?.assets.length) {
        let _files = files.concat(result?.assets);
        setFiles(_files);
      }
    } catch (err) {}
  };
  const openPhotos = async () => {
    try {
      const result = await launchImageLibrary();
      if (result?.assets?.length) {
        let _files = files.concat(result?.assets);
        setFiles(_files);
      }
    } catch (err) {}
  };
  const remove = index => {
    let _files = files.filter((x, _index) => _index !== index);
    setFiles(_files);
  };
  const compact = string => {
    if (string?.length > 60) {
      return (
        string.substring(0, 30) +
        '...' +
        string.substring(string.length - 30, string.length)
      );
    }
    return string;
  };
  const disabled = () => {
    return !(type && issuer);
  };
  const onOk = async (_passwork = password) => {
    console.log(_passwork);
    setIsRequesting(true);
    let address = await getAddress();
    let _access_token = await getStorage(Constants.STORAGE.access_token);
    try {
      const {wrappedDocument} = await createDocument(
        '',
        [data],
        address,
        false,
        {},
        async (_address, payload) =>
          await signData(_address, payload, _passwork, 0),
        _access_token,
      );
      console.log('wrappedDocument', wrappedDocument);
      onClose();
      setIsRequesting(false);
      navigation.navigate('Main', {fetchNew: true});
    } catch (err) {
      console.log('Error', err);
      setError(err);
      setIsRequesting(false);
    }
  };
  const _onClose = () => {
    if (isRequesting) {
      return;
    }
    onClose();
    setError('');
    setPassword('');
  };
  const onPasswordChange = e => {
    setPassword(e);
    setError('');
  };
  const onChange = (text, key, parentKey) => {
    console.log(text, key, parentKey);
    let _data = {...data};
    if (parentKey) {
      _data[parentKey][key] = text;
    } else {
      _data[key] = text;
    }

    setData(_data);
  };

  const isHasAttachments = () => {
    return (
      settings &&
      settings.document &&
      settings.document?.typeDocument[type] &&
      settings.document?.typeDocument[type]?.forms &&
      settings.document?.typeDocument[type]?.forms[0].attachments
    );
  };
  const renderForm = (form, parentKey) => {
    if (!form) {
      return '';
    }
    let keys = Object.keys(form);
    return keys.map((key, index) => {
      // console.log('first,', parentKey, key);
      if (typeof form[key] === 'object') {
        // console.log('object');
        return (
          <Box mt="22px" key={key}>
            <Text bold fontSize={16} paddingLeft="8px">
              {Constants.FORM_LABEL[key] || key}
            </Text>
            {renderForm(form[key], key)}
          </Box>
        );
      }
      return (
        <Box key={key + parentKey} paddingLeft={parentKey ? '22px' : '8px'}>
          <Text mb="12px" mt="12px" bold>
            {Constants.FORM_LABEL[key] || key}
          </Text>
          <Input
            bg="#F5F5F5"
            onChangeText={e => onChange(e, key, parentKey)}
            value={form[key]}
            placeholder={'Enter ' + (Constants.FORM_LABEL[key] || key)}
            isDisabled={Constants.READ_ONLY_FIELD.includes(key)}
          />
        </Box>
      );
    });
  };
  if (!settings || !settings.document || !settings.document.typeDocument) {
    return null;
  }
  return (
    <Box h="full" mt="12px" pb="22px">
      <ScrollView flex={1} _contentContainerStyle={_contentContainerStyle}>
        <Box bg="white" p="12px">
          <SelectBox
            value={issuer}
            onChange={setIssuer}
            items={Constants.LIST_ISSUER}
            placeholder="Select an issuer"
            title={'Issued by'}
          />
          {settings.document?.typeDocument ? (
            <SelectBox
              value={type}
              onChange={e => {
                setType(e);
                setData({
                  ...settings.document?.typeDocument[e]?.forms[0]?.data,
                });
              }}
              items={Object.keys(settings.document?.typeDocument)}
              placeholder="Select type"
              title={'Type of Document'}
              style={{mt: '12px'}}
            />
          ) : (
            ''
          )}
        </Box>
        <Box bg="white" p="12px" mt="12px">
          <Text bold fontSize={16} mb="12px">
            Config Document
          </Text>
          {renderForm(data)}
          {isHasAttachments() ? (
            <>
              <Text mt="16px">Attachments</Text>
              <Flex bg="#F5F5F5" direction="row" p="12px" px="0px" mt="12px">
                <Box w="50px" alignItems="center">
                  <MaterialCommunityIcons
                    name="cloud-upload"
                    size={30}
                    color={colors.primary[500]}
                  />
                </Box>
                <Box flex={1} px="12px">
                  <TouchableOpacity onPress={openPhotos}>
                    <Flex {...styles.uploadFile}>
                      <Text bold>Tap to upload files</Text>
                      <Text {...styles.uploadFileText}>
                        Upload documents such as Certificate of Origin,
                        Certificate of Analysis, etc. Max. total file size: 5MB
                        (JPGs, JPEGs, and PNGs supported)
                      </Text>
                    </Flex>
                  </TouchableOpacity>
                  <Flex
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    mt="12px">
                    <Divider w="34%" bg="#00000019" />
                    <Text bold mx="22px">
                      Or
                    </Text>
                    <Divider w="34%" bg="#00000019" />
                  </Flex>
                  <Button
                    variant="outline"
                    mt="12px"
                    onPress={openCamera}
                    w="full">
                    <Flex direction="row" alignItems="center">
                      <MaterialCommunityIcons
                        name="camera-plus"
                        size={30}
                        color={colors.primary[500]}
                      />
                      <Text color="primary.500" ml="12px">
                        Take A Photo
                      </Text>
                    </Flex>
                  </Button>
                </Box>
              </Flex>
            </>
          ) : (
            ''
          )}
        </Box>
        {isHasAttachments() ? (
          <Box bg="white" p="12px" mt="12px" minH="100px">
            <Text bold>File to be uploaded:</Text>
            {files.length ? (
              files.map((item, index) => {
                return (
                  <Flex {...styles.fileUploaded} key={index}>
                    <Box
                      style={{
                        elevation: 4,
                        shadowColor: 'black',
                      }}
                      mr="12px">
                      <Image
                        source={{uri: item.uri}}
                        alt={item.fileName}
                        w="50px"
                        h="55px"
                      />
                    </Box>
                    <Box justifyContent="center" flex={1}>
                      <Text bold>{compact(item.fileName)}</Text>
                      <Text color="#0EC37D" fontSize="12px">
                        Ready for request{' '}
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color={'#0EC37D'}
                        />
                      </Text>
                    </Box>

                    <TouchableOpacity onPress={() => remove(index)}>
                      <Box {...styles.removeButton}>
                        <MaterialCommunityIcons
                          name="close"
                          size={20}
                          color={'black'}
                        />
                      </Box>
                    </TouchableOpacity>
                  </Flex>
                );
              })
            ) : (
              <Flex {...styles.notFound}>
                <MaterialCommunityIcons
                  name="file-search"
                  size={30}
                  color={colors.gray[300]}
                />
                <Text color="#00000073" mt="8px" fontSize={12}>
                  Data not found
                </Text>
              </Flex>
            )}
          </Box>
        ) : null}
        <Box p="12px" mt="20px">
          <Button
            {...styles.buttonVerify}
            isDisabled={disabled()}
            onPress={() =>
              connectedAuthServer ? onOpen(true) : setOpenLogin(true)
            }>
            Request to verify
          </Button>
        </Box>
      </ScrollView>
      <ConfirmSheet
        isOpen={isOpen}
        onClose={_onClose}
        onOk={onOk}
        withPassword={true}
        onPasswordChange={onPasswordChange}
        isRequesting={isRequesting}
        error={error}
        okStyle={{
          isDisabled: isRequesting || !password,
          isLoading: isRequesting,
          isLoadingText: 'Confirm',
        }}
        cancelStyle={{
          isDisabled: isRequesting,
        }}
      />
      <LoginSheet
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        onLogin={onOk}
        hideChangeNetwork
      />
    </Box>
  );
}

function SelectBox(props) {
  let style = props.style || {};

  return (
    <Box {...style}>
      <Text bold mb="8px">
        {props.title}
      </Text>
      <Select
        {...styles.select}
        selectedValue={props.value}
        accessibilityLabel={props.placeholder}
        placeholder={props.placeholder}
        onValueChange={itemValue => props.onChange(itemValue)}>
        {props.items.map((item, index) => {
          return <Select.Item key={index} label={item} value={item} />;
        })}
      </Select>
    </Box>
  );
}
