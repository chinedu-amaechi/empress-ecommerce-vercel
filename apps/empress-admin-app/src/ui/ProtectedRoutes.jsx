import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { checkAuthentication } from "../services/authentication";

function ProtectedRoutes({ children }) {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const token = sessionStorage.getItem("token");
      if (token) {
        const response = await checkAuthentication({ token });
        console.log(response);
        if (response.status === 200) {
          setUser(response.data.user);
          return;
        } else {
          navigate("/login");
        }
      } else if (user) {
        return;
      } else {
        navigate("/login");
      }
    }
    checkUser();
  }, []);
  return <>{children}</>;
}

export default ProtectedRoutes;
