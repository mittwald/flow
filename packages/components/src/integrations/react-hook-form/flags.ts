export const flags = {
  requireCloseModalConfirmationOnUnsavedChanges: false,
};

const defaultFlags = { ...flags };

export const resetFlags = () => {
  Object.assign(flags, defaultFlags);
};
