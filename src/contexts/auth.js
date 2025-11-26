import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { getUser, signIn as sendSignInRequest } from "../api/auth";

function AuthProvider(props) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  console.log(user);
  useEffect(() => {
    (async function () {
      // const result = await getUser();
      // console.log("AuthProvider>>", result);
      // if (result.isOk) {
      //   setUser(result.data);
      // }
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (login, password) => {
    const result = await sendSignInRequest(login, password);
    if (result.isOk) {
      setUser(result.data);
    }
    return result;
  }, []);

  const signOut = useCallback(() => {
    setUser(undefined);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, loading }}
      {...props}
    />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
