/**
 * Copyright (c) 2022 - KuKuLu Vietnam Limited
 *
 * @author NNTruong / nhuttruong6496@gmail.com
 */
import {createSlice} from '@reduxjs/toolkit';
import MockData from '../actions/MockData';
const initialModel = {
  data: MockData.documents,
  isFetching: false,
  isFetched: false,
};

export const Slice = createSlice({
  name: 'documents',
  initialState: initialModel,
  reducers: {
    fetchDocuments(state, action) {
      state.data = action.data;
      return state;
    },
    setFetchingDocuments(state, action) {
      state.isFetching = action.status;
      return state;
    },
    setFetchedDocuments(state, action) {
      state.isFetched = action.status;
      return state;
    },
    addDocument(state, action) {
      state.data.push(action.document);
      return state;
    },
    reset() {
      return {data: [], isFetching: false, isFetched: false};
    },
  },
});

export const documentsSliceActions = Slice.actions;
export default Slice.reducer;
