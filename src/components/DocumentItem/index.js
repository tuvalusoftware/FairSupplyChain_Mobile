import React from 'react';
import {Box, Image, Text, Flex} from 'native-base';
import styles from './styles';
import moment from 'moment';
import ButtonLink from '../ButtonLink';
import {TouchableOpacity} from 'react-native';
import DocumentStatus from '../DocumentStatus';
export default function DocumentItem(props) {
  const {image, title, createAt, status, id} = props.document;
  const navigation = props.navigation;
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DocumentDetail', {id})}>
      <Box {...styles.container}>
        <Box {...styles.containerImage}>
          <Image {...styles.image} source={image} alt={title} />
        </Box>
        <Flex {...styles.footer} direction="row">
          <Box flex={1}>
            <Text bold>{title}</Text>
            <Text color="#00000073" fontSize={12}>
              Submitted at {moment(createAt).format('DD MMM YYYY')}
            </Text>
          </Box>
          {status === 'Rejected' ? (
            <Box justifyContent="center" w="80px">
              <ButtonLink
                text="See why"
                icon="open-in-new"
                onPress={() => console.log('see why')}
              />
            </Box>
          ) : (
            ''
          )}
        </Flex>
        <DocumentStatus status={status} mt="12px" />
      </Box>
    </TouchableOpacity>
  );
}
