import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from "react";
import brain from "/brain.png";
import { navigation } from "../constants";

const Navbar = () => {
  const stringToBool = (str) => {
    if (typeof str === "string") {
      str = str.toLowerCase();

      if (str === "true" || str === "1") {
        return true;
      } else if (str === "false" || str === "0") {
        return false;
      }
    }

    return false;
  };
  const { pathname } = useLocation();
  const [isAuth, setIsAuth] = useState(
    stringToBool(localStorage.getItem("isLoggedIn"))
  );
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = stringToBool(localStorage.getItem("isLoggedIn"));
    setIsAuth(authStatus);
  }, [pathname]);

  const handleLogout = () => {
    console.log("Hi");
    navigate("/signin");
    localStorage.removeItem("isLoggedIn");
    setIsAuth(false);
  };

  return (
    <div className="static w-full top-0 bg-eh-5 z-50">
      <div className="flex items-center px-5 py-5">
        <Link
          className="flex justify-center items-center font-oswald w-[12rem] text-white font-medium text-2xl hover:text-eh-22"
          to="/"
        >
          <img src={brain} width={48} height={40} alt="EpiCareHub" />
          EpiCareHub
        </Link>
        <nav
          className={`flex top-[5rem] left-0 right-0 bottom-0 static mx-auto`}
        >
          <div className="relative z-2 flex items-center justify-center m-auto flex-row">
            {navigation.map((item) => {
              if (isAuth === item.isAuth) {
                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    className={`block relative font-oswald uppercase text-eh-1 transition-colors hover:text-eh-22 px-6 ${
                      pathname?.includes(item.name)
                        ? "z-10 text-eh-22"
                        : "text-eh-1"
                    } hover:text-eh-1`}
                  >
                    {item.title}
                  </Link>
                );
              }
              return null; // Add this line to handle non-matching items
            })}
          </div>
        </nav>
        <div className="flex gap-2">
          {isAuth && (
            <Link
              className={`flex justify-center items-center font-oswald uppercase text-eh-1 transition-colors hover:text-eh-22 text-eh-1 hover:text-eh-1`}
              onClick={handleLogout}
            >
              <LogoutIcon />
              Logout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
