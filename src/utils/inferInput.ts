import { getInput } from '@actions/core';
import infer from './infer';

export default <T = string>(name: string, defaultV: T | null = null): T | null => {
  return infer(getInput(name)) ?? defaultV;
};
