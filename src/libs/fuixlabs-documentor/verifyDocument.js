// * Constants libraries
import {SERVICE} from './constants/type';
import {VERIFIER_ERROR_CODE} from './constants/error';

// * Rest libraries
import {CLIENT_PATH} from './rest/client.path';
import {
  requestVerifyCNFT,
  getDidDocumentByDid,
  requestVerifySignature,
} from './rest/client.rest';

// * Utilities libraries
import {digestDocument} from './utils/digest';
import {checkProof} from './utils/merkle';
import {get} from 'lodash';
import {Buffer} from 'buffer';

/**
 * Function used to validate wrapped document against current service
 * @param {Object} document - the content of wrapped document that we want to verify
 * @param {String} usedAddress - the encoded of current user's public key
 * @param {String} service - the name of service that user want to verify on
 * @return {Promise}
 */
export const verifyWrappedDocument = async (document, usedAddress, service) => {
  // * Check the validity of the args
  if (!document || !service || !usedAddress) {
    return VERIFIER_ERROR_CODE.INVALID_PARAMETER;
  }

  // * Distinguishing cases of verify wrapped document based on service - example: eth, cardano
  if (service !== SERVICE.CARDANO) {
    // * Skip it for demo
  } else {
    try {
      const res = await verifyCardanoDocument(document, usedAddress);
      // * If the wrappedDocument is valid will return true
      return res;
    } catch (e) {
      throw e;
    }
  }
};

/**
 * Verify the CNFT of the wrappedDocument on Cardano blockchain rely on its targetHash and policyId
 * @param {String} targetHash - targetHash of the wrappedDocument
 * @param {String} policyId - policyId of the wrappedDocument
 * @return {Promise}
 */
const verifyCNFT = async (targetHash, policyId) => {
  try {
    const response = await requestVerifyCNFT(CLIENT_PATH.VERIFY_CNFT, {
      hashOfDocument: targetHash,
      policyId: policyId,
    });
    if (response.data.error_code || !response.data.data.result) {
      throw response.data;
    }
  } catch (e) {
    throw VERIFIER_ERROR_CODE.CNFTs;
  }
};

/**
 * Verify the signature of the wrappedDocument rely on its targetHash and policyId
 * @param {String} address
 * @param {String} payload
 * @param {String} signature
 * @return {Promise}
 */
const verifySignature = async (address, payload, signature) => {
  try {
    const verifySigRes = await requestVerifySignature(
      CLIENT_PATH.VERIFY_SIGNATURE,
      {address, payload, signature},
    );
    if (verifySigRes.data.error_code || !verifySigRes.data.data.result) {
      throw verifySigRes.data;
    }
  } catch (e) {
    throw VERIFIER_ERROR_CODE.INVALID_SIGNATURE;
  }
};

/**
 * @param {Object} document
 * @param {String} address
 * @return {Promise}
 */

export const verifyCardanoDocument = async (document, address) => {
  try {
    // * First verifier is verifying the hash of wrappedDocument (targetHash)
    const res = await verifyTargetHash(document);
    // * Go to the next step if the targetHash is valid
    if (res && !res.error_code) {
      // * Get targetHash and Signature got from wrappedDocument
      const targetHash = document?.signature?.targetHash;
      const signature = document?.signature?.proof[0]?.signature;
      const didOfWrappedDocument = document?.data?.did;
      const policyId = document?.policyId;
      // * Get the public key from controller
      // * Generate payload rely on public key and targetHash
      const payload = Buffer.from(
        JSON.stringify({
          address: address,
          targetHash: targetHash,
        }),
        'utf8',
      ).toString('hex');
      // * Call to cardanoService to verify the targetHash
      await verifyCNFT(targetHash, policyId);
      await verifySignature(address, payload, signature);
      const EXCLUDE_VALUE = '';
      const getRes = await getDidDocumentByDid(
        CLIENT_PATH.GET_DID_DOCUMENT_BY_DID,
        {
          did: didOfWrappedDocument,
          exclude: EXCLUDE_VALUE,
        },
      );
      if (getRes.data) {
        return {
          policyId: policyId,
          didDoc: getRes.data.didDoc,
        };
      }
      if (getRes.data.errorCode) {
        throw getRes.data;
      }
    }
  } catch (e) {
    throw e;
  }
};

/**
 * @param {Object} document - wrappedDocument
 * @return {Boolean}
 */
const verifyTargetHash = document => {
  // Get signature field from wrappedDocument which user wanna verify
  const signature = get(document, 'signature');
  if (!signature) {
    return VERIFIER_ERROR_CODE.MISSING_SIGNATURE;
  }
  // Checks target hash
  const digest = digestDocument(document);
  const targetHash = get(document, 'signature.targetHash');

  // If the system hashes the contents of the current wrapperDocument, check if it matches the targetHash available in the wrapperDocument.
  if (digest !== targetHash) {
    return VERIFIER_ERROR_CODE.INVALID_TARGET_HASH;
  }

  // Function that runs through the supplied hashes to arrive at the supplied merkle root hash
  return checkProof(
    [],
    document?.signature?.merkleRoot,
    document?.signature?.targetHash,
  );
};
