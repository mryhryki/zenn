import * as Platform from 'platform';

const isMobileDevice = (): boolean => {
  const osFamily = Platform.os.family;
  return (osFamily === 'iOS' || osFamily === 'Android');
};

export {
  isMobileDevice,
};
