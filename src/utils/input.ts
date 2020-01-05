import * as core from '@actions/core';

export class Input {
  /**
   * Check whether the given input exists and is not empty.
   * @param name The input name.
   */
  static has(name: string): boolean {
    const actual = core.getInput(name);
    return actual !== '';
  }

  /**
   * Get an action input.
   * @param name The input name.
   * @param defaultV The default value.
   */
  static get<T = string>(name: string, defaultV: any = ''): T {
    return Input.has(name) ? core.getInput(name) : defaultV;
  }

  /**
   * Execute a callback when the given input exists and is not empty.
   * @param name The input name.
   * @param callback The callback to execute if the input is present.
   */
  static whenHas<T = string>(name: string, callback: (val: T) => void) {
    if (!Input.has(name)) {
      return;
    }

    callback(Input.get<T>(name));
  }
}
