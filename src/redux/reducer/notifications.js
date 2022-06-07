/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author NNTruong / nhuttruong6496@gmail.com
 */
import {createSlice} from '@reduxjs/toolkit';
import MockData from '../actions/MockData';
const initialModel = {
  data: MockData.notifications,
};

export const Slice = createSlice({
  name: 'notifications',
  initialState: initialModel,
  reducers: {
    example(state, action) {
      return state;
    },
  },
});

export const notificationsSliceActions = Slice.actions;
export default Slice.reducer;
