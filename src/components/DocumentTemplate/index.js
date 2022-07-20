/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import {Box, Text} from 'native-base';
import TemplateBill from './TemplateBill';
import TemplateBill2 from './TemplateBill2';
import {VALID_DOCUMENT_NAME_TYPE} from '../../libs/fuixlabs-documentor/constants/type';
export default function Index(props) {
  const {data} = props.document;
  let {name} = data;
  switch (name) {
    case VALID_DOCUMENT_NAME_TYPE[0].name:
      return <TemplateBill document={props.document} />;
    case VALID_DOCUMENT_NAME_TYPE[3].name:
      return <TemplateBill2 document={props.document} />;
    default:
      return null;
  }
}
