/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Text, HStack, VStack} from 'native-base';
import logo from '../../images/nlogo.png';

function Row({children, ...orther}) {
  return <HStack {...orther}>{children}</HStack>;
}
function Col({children, ...orther}) {
  return (
    <VStack {...orther}>
      <Text p="2px" textAlign="center">
        {' '}
        {children}
      </Text>
    </VStack>
  );
}
export default function Index(props) {
  const {data} = props.document;
  let {name} = data;
  return (
    <Box>
      <Text>Certificate of Analysis (COA)</Text>
      <Text>Issued in: GHANA</Text>
      <Text>Certificate No: 111</Text>
      <Text>Farmer's name, address and country:</Text>
      <Text>{data.nameAddressCountry.farmerName}</Text>
      <Text>{data.nameAddressCountry.address}</Text>
      <Text>{data.nameAddressCountry.countryName}</Text>
      <Text>{data.nameAddressCountry.zipCode}</Text>
      <Text>Analysis Results</Text>
      <Box>
        <Row>
          <Col width="40%">Item</Col>
          <Col width="30%">Standard</Col>
          <Col width="30%">Result</Col>
        </Row>
        <Row width="full">
          <Col width="40%">CuSO4.5H2O</Col>
          <Col width="30%">98% min</Col>
          <Col width="30%">{data.analysisResults.cuSO4}%</Col>
        </Row>
        <Row width="full">
          <Col width="40%">Cu</Col>
          <Col width="30%">25% min</Col>
          <Col width="30%">{data.analysisResults.cu}%</Col>
        </Row>
        <Row width="full">
          <Col width="40%">Pb</Col>
          <Col width="30%">10 ppm max</Col>
          <Col width="30%">{data.analysisResults.pb}ppm</Col>
        </Row>
        <Row width="full">
          <Col width="40%">As</Col>
          <Col width="30%">4ppm max</Col>
          <Col width="30%">{data.analysisResults.as}ppm</Col>
        </Row>
        <Row width="full">
          <Col width="40%">Water insoluble Matter</Col>
          <Col width="30%">0.2% max</Col>
          <Col width="30%">{data.analysisResults.water}%</Col>
        </Row>
      </Box>
    </Box>
  );
}
