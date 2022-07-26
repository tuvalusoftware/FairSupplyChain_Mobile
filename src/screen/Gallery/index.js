/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Box, Spinner, Flex, Icon, Input, ScrollView} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants, {getStorage} from '../../util/Constants';
import {searchTransition} from '../../util/script';
import ListDocument from '../../components/ListDocument';
const _contentContainerStyle = {flexGrow: 1};
// const items = ['All documents', 'Certificate of Analysis (COA)'];
let timeout = null;
export default function Index(props) {
  const [isFetching, setFetching] = useState(false);
  const [filter, filterChange] = useState('');
  const [documents, setDocuments] = useState([]);
  const setFilter = e => {
    filterChange(e);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => getDocs(e), 1500);
  };
  const getDocs = async e => {
    if (!e) {
      return;
    }
    setFetching(true);
    try {
      let access_token = await getStorage(Constants.STORAGE.access_token);
      let data = await searchTransition(e, 1, access_token);
      if (data) {
        setDocuments(data);
      }
      setFetching(false);
    } catch (err) {
      setFetching(false);
    }
  };
  return (
    <>
      <Box flex={1} px="12px" bg="white" pt="12px">
        <Input
          InputLeftElement={
            <Icon
              as={<MaterialCommunityIcons name="magnify" />}
              size={5}
              ml="2"
              // color="muted.400"
            />
          }
          InputRightElement={
            filter ? (
              <TouchableOpacity
                onPress={() => {
                  setFilter(null);
                  setDocuments([]);
                }}>
                <Icon
                  as={<MaterialCommunityIcons name="close" />}
                  size={5}
                  mr="2"
                  // color="muted.400"
                />
              </TouchableOpacity>
            ) : (
              ''
            )
          }
          onChangeText={setFilter}
          value={filter}
          placeholder="Find docs…"
          borderWidth="0px"
          bg="#F5F5F5"
          isDisabled={isFetching}
          mb="12px"
        />
        {/* <Box mt="12px">
        <Select
          selectedValue={category}
          onValueChange={itemValue => setCategory(itemValue)}
          borderWidth="0"
          pl="0"
          fontWeight="bold">
          {items.map((item, index) => {
            return <Select.Item key={index} label={item} value={item} />;
          })}
        </Select>
      </Box> */}
        <ScrollView flex={1} _contentContainerStyle={_contentContainerStyle}>
          <ListDocument
            documents={documents}
            navigation={props.navigation}
            hideSort={true}
            hideTitle={true}
          />
        </ScrollView>
      </Box>
      {isFetching && (
        <Flex
          height="full"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          w="full">
          <Spinner color="cyan.500" size="lg" />
        </Flex>
      )}
    </>
  );
}
