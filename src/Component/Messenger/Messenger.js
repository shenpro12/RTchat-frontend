import styles from "./Messenger.module.css";
import SearchInput from "../SearchUser/SearchUser";
function Messenger({ active }) {
  return (
    <div className={styles.container}>
      <SearchInput placehoder="Tìm kiếm" type="mess" active={active} />
    </div>
  );
}

export default Messenger;
