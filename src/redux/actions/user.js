import {userSliceActions} from '../reducer/user';
import {documentsSliceActions} from '../reducer/documents';
export const logout = (params, callback) => {
  return dispatch => {
    console.log('logout');
    dispatch(userSliceActions.reset({}));
    dispatch(documentsSliceActions.reset({}));
  };
};
