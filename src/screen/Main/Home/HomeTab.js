import React, {useState} from 'react';
import {Box, Text, Flex, Image, useTheme} from 'native-base';
import ListDocument from '../../../components/ListDocument';
import AccountButton from '../../../components/AccountButton';
import NotificationButton from '../../../components/NotificationButtons';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import Constants from '../../../util/Constants';
import styles from '../../CreateDocument/styles';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';
import NotConnectServerForm from './NotConnectServerForm';
import LoginSheet from '../../../components/LoginSheet';
import {getTransitions} from '../../../util/script';
import {useDispatch} from 'react-redux';
import {documentsSliceActions} from '../../../redux/reducer/documents';
export default function Home(props) {
  const [openLogin, setOpenLogin] = useState(false);
  const {user, documents, isFetching} = useShallowEqualSelector(state => ({
    documents: state.documents.data,
    user: state.user,
    isFetching: state.documents.isFetching,
  }));
  const dispatch = useDispatch();
  const connectedAuthServer = user?.connectedAuthServer;
  // const [countVerify, setCount] = useState([0, 0, 0]);
  const {colors} = useTheme();
  // useEffect(() => {
  //   let newCount = [0, 0, 0];
  //   documents.forEach(element => {
  //     if (element.status === 'Verified') {
  //       newCount[0]++;
  //     }
  //     if (element.status === 'Verifying') {
  //       newCount[1]++;
  //     }
  //     if (element.status === 'Rejected') {
  //       newCount[2]++;
  //     }
  //   });
  //   setCount(newCount);
  // }, []);
  // let lists = [
  //   {
  //     number: countVerify[0],
  //     styles: {w: Constants.isManager(user.role) ? '32%' : '48%'},
  //     logo: Constants.isManager(user.role) ? '' : verified,
  //     text: 'Verified' + (Constants.isManager(user.role) ? '' : 'Docs'),
  //   },
  //   {
  //     number: countVerify[1],
  //     styles: {
  //       bgColor: '#E09A0D',
  //       w: Constants.isManager(user.role) ? '32%' : '48%',
  //     },
  //     logo: Constants.isManager(user.role) ? '' : verifying,
  //     text: 'Verifying' + (Constants.isManager(user.role) ? '' : 'Docs'),
  //   },
  // ];
  // if (Constants.isManager(user.role)) {
  //   lists.push({
  //     number: countVerify[2],
  //     styles: {bgColor: '#274A54', w: '32%'},
  //     text: 'Rejected',
  //   });
  // }

  const onRefresh = async () => {
    let data = await getTransitions();
    dispatch(documentsSliceActions.fetchDocuments({data}));
  };
  const renderDocumentItem = (document, index) => {
    console.log(document);
    const {title, image, id, createAt} = document;

    const primary = colors.primary[500];
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
            color={primary}
          />
        </Flex>
      </TouchableOpacity>
    );
  };
  console.log(isFetching);
  return (
    <Box h="full" flexDirection="column">
      <Flex
        direction="row"
        bg="white"
        justifyContent="space-between"
        // p="6px"
        px="16px"
        mb="22px">
        <AccountButton />
        {Constants.isManager(user.role) ? '' : <NotificationButton />}
      </Flex>
      {/* <Flex direction="row" justifyContent="space-between" mb="20px" p="4">
        {lists.map((item, index) => {
          return <VerifiedDocs key={index} {...item} />;
        })}
      </Flex> */}
      <Box px="4" flex={1}>
        {connectedAuthServer ? (
          <ListDocument
            documents={documents}
            navigation={props.navigation}
            title={Constants.isManager(user.role) ? 'New Request' : ''}
            hideSort={true}
            renderItem={
              Constants.isManager(user.role) ? renderDocumentItem : ''
            }
            isManager={Constants.isManager(user.role)}
            isFetching={isFetching}
            onRefresh={onRefresh}
          />
        ) : (
          <NotConnectServerForm setOpenLogin={setOpenLogin} />
        )}
      </Box>
      <LoginSheet openLogin={openLogin} setOpenLogin={setOpenLogin} />
    </Box>
  );
}
