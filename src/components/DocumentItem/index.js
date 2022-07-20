import React from 'react';
import {Box, Image, Text, Flex} from 'native-base';
import styles from './styles';
import moment from 'moment';
import ButtonLink from '../ButtonLink';
import {TouchableOpacity} from 'react-native';
import DocumentStatus from '../DocumentStatus';
import DocumentTemplate from '../DocumentTemplate';
export default function DocumentItem(props) {
  const {assetId, data} = props.document;
  const navigation = props.navigation;
  console.log(data.name);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DocumentDetail', {id: assetId})}>
      <Box {...styles.container}>
        <DocumentTemplate document={props.document} />
      </Box>
    </TouchableOpacity>
  );
}
