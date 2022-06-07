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

const _contentContainerStyle = {flexGrow: 1};
export default function CreateDocument(props) {
  const [type, setType] = useState('');
  const [issuer, setIssuer] = useState('');
  const [files, setFiles] = useState([]);
  const [data, setData] = useState({name: '', nameFarm: '', address: ''});
  const {isOpen, onOpen, onClose} = useDisclose();
  const settings = useShallowEqualSelector(state => state.settings);
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
    let _files = files.filter((x, _index) => _index != index);
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
    return !(type && issuer && files.length);
  };
  const onOk = () => {
    onClose();
  };
  const onChange = (text, key) => {
    let _data = {...data};
    _data[key] = text;
    setData(_data);
  };
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
              onChange={setType}
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
          {settings.document.typeDocument[type]?.map((item, index) => {
            return (
              <Box key={index}>
                <Text mb="12px" mt="12px">
                  {item.title}
                </Text>
                <Input
                  bg="#F5F5F5"
                  onChangeText={e => onChange(e, item.key)}
                  value={data[item.key]}
                  placeholder={'Enter ' + item.title}
                />
              </Box>
            );
          })}
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
                    Upload documents such as Certificate of Origin, Certificate
                    of Analysis, etc. Max. total file size: 5MB (JPGs, JPEGs,
                    and PNGs supported)
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
              <Button variant="outline" mt="12px" onPress={openCamera} w="full">
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
        </Box>
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
        <Box p="12px" mt="20px">
          <Button
            {...styles.buttonVerify}
            isDisabled={disabled()}
            onPress={onOpen}>
            Request to verify
          </Button>
        </Box>
      </ScrollView>
      <ConfirmSheet isOpen={isOpen} onClose={onClose} onOk={onOk} />
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
