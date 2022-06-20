import {userSliceActions} from '../reducer/user';
import {documentsSliceActions} from '../reducer/documents';
import {settingsSliceActions} from '../reducer/settings';
import {notificationsSliceActions} from '../reducer/notifications';
import Constants, {
  clearStorage,
  setStorage,
  getStorage,
} from '../../util/Constants';
export const logout = (params, callback) => {
  return dispatch => {
    console.log('logout');
    dispatch(userSliceActions.reset({}));
    dispatch(documentsSliceActions.reset({}));
    dispatch(settingsSliceActions.reset({}));
    dispatch(notificationsSliceActions.reset({}));
    _clearStore(callback);
  };
};

const _clearStore = async callback => {
  let onboardingViewed = await getStorage(Constants.STORAGE.onboardingViewed);
  await clearStorage();
  if (onboardingViewed) {
    await setStorage(Constants.STORAGE.onboardingViewed, true);
  }
  if (callback) {
    callback();
  }
};
