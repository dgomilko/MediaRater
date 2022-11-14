export const signInVerifiers = {
  validations: {
    email: {
      pattern: /^([a-z_\d\.-]+)@([a-z\d]+)\.([a-z]{2,8})(\.[a-z]{2,8})*$/,
      warning: 'Invalid email address'
    },
    password: {
      pattern: /^[\S]{8,20}$/,
      warning: 'Password should be from 8 to 20 symbols and without spaces',
    },
  }
}
