/* eslint-disable dot-notation */
import {deepMap} from './utils/salt.ts';
import {unsalt} from './utils/data';
import {
  signObject,
  wrapDocument,
  createWrappedDocument,
} from './utils/document';
import {sendWrappedDocument} from './rest/client.rest';
import {CLIENT_PATH} from './rest/client.path';
import {
  VALID_DOCUMENT_NAME_TYPE,
  SAMPLE_SERVICE,
  _DOCUMENT_TYPE,
  COMPANY_NAME,
} from './constants/type';

/**
 * Function used for create new wrapped document with document object, current user's public key
 * @param {documents} document - document object
 * @param {String} usedAddress - current user's public key
 * @param {Boolean} update - update document or not
 * @param {Object} updateDocument - update document object
 * @param {Function} fuixlabsWalletors - sign document function
 * @return {Promise} - Promise object includes wrapped document
 */
export const createDocument = async (
  documents,
  usedAddress,
  update,
  updateDocument,
  fuixlabsWalletors = undefined,
) => {
  console.log('1');
  for (let index = 0; index < documents.length; index++) {
    let document = documents[index];

    // * Unsalt all elements in document object in case the user want to update the document
    document = deepMap(document, unsalt);
    let createdDocument = {};
    for (const key in document) {
      if (key !== 'did') {
        createdDocument = Object.assign(createdDocument, {
          [key]: document[key],
        });
      }
    }
    console.log('2');
    createdDocument = Object.assign(createdDocument, {
      companyName: COMPANY_NAME,
      // * Get type rely on name of document in config file
      intention: VALID_DOCUMENT_NAME_TYPE.find(
        prop => prop.name === createdDocument.name,
      )?.type,
    });
    console.log('3');
    const did = `did:fuixlabs:SAMPLE_COMPANY_NAME:${usedAddress}`; // * Did of issuers
    // * Create new document, generate did of wrapped-document rely on file name and company name, and create target-hash based on data of the document
    try {
      let res = await createWrappedDocument(
        createdDocument,
        SAMPLE_SERVICE,
        usedAddress,
        did,
      );
      console.log('4');
      const {_document, targetHash, ddidDocument} = res;
      console.log('5', _document);
      // * Sign Object with signing function of cardano
      const signedData = await signObject(
        usedAddress,
        {
          address: usedAddress,
          targetHash: targetHash,
        },
        fuixlabsWalletors,
      );
      console.log('6');
      const response = wrapDocument({
        document: _document,
        walletAddress: usedAddress,
        signedData: signedData,
        targetHash: targetHash,
      });
      // * Get the wrapped document
      const wrappedDocument = response;
      console.log('8');
      let requestBody = {
        wrappedDocument: wrappedDocument,
        issuerAddress: usedAddress,
        did: ddidDocument,
      };
      console.log('9');
      // * If the type of document is non-trade, then make a new document with new policy id, otherwise, make a copy of current document with the same policy id
      if (
        update &&
        unsalt(wrappedDocument.data.intention) === _DOCUMENT_TYPE.nonTrade
      ) {
        requestBody = {
          ...requestBody,
          previousHashOfDocument: updateDocument.targetHash,
          originPolicyId: updateDocument.policyId,
        };
      }
      console.log('10');
      const wrappedResult = await sendWrappedDocument(
        CLIENT_PATH.SEND_WRAPPED_DOCUMENT,
        requestBody,
      ); // **
      console.log('11');
      const doc = wrappedResult.data;
      return {
        wrappedDocument: doc,
      };
    } catch (e) {
      console.log('e', e);
      throw (
        e.msg ||
        e.errorMessage ||
        e.errorMsg ||
        e.message ||
        'Something went wrong! Please try again later.'
      );
    }
  }
};
