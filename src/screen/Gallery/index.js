/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Box, Select, Icon, Input, ScrollView} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const _contentContainerStyle = {flexGrow: 1};
const items = ['All documents', 'Certificate of Analysis (COA)'];
let timeout = null;
export default function Index(props) {
  const [category, setCategory] = useState(items[0]);
  const [filter, filterChange] = useState('');
  const setFilter = e => {
    filterChange(e);
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(getDocs, 1000);
  };
  const getDocs = () => {
    console.log('getDocs');
  };
  return (
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
            <TouchableOpacity onPress={() => setFilter('')}>
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
      />
      <Box mt="12px">
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
        {/* <Box/> */}
      </Box>
      <ScrollView flex={1} _contentContainerStyle={_contentContainerStyle}>
        <Box>Gallery List</Box>
      </ScrollView>
    </Box>
  );
}
