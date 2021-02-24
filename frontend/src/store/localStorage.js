const loadState = (stateName) => {
  try {
    const serializedState = localStorage.getItem(stateName);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};
const saveState = (stateName, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateName, serializedState);
  } catch {
    // ignore write errors
  }
};

const clearState = (stateName) => {
  try {
    localStorage.removeItem(stateName);
  } catch {
    // ignore write errors
  }
};
export default {
  loadState,
  saveState,
  clearState,
};
