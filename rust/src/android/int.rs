use super::primitive::ToPrimitiveObject;
use super::ptr_j::*;
use super::result::ToJniResult;
use crate::panic::handle_exception_result;
use crate::ptr::RPtrRepresentable;
use cardano_serialization_lib::utils::{BigNum, Int};
use jni::objects::JObject;
use jni::sys::{jint, jobject};
use jni::JNIEnv;

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_intNew(
  env: JNIEnv, _: JObject, x_ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let x = x_ptr.rptr(&env)?;
    x.typed_ref::<BigNum>().map(|coin| Int::new(coin)).and_then(|val| val.rptr().jptr(&env))
  })
  .jresult(&env)
}

#[allow(non_snake_case)]
#[no_mangle]
pub unsafe extern "C" fn Java_com_fairsupplychain_Native_intAsi32(
  env: JNIEnv, _: JObject, ptr: JRPtr,
) -> jobject {
  handle_exception_result(|| {
    let rptr = ptr.rptr(&env)?;
    rptr.typed_ref::<Int>().map(|int| int.as_i32().map(|res| (res as jint))).and_then(|res| {
      match res {
        Some(res) => res.jobject(&env),
        None => Ok(JObject::null()),
      }
    })
  })
  .jresult(&env)
}
