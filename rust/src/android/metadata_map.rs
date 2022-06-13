use super::primitive::ToPrimitiveObject;
use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::{handle_exception_result, ToResult, Zip};
use crate::ptr::RPtrRepresentable;
use cardano_serialization_lib::metadata::{MetadataMap, TransactionMetadatum};
use jni::objects::JObject;
use jni::sys::jobject;
use jni::JNIEnv;

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_metadataMapNew(
  env: JNIEnv, _: JObject,
) -> jobject {
  handle_exception_result(|| MetadataMap::new().rptr().jptr(&env)).jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_metadataMapLen(
  env: JNIEnv, _: JObject, metadata_map: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let metadata_map = metadata_map.rptr(&env)?;
    metadata_map
      .typed_ref::<MetadataMap>()
      .map(|metadata_map| metadata_map.len())
      .and_then(|len| len.into_jlong().jobject(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_metadataMapInsert(
  env: JNIEnv, _: JObject, metadata_map: JRPtr, key: JRPtr, value: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let metadata_map = metadata_map.rptr(&env)?;
    let key = key.rptr(&env)?;
    let value = value.rptr(&env)?;
    metadata_map
      .typed_ref::<MetadataMap>()
      .zip(key.typed_ref::<TransactionMetadatum>())
      .zip(value.typed_ref::<TransactionMetadatum>())
      .map(|((metadata_map, key), value)| metadata_map.insert(key, value))
      .and_then(|txMetadatum| txMetadatum.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_metadataMapGet(
  env: JNIEnv, _: JObject, metadata_map: JRPtr, key: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let metadata_map = metadata_map.rptr(&env)?;
    let key = key.rptr(&env)?;
    metadata_map
      .typed_ref::<MetadataMap>()
      .zip(key.typed_ref::<TransactionMetadatum>())
      .and_then(|(metadata_map, key)| metadata_map.get(key).into_result())
      .and_then(|tx_metadatum| tx_metadatum.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_metadataMapKeys(
  env: JNIEnv, _: JObject, metadata_map: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let metadata_map = metadata_map.rptr(&env)?;
    metadata_map
      .typed_ref::<MetadataMap>()
      .and_then(|metadata_map| metadata_map.keys().rptr().jptr(&env))
  })
  .jresult(&env)
}
