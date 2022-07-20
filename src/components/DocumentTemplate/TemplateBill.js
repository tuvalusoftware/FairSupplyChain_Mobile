/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Text} from 'native-base';
export default function Index(props) {
  const {data} = props.document;
  let {name} = data;
  return (
    <Box>
      <Text>Certificate of Analysis (COA)</Text>
      <Text>Issued in: GHANA</Text>
      <Text>Certificate No: 111</Text>
    </Box>
  );
}
