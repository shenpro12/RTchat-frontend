import SideBarNav from "./Component/SidebarNav/SidebarNav";
import styles from "./App.module.css";
import Login from "./Component/Login/Login";
import request from "./utils/request";
import { useState, createContext, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
export const loginContext = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  useLayoutEffect(() => {
    async function fetch() {
      const res = await request.post("token/verify");
      if (res.data.isAuth) {
        setLogin(true);
      } else {
        setLoading(false);
        setLogin(false);
      }
    }
    fetch();
  }, []);

  const logOut = () => {
    setLogin(false);
  };

  if (login) {
    return (
      <loginContext.Provider value={logOut}>
        <SideBarNav />
      </loginContext.Provider>
    );
  } else {
    return loading ? (
      <div className={styles.loadingContainer}>
        <p>Xin chờ trong giây lát</p>
        <FontAwesomeIcon icon={faSpinner} spin className={styles.spin} />
      </div>
    ) : (
      <Login />
    );
  }
}

export default App;
