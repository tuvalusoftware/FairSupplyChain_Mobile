const Constants = {
  STATUS: ['Verified', 'Verifying', 'Rejected'],
  LIST_TYPE_DOCUMENT: [
    'Certificate of Analysis (COA)',
    'Packing List',
    'Certificate of Soil Management',
    'Certificate Of Organic Farming',
    'Certificate of Inspection',
    'Certificate of Origin',
    'Bill of Lading (BOL)',
    'Insurance Certificate Other',
  ],
  LIST_ISSUER: [
    'Ghana Food & Drug',
    'Ministry of Food & Agriculture',
    'Ghana Irrigation Development Authority (GIDA)',
    'Agricultural law in Ghana',
    'Other',
  ],
  isManager: role => role === 3,
};
export default Constants;
