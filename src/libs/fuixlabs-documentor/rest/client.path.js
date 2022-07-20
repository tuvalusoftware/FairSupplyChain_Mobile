export const CLIENT_PATH = {
  // * DID CONTROLLER ENDPOINTS
  WRAP_DOCUMENT: 'document/wrap-document/',
  CREATE_DOCUMENT: 'document/create-document/',

  // * URL RESOLVER ENDPOINTS
  SEND_WRAPPED_DOCUMENT: 'resolver/wrapped-document',
  CHECK_DID_OF_WRAPPED_DOCUMENT: 'resolver/wrapped-document/exist/',
  GET_DID_DOCUMENT_BY_DID: 'resolver/wrapped-document/',
  PULL_NFTS: 'resolver/nfts/',
  VERIFY_CNFT: 'resolver/hash/verify',
  VERIFY_SIGNATURE: 'resolver/signature/verify/',
  PULL_TRANSACTIONS: 'resolver/wrapped-document/user/',
  CREATE_CREDENTIAL: 'resolver/credential/',
  GET_PUBLIC_KEY: 'resolver/auth/public-key/',
  UPDATE_DID_DOCUMENT: 'resolver/wrapped-document/transfer/',
};
