import { signInVerifiers } from "./signInVerifiers";

export const signUpVerifiers = {
  validations: {
    ...signInVerifiers.validations,
    name: {
      pattern: /^[^#%\?\s/]{5,20}$/,
      warning: 'Username should be from 5 to 20 characters, without spaces or special characters',
    },
    birthday: {
      pattern: /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\.(0[1-9]|1[0-2])\.([0-9]{4})$/,
      warning: 'Birth date should be entered in DD.MM.YYYY format'
    },
    passwordConf: {
      custom: (val, data) => val === data.password,
      warning: 'Passwords should match',
    },
    country: {
      required: true,
      warning: 'You need to select a country from the list'
    },
    gender: {
      required: true,
      warning: 'You need to select a gender'
    },
  },
  defaults: {
    country: 'Ukraine',
    gender: 'f',
  }
};
