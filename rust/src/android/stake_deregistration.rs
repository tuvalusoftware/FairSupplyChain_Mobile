use super::ptr_j::*;
use super::result::ToJniResult;
use super::utils::{from_bytes, to_bytes};
use crate::panic::handle_exception_result;
use crate::ptr::RPtrRepresentable;
use crate::utils::ToFromBytes;
use cardano_serialization_lib::address::StakeCredential;
use cardano_serialization_lib::error::DeserializeError;
use cardano_serialization_lib::StakeDeregistration;
use jni::objects::JObject;
use jni::sys::{jbyteArray, jobject};
use jni::JNIEnv;

impl ToFromBytes for StakeDeregistration {
  fn to_bytes(&self) -> Vec<u8> {
    self.to_bytes()
  }

  fn from_bytes(bytes: Vec<u8>) -> Result<StakeDeregistration, DeserializeError> {
    StakeDeregistration::from_bytes(bytes)
  }
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_stakeDeregistrationToBytes(
  env: JNIEnv, _: JObject, stake_deregistration: JRPtr,
) -> jobject {
  to_bytes::<StakeDeregistration>(env, stake_deregistration)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_stakeDeregistrationFromBytes(
  env: JNIEnv, _: JObject, bytes: jbyteArray,
) -> jobject {
  from_bytes::<StakeDeregistration>(env, bytes)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_stakeDeregistrationStakeCredential(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr
      .typed_ref::<StakeDeregistration>()
      .and_then(|stake_deregistration| stake_deregistration.stake_credential().rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_stakeDeregistrationNew(
  env: JNIEnv, _: JObject, stake_credential_ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let stake_credential = stake_credential_ptr.rptr(&env)?;
    stake_credential
      .typed_ref::<StakeCredential>()
      .map(|stake_credential| StakeDeregistration::new(stake_credential))
      .and_then(|stake_deregistration| stake_deregistration.rptr().jptr(&env))
  })
  .jresult(&env)
}
