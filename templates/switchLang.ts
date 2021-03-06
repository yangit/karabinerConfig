export default {
  description: 'switch language with one button',
  manipulators: [
    {
      from: {
        key_code: 106,
      },
      to: [
        {
          select_input_source: {
            language: 'ru',
          },
        },
        {
          set_variable: {
            name: 'workman',
            value: 0,
          },
        },
      ],
      type: 'basic',
    },
    {
      from: {
        key_code: 105,
      },
      to: [
        {
          select_input_source: {
            language: 'en',
          },
        },
        {
          set_variable: {
            name: 'workman',
            value: 0,
          },
        },
      ],
      type: 'basic',
    },
    // {
    //     from: {
    //         key_code: 'equal_sign',
    //     },
    //     to: [
    //         {
    //             select_input_source: {
    //                 language: 'en',
    //             },
    //         },
    //         {
    //             set_variable: {
    //                 name: 'workman',
    //                 value: 1,
    //             },
    //         },
    //     ],
    //     type: 'basic',
    // },
  ],
};
