import React from 'react';
import ReactFlagsSelect from 'react-flags-select';
// const InputField = ({ warning, onChange, type, label }) => (
//   <div className="sign-field">
//     <p>{ label }:</p>
//     <input spellCheck='false' {...{ type, onChange } } />
//     <span className="warning">{ warning?.text }</span>
//   </div>
// );

const InputField = ({ type, label }) => (
  <div className="sign-field">
    <p>{ label }:</p>
    <input spellCheck='false' {...{ type} } />
    {/* <span className="warning">{ warning?.text }</span> */}
  </div>
);

export default function Register() {
  const verifiers = {
    username: {
      pattern: /^[^#%\?\s/]{5,20}$/,
      warning: 'Username should be from 5 to 20 characters, without spaces or special characters',
    },
    email: {
      pattern: /^([a-z_\d\.-]+)@([a-z\d]+)\.([a-z]{2,8})(\.[a-z]{2,8})*$/,
      warning: 'Invalid email address'
    },
    birthday: {
      pattern: /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/([0-9]{4})$/,
      warning: 'Birth date should be entered in DD/MM/YYYY format'
    },
    password: {
      pattern: /^[\S]{8,20}$/,
      warningRegExp: 'Password should be from 8 to 20 symbols and without spaces',
    }
  };

  return (
    <div>
      <InputField type='text' label='Username' />
      <InputField type='email' label='Email' />
      <div>
        <p>Gender:</p>
        <div>
          <input type='radio' />Female
        </div>
        <div>
          <input type='radio' /> Male
        </div>
      </div>
      <InputField type='text' label='Birthday (DD/MM/YYYY)' />
      <div>
        <p>Country:</p>
        <ReactFlagsSelect fullWidth={false} />
      </div>
      <InputField type='password' label='Password' />
      <InputField type='password' label='Password (confirm)' />
      <input type='submit' value="Register" disabled={true} />
    </div>
  );
}
