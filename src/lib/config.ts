export const isRegistrationEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_DISABLE_REGISTRATION !== 'true';
};
