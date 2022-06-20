/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author NNTruong / nhuttruong6496@gmail.com
 */
import {createSlice} from '@reduxjs/toolkit';
import {asset} from '../../util/script';
const initialModel = {
  userInfo: {
    id: 'User0123456789',
    privateKey: '0xF91807FDA532027fE32AbDCc56926cB286A28FD4',
    assets: [asset],
  },
  isLogged: false,
  role: 2,
  network: 'mainnet',
  connectedAuthServer: false,
  isOpenLoginModal: false,
};

export const Slice = createSlice({
  name: 'user',
  initialState: initialModel,
  reducers: {
    setData(state, action) {
      console.log('setData', action);
      let {payload} = action;
      for (let key in payload) {
        if (typeof state[key] === 'object') {
          state[key] = {...state[key], ...payload[key]};
        } else {
          state[key] = payload[key];
        }
      }
      return state;
    },
    reset() {
      return {
        userInfo: {
          assets: [asset],
        },
        isLogged: false,
        role: 1,
        connectedAuthServer: false,
      };
    },
    updateUserInfo(state, action) {
      console.log('updateUserInfo', action.payload);
      let {payload} = action;
      state.userInfo = {
        ...state.userInfo,
        ...payload.userInfo,
      };
      return state;
    },
  },
});

export const userSliceActions = Slice.actions;
export default Slice.reducer;
