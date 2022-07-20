import React, {useState, useEffect} from 'react';
import ListDocument from '../../components/ListDocument';
import {Box, Flex, Text, useTheme} from 'native-base';
import Constants from '../../util/Constants';
import {TouchableOpacity} from 'react-native';
import {Dimensions} from 'react-native';
import {Animated} from 'react-native';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
export default function Documents(props) {
  const documents = useShallowEqualSelector(state => state.documents.data);
  const [data] = useState(documents);
  const [dataRender, setDataRender] = useState(documents);
  const [status, setStatus] = useState(Constants.STATUS[0]);

  useEffect(() => {
    let newData = data.filter(item => item.status === status);
    setDataRender(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, documents]);
  const onTabChange = _status => {
    setStatus(_status);
  };
  return (
    <Box h="full" bg="white">
      <Tabs onTabChange={onTabChange} tab={status} />
      <Box flex={1} px="12px">
        <ListDocument
          documents={dataRender}
          navigation={props.navigation}
          hideTitle={true}
        />
      </Box>
    </Box>
  );
}

const style = {flex: 1};
const tabs = 2;
function Tabs(props) {
  const windowWidth = Dimensions.get('window').width;
  const Left = [0, windowWidth / tabs];
  const [animation] = useState(new Animated.Value(0));
  const {colors} = useTheme();
  const _setIndex = index => {
    Animated.timing(animation, {
      toValue: Left[index],
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const animationStyle = {
    width: windowWidth / tabs,
    bottom: 0,
    height: 2,
    backgroundColor: colors.primary[500],
    position: 'absolute',
    transform: [
      {
        translateX: animation,
      },
    ],
  };
  return (
    <Flex
      direction="row"
      bg="#E9ECED"
      h="51px"
      justifyContent="space-between"
      alignItems="center">
      {Constants.STATUS.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              if (item === props.tab) {
                return;
              }
              _setIndex(index);
              props.onTabChange(item);
            }}
            key={index}
            style={style}>
            <Flex h="full" alignItems="center" justifyContent="center" w="100%">
              <Text bold color={props.tab === item ? 'primary.500' : 'black'}>
                {item}
              </Text>
            </Flex>
          </TouchableOpacity>
        );
      })}
      <Animated.View style={animationStyle} />
    </Flex>
  );
}
