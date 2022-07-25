/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author NNTruong / nhuttruong6496@gmail.com
 */
import {createSlice} from '@reduxjs/toolkit';
import MockData from '../actions/MockData';
const initialModel = {
  document: MockData.settings.document,
};

export const Slice = createSlice({
  name: 'settings',
  initialState: initialModel,
  reducers: {
    example(state, action) {
      return state;
    },
    reset() {
      return {
        document: MockData.settings.document,
      };
    },
  },
});

export const settingsSliceActions = Slice.actions;
export default Slice.reducer;
