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
    avatar:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fvi.fanpop.com%2Fclubs%2Frandom%2Fpicks%2Fshow%2F457119%2Favatar-aang-naruto-uzumaki-who-would-win-fight&psig=AOvVaw1_9IFfMIyW14aq3xWLwRDe&ust=1654574494460000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJD4mLz4l_gCFQAAAAAdAAAAABAD',
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
