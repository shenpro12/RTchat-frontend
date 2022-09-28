import styles from "./PhoneBook.module.css";
import SearchInput from "../SearchUser/SearchUser";
function PhoneBook({ active }) {
  return (
    <div className={styles.container}>
      <SearchInput placehoder="Tìm kiếm" type="phoneBook" active={active} />
    </div>
  );
}

export default PhoneBook;
