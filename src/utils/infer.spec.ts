import infer from './infer';

const cases: [string, any][] = [
  ['true', true],
  ['false', false],
  ['0x76', 0x76],
  ['.01', 0.01],
  ['18.', 18],
  ['null', null],
  ['1.0.0', '1.0.0'],
];

it.each(cases)('should infer %p to %p', (input, output) => {
  expect(infer(input)).toBe(output);
});
