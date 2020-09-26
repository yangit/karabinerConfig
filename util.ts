import fp from 'lodash/fp';
import _ from 'lodash';
import fs from 'fs';

type From = {
  key_code: string;
  modifiers?: { mandatory?: Modifier[]; optional?: Modifier[] };
};
type Condition = {
  type: string;
  input_sources?: any;
  name?: string;
  value?: number;
};
type Modifier = 'control' | 'shift' | 'command' | 'option';
interface Manipulator {
  conditions?: Condition[];
  from: From;
  to: {};
  type?: string;
}

export const log = (arg: any) => {
  console.log(arg);
  return arg;
};

export const getPath = (fileName: string) => `./templates/${fileName}`;

export const readFile = fp.flow([
  getPath,
  fs.readFileSync,
  fp.invoke('toString'),
]);
export const readJson = fp.flow([readFile, JSON.parse]);

export const addModifier = ({
  path,
  modifier,
}: {
  path: string[];
  modifier: Modifier;
}) => (manipulator: Manipulator) => {
  const insertIndex = fp.get(path)(manipulator)?.length || 0;

  return fp.set([...path, insertIndex], modifier)(manipulator);
};

export const addType = (manipulator: Manipulator) => ({
  type: 'basic',
  ...manipulator,
});

export const addCondition = (condition: Condition) => (
  manipulator: Manipulator,
) => {
  const result = { ...manipulator };
  if (!fp.isArray(result.conditions)) {
    result.conditions = [];
  }
  result.conditions.push(condition);
  return result;
};

export const addConditionUS = addCondition({
  type: 'input_source_if',
  input_sources: [
    {
      input_source_id: 'com.apple.keylayout.US',
    },
  ],
});

export const unpackTo = (string: string) => {
  const [key_code, ...modifiers] = string.split('+');
  const outKey: { key_code: string; modifiers?: string[] } = {
    key_code,
    modifiers,
  };

  return [outKey];
};
export const unpackFrom = (string: string): From => {
  const splitString = string.split('+');
  // @ts-ignore
  const [key_code, modifier]: [string, Modifier] = splitString;
  const outKey: From = {
    key_code,
  };
  if (modifier) {
    outKey.modifiers = { mandatory: [modifier] };
  }
  return outKey;
};
export const unpackBoth = ([fromString, toString]: string[]): Manipulator => ({
  from: unpackFrom(fromString),
  to: unpackTo(toString),
});
export const manipulatorsToRules = (name: string) => (
  manipulators: Manipulator[],
) => ({
  description: name,
  manipulators,
});

export const insertRulesIntoProdConfig = ({
  rules,
  simpleModifications,
  functionKeys,
}: {
  rules: any;
  simpleModifications: any;
  functionKeys: any;
}) => {
  // const emptyPattern = '"rules": []';
  // const simpleModificationsPattern = /"simple_modifications": \[\]/g;
  fp.flow([
    readFile,
    (templateString) =>
      _.template(templateString)(
        fp.mapValues(JSON.stringify)({
          rules: Object.values(rules),
          simpleModifications,
          functionKeys,
        }),
      ),
    // (where: string) =>
    //   where
    //     .replace(
    //       emptyPattern,
    //       `"rules":${JSON.stringify(Object.values(rules), null, '\t')}`,
    //     )
    //     .replace(
    //       simpleModificationsPattern,
    //       `"simple_modifications":${JSON.stringify(
    //         simpleModifications,
    //         null,
    //         '\t',
    //       )}`,
    //     ),
    log,
    (string: string) => {
      fs.writeFileSync('/Users/y/.config/karabiner/karabiner.json', string);
    },
  ])('empty.tpl');
};
