import { useState, useContext } from 'react';
import useStorage from '../useStorage';
import { UserContext } from '../../contexts/UserContext';
import { authApi } from '../../api/authApi';
import { statuses, messages } from '../../utils/statuses';

export default function useLogoutHandler() {
  const { clearData } = useStorage();
  const [error, setError] = useState();
  const { userState } = useContext(UserContext);

  const handleLogout = async () => {
    if (!userState.token) return;
    const { token } = userState;
    const options = {
      responseHandler: (response, json) => {
        clearData();
        if (response.status >= statuses.BAD_REQUEST) {
          const message = json.message || 'Unknown server error';
          if (message !== messages.EXPIRED)
            throw new Error(message);
        }
      },
      errHandler: e => setError(e)
    };

    await authApi.logout({}, options, token);
  };

  return { handleLogout, error };
};
