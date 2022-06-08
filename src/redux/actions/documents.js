const api = () => {};
export const action = (params, callback) => {
  return dispatch => {
    return api(params)
      .then(response => {})
      .catch(error => {
        //fetch failed
        if (callback) {
          callback(error);
        }
      });
  };
};
