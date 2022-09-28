import styles from "./PhoneBookList.module.css";
import request from "../../utils/request";
import FriendsInfo from "./FriendInfo";
import { useEffect, useState, useContext } from "react";
import { SocketContext } from "../../index";
import Cookies from "js-cookie";
function PhoneBookList({ message, active }) {
  const [friends, setFriends] = useState([]);
  //console.log(friends);
  const socket = useContext(SocketContext);
  socket.on("friendsOff", (friendName) => {
    let temp = [];
    friends.map((item) => {
      if (item.userName == friendName) {
        temp.push({
          ...item,
          isOnline: false,
        });
      } else {
        temp.push({
          ...item,
          isOnline: item.isOnline,
        });
      }
    });
    setFriends(temp);
  });
  socket.on("resOnlineFriends", (friendsList) => {
    setFriends(friendsList);
  });
  socket.on("friendIsOnline", (friendName) => {
    let temp = [];
    friends.map((item) => {
      if (item.userName == friendName) {
        temp.push({
          ...item,
          isOnline: true,
        });
      } else {
        temp.push({
          ...item,
          isOnline: item.isOnline,
        });
      }
    });
    setFriends(temp);
  });
  useEffect(() => {
    async function fetch() {
      {
        const res = await request.post("user/friends");
        //console.log(res);
        if (res.data.friends) {
          setFriends(res.data.friends);
          socket.emit("getOnlineFriends", res.data.friends);
        }
        if (res.data.isAuth == false) {
          window.location.reload();
        }
      }
    }
    fetch();
  }, []);
  async function getObjId() {
    const res = await request.post("user/objId");
    if (res.data.isAuth == false) {
      window.location.reload();
    }
    if (res.data._id) {
      return res.data._id;
    }
  }
  const handelDeleteFriend = (userName) => {
    let temp = [...friends];
    temp = temp.filter((item) => {
      if (item.userName == userName && Cookies.get("_data")) {
        //console.log(item);
        socket.emit(
          "userDeleteFriend",
          item._id,
          JSON.parse(Cookies.get("_data").replace("j:", ""))._id
        );
        return false;
      }
      return true;
    });
    setFriends(temp);
  };
  return (
    <div className={styles.container}>
      <p>{`Danh sách liên hệ(${friends.length})`}</p>
      {friends &&
        friends.map((item) => {
          let mess = {
            _id: getObjId(),
            contact: [
              { userName: item.userName, _id: item._id, image: item.image },
            ],
            contents: [],
            newMessage: {
              userId: "",
              count: 0,
            },
          };
          message.map((i) => {
            if (i.contact[0]._id == item._id) {
              mess = i;
            }
          });
          return (
            <FriendsInfo
              search={false}
              active={mess._id == active ? true : false}
              key={item._id}
              data={item}
              message={mess}
              onDelete={(userName) => {
                handelDeleteFriend(userName);
              }}
            />
          );
        })}
    </div>
  );
}

export default PhoneBookList;
