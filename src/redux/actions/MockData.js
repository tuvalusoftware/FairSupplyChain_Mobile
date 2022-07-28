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
      data: {
        name: 'Certificate of Analysis (COA)',
        title: 'Test Title By Caps2',
        remarks: 'Test Remarks By Caps',
        fileName: 'Certificate of Analysis (COA)',
        nameAddressCountry: {
          farmerName: 'John Doe',
          address: '10 Pasir Panjang Road #10-01 Mapletree Business City',
          countryName: 'Singapore',
          zipCode: '900000',
        },
        analysisResults: {
          cuSO4: '99.3',
          cu: '25.13',
          pb: '3.6',
          as: '2.3',
          water: '0.18',
        },
      },
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/BYR_color_wheel.svg/1024px-BYR_color_wheel.svg.png',
      attachments: false,
      extension: 'fl',
      style: {
        backgroundColor: '#ffffff',
        titleColor: '#000000',
        descriptionColor: '#ff0000',
      },
    },
    {
      data: {
        name: 'Bill of Landing',
        title: 'Test Title By Caps2',
        remarks: 'Test Remarks By Caps',
        fileName: 'Certificate of Analysis (COA)',
        shippingInformation: {
          title: 'Name & Address of Shipping Agent/Freight Forwarder',
          countryName: 'VIET NAM',
          stress: 'SG Freight',
          address: '101 ORCHARD ROAD',
        },
        customInformation: {
          title: 'Demo custom',
          additionalAddress: '55 Newton Road',
          telephoneNumber: '+84988888888',
        },
        declarationInformation: {
          title: 'Declaration by Shipping Agent/Freight Forwarder',
          declarationName: 'PETER LEE',
          designation: 'SHIPPING MANAGER',
          date: '12/07/2022',
        },
        certification: {
          title: 'Declaration by Shipping Agent/Freight Forwarder',
          certificationName: 'PETER LEE',
          designation: 'SHIPPING MANAGER',
          date: '12/07/2022',
        },
      },
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/BYR_color_wheel.svg/1024px-BYR_color_wheel.svg.png',
      attachments: true,
      extension: 'fl',
      style: {
        backgroundColor: '#ffffff',
        titleColor: '#000000',
        descriptionColor: '#ff0000',
      },
    },
  ],
  settings: {
    document: {
      typeDocument: {
        'Certificate of Analysis (COA)': {
          network: 'testnet',
          forms: [
            {
              data: {
                name: 'Certificate of Analysis (COA)',
                title: 'Test Title By Caps2',
                remarks: 'Test Remarks By Caps',
                fileName: 'Certificate of Analysis (COA)',
                nameAddressCountry: {
                  farmerName: 'John Doe',
                  address:
                    '10 Pasir Panjang Road #10-01 Mapletree Business City',
                  countryName: 'Singapore',
                  zipCode: '900000',
                },
                analysisResults: {
                  CuSO45H2O: '99.3',
                  Cu: '25.13',
                  Pb: '3.6',
                  As: '2.3',
                  water: '0.18',
                },
              },
              logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/BYR_color_wheel.svg/1024px-BYR_color_wheel.svg.png',
              attachments: false,
              extension: 'fl',
              style: {
                backgroundColor: '#ffffff',
                titleColor: '#000000',
                descriptionColor: '#ff0000',
              },
            },
          ],
        },
        //   'Certificate of Analysis (COA) 2': {
        //     network: 'testnet',
        //     forms: [
        //       {
        //         data: {
        //           name: 'Bill of Landing',
        //           title: 'Test Title By Caps2',
        //           remarks: 'Test Remarks By Caps',
        //           fileName: 'Certificate of Analysis (COA)',
        //           shippingInformation: {
        //             title: 'Name & Address of Shipping Agent/Freight Forwarder',
        //             countryName: 'VIET NAM',
        //             stress: 'SG Freight',
        //             address: '101 ORCHARD ROAD',
        //           },
        //           customInformation: {
        //             title: 'Demo custom',
        //             additionalAddress: '55 Newton Road',
        //             telephoneNumber: '+84988888888',
        //           },
        //           declarationInformation: {
        //             title: 'Declaration by Shipping Agent/Freight Forwarder',
        //             declarationName: 'PETER LEE',
        //             designation: 'SHIPPING MANAGER',
        //             date: '12/07/2022',
        //           },
        //           certification: {
        //             title: 'Declaration by Shipping Agent/Freight Forwarder',
        //             certificationName: 'PETER LEE',
        //             designation: 'SHIPPING MANAGER',
        //             date: '12/07/2022',
        //           },
        //         },
        //         logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/BYR_color_wheel.svg/1024px-BYR_color_wheel.svg.png',
        //         attachments: true,
        //         extension: 'fl',
        //         style: {
        //           backgroundColor: '#ffffff',
        //           titleColor: '#000000',
        //           descriptionColor: '#ff0000',
        //         },
        //       },
        //     ],
        //   },
      },
    },
  },
};
export default MockData;
