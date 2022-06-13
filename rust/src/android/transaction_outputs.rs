use super::primitive::ToPrimitiveObject;
use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::handle_exception_result;
use crate::ptr::RPtrRepresentable;
use cardano_serialization_lib::TransactionOutputs;
use jni::objects::JObject;
use jni::sys::{jlong, jobject};
use jni::JNIEnv;

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_transactionOutputsLen(
  env: JNIEnv, _: JObject, tx_outputs: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let tx_outputs = tx_outputs.rptr(&env)?;
    tx_outputs
      .typed_ref::<TransactionOutputs>()
      .map(|tx_outputs| tx_outputs.len())
      .and_then(|len| len.into_jlong().jobject(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_transactionOutputsGet(
  env: JNIEnv, _: JObject, tx_outputs: JRPtr, index: jlong,
) -> jobject {
  handle_exception_result(|| {
    let tx_outputs = tx_outputs.rptr(&env)?;
    tx_outputs
      .typed_ref::<TransactionOutputs>()
      .map(|tx_outputs| tx_outputs.get(usize::from_jlong(index)))
      .and_then(|tx_output| tx_output.rptr().jptr(&env))
  })
  .jresult(&env)
}
