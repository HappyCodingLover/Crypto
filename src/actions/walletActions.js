import actionTypes from './actionTypes';
const { ipcRenderer } = window.require('electron');

export const toggleForm = () => ({
  type: actionTypes.TOGGLE_TASK_FORM
});

export const resetForm = () => ({
  type: actionTypes.RESET_TASK_FORM
});

export const updateField = (attribute, value) => ({
  type: actionTypes.UPDATE_TASK_FIELD,
  payload: { attribute, value }
});

export const createTask = () => (dispatch, getState) => {
  const storeUrl = getState().tasksReducer.getIn(['currentTask', 'storeUrl']);
  dispatch({ type: actionTypes.CREATE_TASK });
};

export const addProduct = (product, qtty) => ({
  type: actionTypes.ADD_PRODUCT_TO_TASK,
  payload: { product, qtty }
});

export const pauseTask = task => ({
  type: actionTypes.STOP_TASK,
  payload: task
});

export const runTask = task => ({
  type: actionTypes.RUN_TASK,
  payload: task
});

export const deleteTask = task => ({
  type: actionTypes.DELETE_TASK,
  payload: task
});

export const editTask = task => ({
  type: actionTypes.EDIT_TASK,
  payload: task
});

export const updateTask = () => ({
  type: actionTypes.UPDATE_TASK
});

export const closeForm = () => ({
  type: actionTypes.CLOSE_FORM
});

export const cloneCurrentTask = () => dispatch => dispatch(createTask());

export const deleteTasksBulk = taskIDs => ({
  type: actionTypes.DELETE_TASKS_BULK,
  payload: taskIDs
});

export const startTasksBulk = taskIDs => ({
  type: actionTypes.START_TASKS_BULK,
  payload: taskIDs
});

export const updateProductUrl = (task, productUrl) => ({
  type: actionTypes.UPDATE_PRODUCT_URL,
  payload: { task, productUrl }
});

export const activateProduct = task => ({
  type: actionTypes.ACTIVATE_TASK_ROW,
  payload: { task }
});
