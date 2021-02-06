import { getInput } from '@actions/core';
import infer from './infer';

export default <T = string>(name: string, callback: (val: T) => void) => {
  const val = infer<T>(getInput(name));

  if (val !== null && val !== undefined) {
    callback(val);
  }
};
