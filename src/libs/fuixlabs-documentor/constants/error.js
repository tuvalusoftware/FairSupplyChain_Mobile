export const VERIFIER_ERROR_CODE = {
  MISSING_SIGNATURE: {
    error_code: 1001,
    msg: 'Missing signature! Please check your wrappedDocument',
  },
  INVALID_TARGET_HASH: {
    error_code: 1002,
    msg: 'The target-hash of your wrappedDocument is invalid!',
  },
  CANNOT_VERIFY_SIGNATURE: {
    error_code: 1003,
    msg: 'We cannot verify the signature of wrappedDocument now, Please try again later!',
  },
  INVALID_PARAMETER: {
    error_code: 1004,
    msg: 'Missing parameters! Please check your configuration!',
  },
  UNAUTHORIZED_DOCUMENT: {
    error_code: 1005,
    msg: 'This document is unauthorized!',
  },
  INVALID_SIGNATURE: {
    error_code: 1006,
    msg: 'The signature of your wrappedDocument is invalid!',
  },
  EXIST_FILE_NAME: {
    error_code: 1007,
    msg: 'Filename is existed!',
  },
  NOT_EXISTS_DID_DOCUMENT: {
    error_code: 1008,
    msg: 'Cannot get did document by did of wrapped document!',
  },
  MISSING_PARAMETERS: {
    error_code: 1009,
    msg: 'Missing parameters! Please check your configuration!',
  },
  SERVER_ERROR: {
    error_code: 1010,
    msg: 'There are some problems with our server! Please try again later!',
  },
  BLOCKFROST_ERROR: {
    error_code: 1011,
    msg: 'The requested component has not been found!',
  },
  CANNOT_GET_NFTS: {
    error_code: 1012,
    msg: 'We can get list nfts now! Please try again later!',
  },
  CNFTs: {
    error_code: 1013,
    msg: 'Cannot found CNFTs from Cardano Service!',
  },
  MISSING_PERMISSIONS: {
    error_code: 3001,
    msg: 'You do not have permission to edit this document! Please contact the owner for more information!',
  },
};

export const CREDENTIAL_ERROR = {
  INVALID_PARAMETER: {
    error_code: 1016,
    msg: 'Missing parameters! Please check your configuration!',
  },
  INVALID_ACTION: {
    error_code: 1017,
    msg: 'Action not found! Please check the purpose of your action',
  },
  CANNOT_CHANGE_HOLDER_SHIP: {
    error_code: 1018,
    msg: 'Cannot change the holder ship of this document!',
  },
  CANNOT_SIGN_OBJECT: {
    error_code: 1019,
    msg: 'Cannot sign the object! Please try again later!',
  },
  CANNOT_CREATE_CREDENTIAL: {
    error_code: 1020,
    msg: 'Cannot create credential! Please try again later!',
  },
};

export const GENERAL_ERROR = {
  MISSING_ADDRESS: {
    error_code: 3001,
    msg: 'Missing address of current user!',
  },
};
