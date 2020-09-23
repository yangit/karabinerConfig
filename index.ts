import {
  log,
  readJson,
  unpackBoth,
  addType,
  addModifier,
  addCondition,
  insertRulesIntoProdConfig,
} from './util';

const simpleSymbols = [
  ['a', 'open_bracket'],
  ['s', 'close_bracket'],
  ['d', 'open_bracket+shift'],
  ['f', 'close_bracket+shift'],
  ['a', 'open_bracket'],
  ['s', 'close_bracket'],
  ['d', 'open_bracket+shift'],
  ['f', 'close_bracket+shift'],
  ['q', 'slash'],
  ['w', '9+shift'],
  ['e', '0+shift'],
  ['r', 'equal_sign+shift'],
  ['z', '4+shift'],
  ['x', 'comma+shift'],
  ['c', 'period+shift'],
  ['v', 'equal_sign'],
  ['t', 'hyphen'],
  ['g', '8+shift'],
  ['b', '2+shift'],
  ['y', '1+shift'],
  ['u', 'slash+shift'],
  ['i', 'semicolon+shift'],
  ['o', 'semicolon'],
  ['p', 'backslash'],
  ['open_bracket', '5+shift'],
  ['h', 'grave_accent_and_tilde+shift'],
  ['j', 'period'],
  ['k', 'comma'],
  ['l', 'quote+shift'],
  ['semicolon', 'quote'],
  ['quote', 'grave_accent_and_tilde'],
  ['n', 'backslash+shift'],
  ['m', '3+shift'],
  ['comma', 'hyphen+shift'],
  ['period', '7+shift'],
  ['slash', '6+shift'],
];

const rules = {
  switchLang: readJson('switchLang.json'),
  killSymbols: {
    description: 'kill old symbols',
    manipulators: simpleSymbols
      .map(([, target]) => [target, 'vk_none'])
      .map(unpackBoth)
      .map(addType)
      .map(
        addCondition({
          type: 'variable_if',
          name: 'symbolLayer',
          value: 0,
        }),
      )
      .map(
        addCondition({
          type: 'input_source_if',
          input_sources: [
            {
              language: 'en',
            },
          ],
        }),
      ),
  },
  killRussianSymbols: {
    description: 'kill russian symbols',
    manipulators: [
      ['slash', 'vk_none'],
      ['grave_accent_and_tilde', 'vk_none'],
      ['equal_sign', 'vk_none'],
      ['hyphen', 'vk_none'],
    ]
      .map(unpackBoth)
      .map(addType)
      .map(
        addCondition({
          type: 'variable_if',
          name: 'symbolLayer',
          value: 0,
        }),
      )
      .map(
        addCondition({
          type: 'input_source_if',
          input_sources: [
            {
              language: 'ru',
            },
          ],
        }),
      ),
  },
  killSymbolSymbols: {
    description: 'kill symbol symbols',
    manipulators: [
      ['backslash', 'vk_none'],
      ['grave_accent_and_tilde', 'vk_none'],
      ['equal_sign', 'vk_none'],
      ['hyphen', 'vk_none'],
      ['close_bracket', 'vk_none'],
    ]
      .map(unpackBoth)
      .map(addType)
      .map(
        addCondition({
          type: 'variable_if',
          name: 'symbolLayer',
          value: 1,
        }),
      ),
  },
  superSymbols: {
    description: 'superSymbols',
    manipulators: simpleSymbols
      .map(unpackBoth)
      .map(addType)
      .map(
        addCondition({
          type: 'variable_if',
          name: 'symbolLayer',
          value: 1,
        }),
      )
      .map(
        addModifier({
          path: ['from', 'modifiers', 'mandatory'],
          modifier: 'command',
        }),
      )
      .map(
        addModifier({
          path: ['to', 0, 'modifiers'],
          modifier: 'command',
        }),
      ),
  },
  symbols: {
    description: 'symbols',
    manipulators: simpleSymbols
      .map(unpackBoth)
      .map(addType)
      .map(
        addCondition({
          type: 'variable_if',
          name: 'symbolLayer',
          value: 1,
        }),
      ),
  },
  switchLangOnAlt: readJson('switchLangOnAlt.json'),
};

log('done');
log(JSON.stringify(rules.killSymbols, null, '\t'));
const simpleModifications = readJson('simpleModifications.json');
const functionKeys = readJson('functionKeys.json');
insertRulesIntoProdConfig({ rules, simpleModifications, functionKeys });
