import styles from "./Loading.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Loading() {
  return (
    <div className={styles.container}>
      <div>
        <p className={styles.center}>Loading</p>
        <FontAwesomeIcon icon={faSpinner} className={styles.center} spin />
      </div>
    </div>
  );
}

export default Loading;
