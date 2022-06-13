use super::ptr_j::*;
use super::result::ToJniResult;
use super::utils::{from_bytes, to_bytes};
use crate::panic::{handle_exception_result, ToResult, Zip};
use crate::ptr::RPtrRepresentable;
use crate::utils::ToFromBytes;
use cardano_serialization_lib::crypto::{BootstrapWitness, Ed25519Signature, Vkey};
use cardano_serialization_lib::error::DeserializeError;
use jni::objects::JObject;
use jni::sys::{jbyteArray, jobject};
use jni::JNIEnv;

impl ToFromBytes for BootstrapWitness {
  fn to_bytes(&self) -> Vec<u8> {
    self.to_bytes()
  }

  fn from_bytes(bytes: Vec<u8>) -> Result<BootstrapWitness, DeserializeError> {
    BootstrapWitness::from_bytes(bytes)
  }
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_bootstrapWitnessToBytes(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  to_bytes::<BootstrapWitness>(env, ptr)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_bootstrapWitnessFromBytes(
  env: JNIEnv, _: JObject, bytes: jbyteArray,
) -> jobject {
  from_bytes::<BootstrapWitness>(env, bytes)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_bootstrapWitnessNew(
  env: JNIEnv, _: JObject, vkey: JRPtr, signature: JRPtr, chain_code: jbyteArray,
  attributes: jbyteArray,
) -> jobject {
  handle_exception_result(|| {
    let vkey = vkey.rptr(&env)?;
    let signature = signature.rptr(&env)?;
    env
      .convert_byte_array(chain_code)
      .into_result()
      .zip(env.convert_byte_array(attributes).into_result())
      .zip(vkey.typed_ref::<Vkey>())
      .zip(signature.typed_ref::<Ed25519Signature>())
      .map(|(((chain_code, attributes), vkey), signature)| {
        BootstrapWitness::new(vkey, signature, chain_code, attributes)
      })
      .and_then(|bootstrap_wit| bootstrap_wit.rptr().jptr(&env))
  })
  .jresult(&env)
}
