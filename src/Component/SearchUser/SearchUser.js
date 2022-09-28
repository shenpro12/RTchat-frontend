import styles from "./SearchUser.module.css";
import FindHistory from "../FindHistory/FindHistory";
import FindResult from "../FindHistory/FindResult";
import MessengerHistory from "../MessengerHistory/MessengerHistory";
import NotificationItem from "../Notifications/NotificationItem";
import PhoneBookList from "../PhoneBookList/PhoneBookList";
import request from "../../utils/request";
import { SocketContext } from "../../index";
import { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
function SearchUser(props) {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState();
  const [close, setClose] = useState(false);
  const [message, setMessage] = useState([]);
  const [refeshMessage, setRefeshMessage] = useState(false);
  const clearInput = useRef();
  const input = useRef();
  const socket = useContext(SocketContext);
  socket.on("friendSendMessage", (res) => {
    setRefeshMessage(!refeshMessage);
  });
  socket.on("seeDone", () => {
    setRefeshMessage(!refeshMessage);
  });
  useEffect(() => {
    if (!inputText) {
      setResult(false);
      clearInput.current.classList.remove(styles.visible);
      if (close) {
        input.current.focus();
      }
    }
    if (inputText) {
      clearInput.current.classList.add(styles.visible);
      (async () => {
        const res = await request.post("user/profile/search", {
          data: {
            userName: inputText,
          },
        });
        //console.log(res);

        if (res.data.isAuth == false) {
          window.location.reload();
        }
        if (res.data.status) {
          setResult(res.data.info);
        }
        if (!res.data.status) {
          setResult([]);
        }
      })();
    }
  }, [inputText]);
  //console.log(inputText);
  useEffect(() => {
    async function fetch() {
      const res = await request.post("user/message");
      //console.log(res);
      if (res.data.isAuth == false) {
        window.location.reload();
      }
      if (res.data.respone) {
        setMessage(res.data.respone);
      }
    }
    fetch();
  }, [refeshMessage]);
  const handelDeleteMessage = async (id) => {
    const res = await request.post("user/message/delete", {
      data: {
        _id: id,
      },
    });
    //console.log(res);
    //console.log(id);
    if (res.data.isAuth == false) {
      window.location.reload();
    }
    if (res.data.status) {
      let temp = message;
      temp = temp.filter((item) => {
        if (item._id == id) {
          return false;
        }
        return true;
      });
      setMessage(temp);
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.search_Input_Container}>
          <input
            ref={input}
            value={inputText}
            className={styles.search_Input}
            placeholder={props.placehoder}
            onClick={() => setClose(true)}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          />
          <FontAwesomeIcon
            ref={clearInput}
            title="Xóa"
            icon={faClose}
            className={styles.clear_search}
            onClick={() => {
              setInputText("");
            }}
          />
        </div>
        {close && (
          <p
            className={styles.close_btn}
            onClick={() => {
              setClose(false);
              setInputText("");
            }}
          >
            Đóng
          </p>
        )}
      </div>
      {close && !result && <FindHistory message={message} />}
      {close && result && (
        <FindResult data={result} text={inputText} message={message} />
      )}
      {!close && props.type === "mess" && (
        <MessengerHistory
          message={message}
          setMessage={handelDeleteMessage}
          active={props.active}
        />
      )}
      {!close && props.type === "phoneBook" && (
        <PhoneBookList message={message} active={props.active} />
      )}
      {!close && props.type === "notification" && <NotificationItem />}
    </>
  );
}

export default SearchUser;
