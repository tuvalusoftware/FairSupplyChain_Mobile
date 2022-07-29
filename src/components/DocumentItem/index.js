import React from 'react';
import {Box, Image, Text} from 'native-base';
import styles from './styles';
import moment from 'moment';
// import ButtonLink from '../ButtonLink';
import {TouchableOpacity} from 'react-native';
import DocumentStatus from '../DocumentStatus';
import DocumentTemplate from '../DocumentTemplate';
import QRImage from '../../images/QRImage.png';
export default function DocumentItem(props) {
  const {data, history, status} = props.document;
  const navigation = props.navigation;
  const {name} = data;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('DocumentDetail', {document: props.document})
      }>
      <Box {...styles.container}>
        <DocumentStatus status={status} top="26px" />
        <Box h="310px" overflow="hidden" px="12px">
          <DocumentTemplate document={props.document} />
        </Box>
        <Box bg="#F4F4F4" h="75px" px="12px" pt="16px" flexDirection="row">
          <Box flex={1}>
            <Text bold>{name}</Text>
            <Text fontSize="12px" color="#00000073">
              Issued at {moment(history[0]).format('DD MMMM YYYY, hh:mm A')}
            </Text>
          </Box>
          <Image source={QRImage} alt="QR" h="50px" w="50px" />
        </Box>
      </Box>
    </TouchableOpacity>
  );
}
