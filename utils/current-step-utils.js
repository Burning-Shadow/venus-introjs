export const setGuideCurrentStep = stepName => {
  sessionStorage.setItem("VENUS_CURRENT_GUIDE_STEP", stepName);
};

export const clearGuideCurrentStep = () => {
  sessionStorage.removeItem("VENUS_CURRENT_GUIDE_STEP");
};

export const getGuideCurrentStep = () => {
  return sessionStorage.getItem("VENUS_CURRENT_GUIDE_STEP");
};
