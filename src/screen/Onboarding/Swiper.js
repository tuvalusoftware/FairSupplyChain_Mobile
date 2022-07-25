import React from 'react';
import {Box, Center, Text, Image} from 'native-base';
import Swiper from 'react-native-swiper';
import step1 from '../../images/step1.png';
import step2 from '../../images/step2.png';
const items = [
  {
    title: 'Managing Trade Documents',
    description:
      'Implement democratic governance models for managing trade documents such as Certificate of Origin, Certificate of Analysis, etc',
    img: step1,
  },
  {
    title: 'Decentralized Identity For Smallholder Farmers',
    description:
      'This project will document a governance model for a last mile supply chain management system that is flexible enough to serve both local spot markets and wider markets.',
    img: step2,
  },
];
export default function SwiperComponent() {
  return (
    <Swiper showsPagination={true}>
      {items.map((item, index) => {
        return (
          <Center key={index} h="full" p="3">
            <Image source={item.img} alt="img" w="100%" h="300" />
            <Text fontSize={21} bold textAlign="center" w="300" color="black">
              {item.title}
            </Text>
            <Text textAlign="center" color="black">
              {item.description}
            </Text>
          </Center>
        );
      })}
    </Swiper>
  );
}
