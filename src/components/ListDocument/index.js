/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Box, Text, ScrollView, Flex, useTheme, Select} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentItem from '../DocumentItem';
import ButtonLink from '../ButtonLink';
const _contentContainerStyle = {flexGrow: 1};
export default function ListDocument(props) {
  const {colors} = useTheme();
  const [data, setData] = useState(props.documents);
  let [sort, setSort] = useState('newest');
  let navigation = props.navigation;
  const Newest = (a, b) => a.createAt - b.createAt;
  const Oldest = (a, b) => b.createAt - a.createAt;
  const {title, hideSort, renderItem} = props;
  useEffect(() => {
    let _document = JSON.parse(JSON.stringify(props.documents));
    let newData = _document.sort(sort === 'newest' ? Newest : Oldest);
    setData(newData);
  }, [props.documents, sort]);
  return (
    <Box flex={1}>
      {props.hideTitle ? (
        ' '
      ) : (
        <Flex direction="row" justifyContent="space-between">
          <Text color="#1D1D1D" bold fontSize={21}>
            {title ? title : 'All Docs'}
          </Text>
          <ButtonLink
            text="See all"
            icon="open-in-new"
            onPress={() =>
              navigation.navigate(props.isManager ? 'Docs' : 'Documents')
            }
          />
        </Flex>
      )}
      {data.length && !hideSort ? (
        <Flex direction="row" alignItems="center">
          <Text mr="12px" color="rgba(119, 128, 139, 1)">
            Sort by:
          </Text>
          <Select
            selectedValue={sort}
            minWidth="60px"
            borderWidth={0}
            color="black"
            fontWeight="bold"
            _selectedItem={{
              bg: 'teal.600',
              _text: {
                color: 'white',
              },
            }}
            mt={1}
            onValueChange={itemValue => setSort(itemValue)}>
            <Select.Item label="Newest" value="newest" />
            <Select.Item label="Oldest" value="oldest" />
          </Select>
        </Flex>
      ) : (
        ''
      )}
      <ScrollView flex={1} _contentContainerStyle={_contentContainerStyle}>
        {data.length ? (
          data.map((item, index) =>
            renderItem ? (
              renderItem(item, index)
            ) : (
              <DocumentItem
                key={index}
                document={item}
                navigation={props.navigation}
              />
            ),
          )
        ) : (
          <Flex
            flex={1}
            alignItems="center"
            justifyContent="center"
            direction="column"
            style={{
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
            }}>
            <MaterialCommunityIcons
              name="file-search"
              size={40}
              color={colors.primary[500]}
            />
            <Text color="#00000073" mt="8px" fontSize={12}>
              No Document found
            </Text>
          </Flex>
        )}
      </ScrollView>
    </Box>
  );
}
