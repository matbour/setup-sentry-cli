/**
 * Infer a string into a typed value.
 * @param {string} val
 * @returns {undefined | string | null | boolean | number}
 */
export default <T = string>(val: string): T => {
  if (val === '') {
    return (null as unknown) as T;
  } else if (val.match(/^\d+$/)) {
    return (parseInt(val, 10) as unknown) as T;
  } else if (val.match(/^0x[0-9a-fA-F]+$/)) {
    return (parseInt(val, 16) as unknown) as T;
  } else if (val.match(/^\d+\.\d*$/) || val.match(/^\d*\.\d+$/)) {
    return (parseFloat(val) as unknown) as T;
  } else if (val.match(/^null$/i)) {
    return (null as unknown) as T;
  } else if (val.match(/^undefined$/i)) {
    return (undefined as unknown) as T;
  } else if (val.match(/^true$/i)) {
    return (true as unknown) as T;
  } else if (val.match(/^false$/i)) {
    return (false as unknown) as T;
  }

  return (val as unknown) as T;
};
