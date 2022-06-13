use super::ptr_j::*;
use super::result::ToJniResult;
use super::utils::{from_bytes, to_bytes};
use crate::panic::{handle_exception_result, Zip};
use crate::ptr::RPtrRepresentable;
use crate::utils::ToFromBytes;
use cardano_serialization_lib::crypto::{Ed25519Signature, Vkey, Vkeywitness};
use cardano_serialization_lib::error::DeserializeError;
use jni::objects::JObject;
use jni::sys::{jbyteArray, jobject};
use jni::JNIEnv;

impl ToFromBytes for Vkeywitness {
  fn to_bytes(&self) -> Vec<u8> {
    self.to_bytes()
  }

  fn from_bytes(bytes: Vec<u8>) -> Result<Vkeywitness, DeserializeError> {
    Vkeywitness::from_bytes(bytes)
  }
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_vkeywitnessToBytes(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  to_bytes::<Vkeywitness>(env, ptr)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_vkeywitnessFromBytes(
  env: JNIEnv, _: JObject, bytes: jbyteArray,
) -> jobject {
  from_bytes::<Vkeywitness>(env, bytes)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_vkeywitnessNew(
  env: JNIEnv, _: JObject, vkey: JRPtr, signature: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let vkey = vkey.rptr(&env)?;
    let signature = signature.rptr(&env)?;
    vkey
      .typed_ref::<Vkey>()
      .zip(signature.typed_ref::<Ed25519Signature>())
      .and_then(|(vkey, signature)| Vkeywitness::new(vkey, signature).rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_vkeywitnessSignature(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr.typed_ref::<Vkeywitness>().and_then(|vkeywit| vkeywit.signature().rptr().jptr(&env))
  })
  .jresult(&env)
}
