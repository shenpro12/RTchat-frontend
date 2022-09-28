import styles from "./Setting.module.css";
import request from "../../utils/request";
import LoginHistoriesItem from "./LoginHistoriesItem";
import { useState, useEffect } from "react";
function LoginHistories() {
  const [loginData, setLoginData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await request.post("user/loginhistories");
      //console.log(res);
      if (res.data.data.length) {
        setLoginData(res.data.data);
      }
      if (res.data.isAuth == false) {
        window.location.reload();
      }
    })();
  }, []);
  const logoutFromDevice = async (id) => {
    //console.log(id);
    const res = await request.post("user/loginhistories/logout", {
      data: {
        id,
      },
    });
    if (res.data.status) {
      let temp = loginData.filter((item) => {
        if (item._id == id) {
          return false;
        }
        return true;
      });
      setLoginData(temp);
    }
    if (res.data.isAuth == false) {
      window.location.reload();
    }
  };
  return (
    <div className={styles.LoginHistories_container}>
      {loginData.length
        ? loginData.map((item) => {
            return (
              <LoginHistoriesItem
                key={item._id}
                data={item}
                onLogout={logoutFromDevice}
              />
            );
          })
        : ""}
    </div>
  );
}

export default LoginHistories;
