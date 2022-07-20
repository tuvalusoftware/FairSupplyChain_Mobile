const {UUIDV4_LENGTH} = require('../constants/hash');
const {v4} = require('uuid');
const isUUID = require('validator/lib/isUUID');
const {deepMap} = require('./salt.ts');
const {SIGNATURE_TYPE} = require('../constants/type');

export const saltData = data => {
  return deepMap(data, uuidSalt);
};

/**
 * @param {Object} data
 * @return {Object} document
 */
export const _createDocument = data => {
  const documentSchema = {
    data: saltData(data),
  };
  return documentSchema;
};

export const _wrapDocument = (document, signedData, targetHash) => {
  const signatureProof = [
    {
      signature: signedData,
    },
  ];

  // Init the signature information includes: type, target, and proof ( signedData )
  const signature = {
    type: SIGNATURE_TYPE,
    targetHash: targetHash,
    proof: signatureProof,
    merkleRoot: targetHash,
  };
  const data = document.data;
  const wrappedDocument = {
    data,
    signature,
  };
  return wrappedDocument;
};

/**
 *
 */
export const uuidSalt = value => {
  const salt = v4();
  return `${salt}:${primitiveToTypedString(value)}`;
};

/**
 *
 */
const primitiveToTypedString = value => {
  switch (typeof value) {
    case 'number':
    case 'string':
    case 'boolean':
    case 'undefined':
      return `${typeof value}:${String(value)}`;
    default:
      if (value === null) {
        // typeof null is 'object' so we have to check for it
        return 'null:null';
      }
      throw new Error(
        `Parsing error, value is not of primitive type: ${value}`,
      );
  }
};

/**
 *
 */
export const generateDidOfWrappedDocument = (companyName, name) => {
  const ddidDocument = `did:fuixlabs:${companyName}:${name}`;
  return ddidDocument;
};

// ADDITIONAL FUNCTIONS USED FOR VAFIFYING DOCUMENT

/**
 * @param {String} value
 * Value salted string in the format "salt:type:value", example: "ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5"
 * Returns an appropriately typed value when given a salted string with type annotation
 */
export function unsalt(value) {
  if (startsWithUuidV4(value)) {
    const untypedValue = value.substring(UUIDV4_LENGTH).trim();
    return typedStringToPrimitive(untypedValue);
  }
  return value;
}

export function deepUnsalt(data) {
  return deepMap(data, unsalt);
}

/**
 * Check the input start with UUIDV4
 * @param {String} input
 * @return {Boolean} - Dose the input start with UUIDV4
 */
export const startsWithUuidV4 = input => {
  if (input && typeof input === 'string') {
    const elements = input.split(':');
    return isUUID(elements[0], 4);
  }
  return false;
};

/**
 * @param {String} input
 * Returns an appropriately typed value given a string with type annotations, e.g: "number:5"
 */
export const typedStringToPrimitive = input => {
  const [type, ...valueArray] = input.split(':');
  const value = valueArray.join(':'); // just in case there are colons in the value

  switch (type) {
    case 'number':
      return Number(value);
    case 'string':
      return String(value);
    case 'boolean':
      return value === 'true';
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    default:
      throw new Error(
        `Parsing error, type annotation not found in string: ${input}`,
      );
  }
};
