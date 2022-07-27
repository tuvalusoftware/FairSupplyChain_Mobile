/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, {useState} from 'react';
import {Box, Select, Text, Divider, Flex, Button} from 'native-base';
import {TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'native-base';
const ITEMS = ['Cardano Network'];
export default function Index(props) {
  const [network, setNetwork] = useState(ITEMS[0]);
  const {colors} = useTheme();
  return (
    <>
      <Box bg="white" p="12px">
        <Text>Verify Document on</Text>
        <Select
          selectedValue={network}
          minWidth="100px"
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
          bgColor="#F5F5F5"
          onValueChange={itemValue => setNetwork(itemValue)}>
          {ITEMS.map((item, index) => (
            <Select.Item key={index} label={item} value={item} />
          ))}
        </Select>
        <TouchableOpacity onPress={() => {}}>
          <Flex
            justifyContent="center"
            flexDirection="row"
            bg="#F5F5F5"
            mt="12px"
            borderRadius="4px"
            borderRightStyle="dotted"
            borderWidth="1px"
            borderColor="#00000026">
            <Box
              // bg={colors.blue[100]}
              w="56px"
              h="56px"
              borderRadius="28px"
              justifyContent="center"
              alignItems="center"
              mt="16px">
              <MaterialCommunityIcons
                name="cloud-upload"
                size={30}
                color={colors.primary[500]}
              />
            </Box>

            <Box flex={1} pr="22px" pl="12px" pt="26px" pb="32px">
              <Text>Tap to upload files</Text>
              <Text color="#00000073" fontSize={10}>
                Upload your (.fl) file to view its contents
              </Text>
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
              <Button color="primary" borderRadius="30px" mt="32px">
                Select Document
              </Button>
            </Box>
          </Flex>
        </TouchableOpacity>
      </Box>
      <Flex direction="row" bg="white" mt="12px" p="12px" w="full">
        <MaterialCommunityIcons
          size={30}
          name="lightbulb-multiple"
          color={colors.primary[500]}
        />
        <Box flex={1} px="12px" pb="12px">
          <Text>Note</Text>
          <Text>
            A document can only be successfully verified on the same network
            where the document was created in. If unsure, do check with the
            document issuer.
          </Text>
        </Box>
      </Flex>
    </>
  );
}
