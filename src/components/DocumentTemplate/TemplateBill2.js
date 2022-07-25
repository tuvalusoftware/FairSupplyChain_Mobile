/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Text, Image, HStack, VStack} from 'native-base';
import logo from '../../images/nlogo.png';
import signImage from '../../images/signImage.png';

function Row({children, ...orther}) {
  return (
    <HStack {...orther} borderBottomColor="#00000052" borderBottomWidth="1px">
      {children}
    </HStack>
  );
}
function Col({children, ...orther}) {
  return (
    <VStack {...orther} borderRightColor="#00000052" borderRightWidth="1px">
      <Text p="2px" textAlign="center">
        {' '}
        {children}
      </Text>
    </VStack>
  );
}
export default function Index(props) {
  const {data} = props.document;
  // let {name} = data;
  return (
    <Box w="full" bg="white" p="12px">
      <Image source={logo} w="full" h="50px" alt="tmp" />
      <Text textAlign="center" bold fontSize="18px">
        Certificate of Analysis (COA)
      </Text>
      <Text textAlign="center">Issued in: GHANA</Text>
      <Text textAlign="center" mb="22px">
        Certificate No: 111
      </Text>
      <Text bold mb="12px">
        Farmer's name, address and country:
      </Text>
      <Text>{data.nameAddressCountry.farmerName}</Text>
      <Text>{data.nameAddressCountry.address}</Text>
      <Text>{data.nameAddressCountry.countryName}</Text>
      <Text>{data.nameAddressCountry.zipCode}</Text>
      <Text bold mt="12px" mb="12px">
        Analysis Results
      </Text>
      <Box borderWidth="1px" borderColor="#00000052">
        <Row>
          <Col width="40%">Item</Col>
          <Col width="30%">Standard</Col>
          <Col width="30%">Result</Col>
        </Row>
        <Row width="full">
          <Col width="40%">CuSO4.5H2O</Col>
          <Col width="30%">98% min</Col>
          <Col width="30%">{data.analysisResults.CuSO45H2O}%</Col>
        </Row>
        <Row width="full">
          <Col width="40%">Cu</Col>
          <Col width="30%">25% min</Col>
          <Col width="30%">{data.analysisResults.Cu}%</Col>
        </Row>
        <Row width="full">
          <Col width="40%">Pb</Col>
          <Col width="30%">10 ppm max</Col>
          <Col width="30%">{data.analysisResults.Pb}ppm</Col>
        </Row>
        <Row width="full">
          <Col width="40%">As</Col>
          <Col width="30%">4ppm max</Col>
          <Col width="30%">{data.analysisResults.As}ppm</Col>
        </Row>
        <Row width="full">
          <Col width="40%">Water insoluble Matter</Col>
          <Col width="30%">0.2% max</Col>
          <Col width="30%">{data.analysisResults.water}%</Col>
        </Row>
      </Box>
      <Image source={signImage} alt="sign" h="120px" w="full" mt="22px" />
    </Box>
  );
}
