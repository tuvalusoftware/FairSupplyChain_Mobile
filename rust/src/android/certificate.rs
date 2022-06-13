use super::ptr_j::*;
use super::result::ToJniResult;
use super::utils::{from_bytes, to_bytes};
use crate::panic::handle_exception_result;
use crate::ptr::RPtrRepresentable;
use crate::utils::ToFromBytes;
use cardano_serialization_lib::error::DeserializeError;
use cardano_serialization_lib::{
  Certificate, StakeDelegation, StakeDeregistration, StakeRegistration,
};
use jni::objects::JObject;
use jni::sys::{jbyteArray, jobject};
use jni::JNIEnv;

impl ToFromBytes for Certificate {
  fn to_bytes(&self) -> Vec<u8> {
    self.to_bytes()
  }

  fn from_bytes(bytes: Vec<u8>) -> Result<Certificate, DeserializeError> {
    Certificate::from_bytes(bytes)
  }
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_certificateToBytes(
  env: JNIEnv, _: JObject, certificate: JRPtr,
) -> jobject {
  to_bytes::<Certificate>(env, certificate)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_certificateFromBytes(
  env: JNIEnv, _: JObject, bytes: jbyteArray,
) -> jobject {
  from_bytes::<Certificate>(env, bytes)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_certificateNewStakeRegistration(
  env: JNIEnv, _: JObject, stake_reg_ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let stake_reg = stake_reg_ptr.rptr(&env)?;
    stake_reg
      .typed_ref::<StakeRegistration>()
      .map(|stake_reg| Certificate::new_stake_registration(stake_reg))
      .and_then(|certificate| certificate.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_certificateNewStakeDeregistration(
  env: JNIEnv, _: JObject, stake_dereg_ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let stake_dereg = stake_dereg_ptr.rptr(&env)?;
    stake_dereg
      .typed_ref::<StakeDeregistration>()
      .map(|stake_dereg| Certificate::new_stake_deregistration(stake_dereg))
      .and_then(|certificate| certificate.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_certificateNewStakeDelegation(
  env: JNIEnv, _: JObject, stake_delegation_ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let stake_delegation = stake_delegation_ptr.rptr(&env)?;
    stake_delegation
      .typed_ref::<StakeDelegation>()
      .map(|stake_delegation| Certificate::new_stake_delegation(stake_delegation))
      .and_then(|certificate| certificate.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_certificateAsStakeRegistration(
  env: JNIEnv, _: JObject, certificate: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let certificate = certificate.rptr(&env)?;
    certificate
      .typed_ref::<Certificate>()
      .map(|certificate| certificate.as_stake_registration())
      .and_then(|stake_registration| stake_registration.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_certificateAsStakeDeregistration(
  env: JNIEnv, _: JObject, certificate: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let certificate = certificate.rptr(&env)?;
    certificate
      .typed_ref::<Certificate>()
      .map(|certificate| certificate.as_stake_deregistration())
      .and_then(|stake_deregistration| stake_deregistration.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_certificateAsStakeDelegation(
  env: JNIEnv, _: JObject, certificate: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let certificate = certificate.rptr(&env)?;
    certificate
      .typed_ref::<Certificate>()
      .map(|certificate| certificate.as_stake_delegation())
      .and_then(|stake_delegation| stake_delegation.rptr().jptr(&env))
  })
  .jresult(&env)
}
