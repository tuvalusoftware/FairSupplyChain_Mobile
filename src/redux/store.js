import {configureStore} from '@reduxjs/toolkit';
import user from './reducer/user';
import documents from './reducer/documents';
import settings from './reducer/settings';
import notifications from './reducer/notifications';
export default configureStore({
  reducer: {
    user,
    documents,
    settings,
    notifications,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}),
});
