/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Box, Text, Flex, Image} from 'native-base';
import VerifiedDocs from './VerifiedDocs';
import ListDocument from '../../../components/ListDocument';
import verified from '../../../images/logo.png';
import verifying from '../../../images/total_verifying.png';
import AccountButton from '../../../components/AccountButton';
import NotificationButton from '../../../components/NotificationButtons';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import Constants from '../../../util/Constants';
import styles from '../../CreateDocument/styles';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';
export default function Home(props) {
  const {user, documents} = useShallowEqualSelector(state => ({
    documents: state.documents.data,
    user: state.user,
  }));
  const [countVerify, setCount] = useState([0, 0, 0]);
  useEffect(() => {
    let newCount = [0, 0, 0];
    documents.forEach(element => {
      if (element.status === 'Verified') {
        newCount[0]++;
      }
      if (element.status === 'Verifying') {
        newCount[1]++;
      }
      if (element.status === 'Rejected') {
        newCount[2]++;
      }
    });
    setCount(newCount);
  }, []);
  let lists = [
    {
      number: countVerify[0],
      styles: {w: Constants.isManager(user.role) ? '32%' : '48%'},
      logo: Constants.isManager(user.role) ? '' : verified,
      text: 'Verified' + (Constants.isManager(user.role) ? '' : 'Docs'),
    },
    {
      number: countVerify[1],
      styles: {
        bgColor: '#E09A0D',
        w: Constants.isManager(user.role) ? '32%' : '48%',
      },
      logo: Constants.isManager(user.role) ? '' : verifying,
      text: 'Verifying' + (Constants.isManager(user.role) ? '' : 'Docs'),
    },
  ];
  if (Constants.isManager(user.role)) {
    lists.push({
      number: countVerify[2],
      styles: {bgColor: '#274A54', w: '32%'},
      text: 'Rejected',
    });
  }

  const renderDocumentItem = (document, index) => {
    console.log(document);
    const {title, image, id, createAt} = document;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => props.navigation.navigate('DocumentDetail', {id})}>
        <Flex {...styles.fileUploaded} bg="white" key={index}>
          <Box {...styles.shadow} mr="12px">
            <Image source={image} alt={title} w="50px" h="55px" />
          </Box>
          <Box justifyContent="center" flex={1}>
            <Text bold>{title}</Text>
            <Text color="#00000073" fontSize="12px">
              Submitted at {moment(createAt).format('DD MMM YYYY')}
            </Text>
          </Box>

          <MaterialCommunityIcons
            name="open-in-new"
            size={20}
            color={'#2190DE'}
          />
        </Flex>
      </TouchableOpacity>
    );
  };
  return (
    <Box h="full" flexDirection="column">
      <Flex
        direction="row"
        bg="white"
        justifyContent="space-between"
        p="6px"
        px="16px">
        <AccountButton />
        {Constants.isManager(user.role) ? '' : <NotificationButton />}
      </Flex>
      <Flex direction="row" justifyContent="space-between" mb="20px" p="4">
        {lists.map((item, index) => {
          return <VerifiedDocs key={index} {...item} />;
        })}
      </Flex>
      <Box p="4" flex={1}>
        <ListDocument
          documents={documents}
          navigation={props.navigation}
          title={Constants.isManager(user.role) ? 'New Request' : ''}
          hideSort={true}
          renderItem={Constants.isManager(user.role) ? renderDocumentItem : ''}
          isManager={Constants.isManager(user.role)}
        />
      </Box>
    </Box>
  );
}
