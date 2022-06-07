/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import document_1 from '../../images/document_1.png';
import document_2 from '../../images/document_2.png';
const MockData = {
  notifications: [
    {
      title: 'Certificate of Analysis (COA)',
      description:
        'Your Certificate of Analysis (COA) had been verified by Ghana Food & Drug',
      createAt: Date.now() - 99999999,
      documentId: '1',
    },
    {
      title: 'Certificate of Analysis (COA)',
      description:
        'Your Certificate of Analysis (COA) had been rejected by Ghana Food & Drug',
      createAt: Date.now() - 99999999,
      documentId: '3',
    },
  ],
  documents: [
    {
      image: document_1,
      title: 'Certificate of Analysis (COA)',
      createAt: Date.now(),
      description: '',
      owner: 'M. Aminiyan',
      nameFarm: 'Takoradi Agri Farm',
      address: '92 Nguyen Trai',
      status: 'Verified',
      verifiedAt: Date.now(),
      verifiedBy: 'Ghana Food & Drug',
      type: 'Certificate of Analysis (COA)',
      id: '1',
    },
    {
      image: document_2,
      title: 'Certificate of Soil Management',
      createAt: Date.now(),
      owner: 'M. Aminiyan',
      nameFarm: 'Takoradi Agri Farm',
      address: '92 Nguyen Trai',
      description: '',
      status: 'Verifying',
      verifiedAt: Date.now(),
      verifiedBy: 'Ghana Food & Drug',
      type: 'Certificate of Soil Management',
      id: '2',
    },
    {
      image: document_1,
      title: 'Certificate of Analysis (COA)',
      createAt: Date.now(),
      owner: 'M. Aminiyan',
      nameFarm: 'Takoradi Agri Farm',
      address: '92 Nguyen Trai',
      description: '',
      status: 'Rejected',
      verifiedAt: Date.now(),
      verifiedBy: 'Ghana Food & Drug',
      type: 'Certificate of Analysis (COA)',
      id: '3',
    },
    {
      image: document_2,
      title: 'Certificate of Soil Management',
      createAt: Date.now(),
      owner: 'M. Aminiyan',
      nameFarm: 'Takoradi Agri Farm',
      address: '92 Nguyen Trai',
      description: '',
      status: 'Verified',
      verifiedAt: Date.now(),
      verifiedBy: 'Ghana Food & Drug',
      type: 'Certificate of Soil Management',
      id: '4',
    },
  ],
  settings: {
    document: {
      typeDocument: {
        'Certificate of Analysis (COA)': [
          {
            key: 'owner',
            title: 'Name of owner',
          },
          {
            key: 'nameFarm',
            title: 'Name of farm',
          },
          {
            key: 'address',
            title: 'Address',
          },
        ],
        'Packing List': [
          {
            key: 'owner',
            title: 'Name of owner',
          },
          {
            key: 'nameFarm',
            title: 'Name of farm',
          },
          {
            key: 'address',
            title: 'Address',
          },
        ],
        'Certificate of Soil Management': [
          {
            key: 'owner',
            title: 'Name of owner',
          },
          {
            key: 'nameFarm',
            title: 'Name of farm',
          },
          {
            key: 'address',
            title: 'Address',
          },
        ],
      },
    },
  },
};
export default MockData;
