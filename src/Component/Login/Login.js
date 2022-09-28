import styles from "./Login.module.css";
import LoginForm from "./LoginForm";
import SignForm from "./SignForm";
import ForgotPassword from "./ForgotPassword";
import { useState } from "react";
function Login() {
  const [loginBehavior, setLoginBehavior] = useState(true);
  const [signinBehavior, setsSigninBehavior] = useState(false);
  const [forgotBehavior, setForgotBehavior] = useState(false);
  const [messStatus, setMessStatus] = useState();
  const UIhandle = ({ mess }, type) => {
    if (type == "signin") {
      setsSigninBehavior(true);
      setLoginBehavior(false);
      setForgotBehavior(false);
    }
    if (type == "forgot") {
      setsSigninBehavior(false);
      setLoginBehavior(false);
      setForgotBehavior(true);
    }
    if (type == "login") {
      setsSigninBehavior(false);
      setLoginBehavior(true);
      setForgotBehavior(false);
      if (mess) {
        setMessStatus(mess);
      }
    }
  };
  return (
    <div className={styles.container}>
      <h1>RTchat</h1>
      <p>Đăng nhập tài khoản RTchat để kết nối với ứng dụng RTchat Web</p>
      {loginBehavior && <LoginForm UIhandle={UIhandle} UIMess={messStatus} />}
      {signinBehavior && <SignForm UIhandle={UIhandle} />}
      {forgotBehavior && <ForgotPassword UIhandle={UIhandle} />}
      <h3>Product by LEVANDAT</h3>
    </div>
  );
}

export default Login;
