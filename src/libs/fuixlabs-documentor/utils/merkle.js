/* eslint-disable no-undef */
import {hashToBuffer} from './buffer.ts';
import {keccak256} from 'js-sha3';

/**
 * Function that runs through the supplied hashes to arrive at the supplied merkle root hash
 * @param {String} _proof The list of uncle hashes required to arrive at the supplied merkle root
 * @param {String}  _root The merkle root
 * @param {String} _element The leaf node that is being verified
 */
export const checkProof = (_proof, _root, _element) => {
  const proof = _proof.map(step => hashToBuffer(step));
  const root = hashToBuffer(_root);
  const element = hashToBuffer(_element);
  const proofRoot = proof.reduce(
    (hash, pair) => combineHashBuffers(hash, pair),
    element,
  );
  return root.equals(proofRoot);
};

/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 */
export const combineHashBuffers = (first, second) => {
  if (!second) {
    return first; // it should always be valued if second is not
  }
  if (!first) {
    return second;
  }
  return hashToBuffer(keccak256(bufSortJoin(first, second)));
};

/**
 * @param {Array} args
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 */
export const bufSortJoin = (...args) => {
  return Buffer.concat([...args].sort(Buffer.compare));
};
