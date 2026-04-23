export const flags = {
  requireCloseModalConfirmationOnUnsavedChanges: false,
  disableInitialListSuspenseBoundaries: false,
};

const defaultFlags = { ...flags };

export const resetFlags = () => {
  Object.assign(flags, defaultFlags);
};
