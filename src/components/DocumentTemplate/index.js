/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React from 'react';
import TemplateBill from './TemplateBill';
import TemplateBill2 from './TemplateBill2';
import {VALID_DOCUMENT_NAME_TYPE} from '../../libs/fuixlabs-documentor/constants/type';
export default function Index(props) {
  let document = props.document;
  const {data} = document;
  let {name} = data;
  switch (name) {
    case VALID_DOCUMENT_NAME_TYPE[0].name:
      return <TemplateBill document={document} />;
    case VALID_DOCUMENT_NAME_TYPE[3].name:
      return <TemplateBill2 document={document} />;
    default:
      return null;
  }
}
