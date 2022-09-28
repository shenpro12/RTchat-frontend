import styles from "./Notifications.module.css";
import SearchInput from "../SearchUser/SearchUser";
function Notification() {
  return (
    <div className={styles.container}>
      <SearchInput placehoder="Tìm kiếm" type="notification" />
    </div>
  );
}

export default Notification;
