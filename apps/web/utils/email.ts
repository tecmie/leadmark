export const splitEmailAddress = (emailAddress: string) => {
  const [local, domain] = emailAddress.split('@');
  return {
    local,
    domain
  };
};

export const emailIsValid = (address: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(address)) {
    throw new Error(`Invalid email address: ${address}`);
  }
  return true;
};

export const isValidAndSplit = (address: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(address)) {
    throw new Error(`Invalid email address: ${address}`);
  }
  const [uniqueAddress, dotcom] = address.split('@');

  return {
    uniqueAddress,
    dotcom
  };
};
