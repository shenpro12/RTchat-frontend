import styles from "./FindHistory.module.css";
import request from "../../utils/request";
import UserInfo from "../PhoneBookList/FriendInfo";
import { useEffect, useState } from "react";

function FindHistory({ message }) {
  const [searchData, setSearchData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await request.post("user/searchhistories");
      //console.log(res);

      if (res.data.isAuth == false) {
        window.location.reload();
      }
      if (res.data.data.length) {
        setSearchData(res.data.data);
      }
    })();
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
  const handelDelete = async (userName) => {
    const res = await request.post("user/searchhistories/delete", {
      data: {
        userName,
      },
    });
    if (res.data.isAuth == false) {
      window.location.reload();
    }
    if (res.data.status) {
      let temp = [...searchData];
      temp = temp.filter((item) => {
        if (item.userName == userName) {
          return false;
        }
        return true;
      });
      setSearchData(temp);
    }
  };
  const deleteAllHistory = async () => {
    const res = await request.post("user/searchhistories/deleteall");
    if (res.data.isAuth == false) {
      window.location.reload();
    }
    if (res.data.status) {
      setSearchData([]);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.findHeader_container}>
        <p>Tìm gần đây</p>
        {searchData.length ? (
          <p
            className={styles.deleteHistory_btn}
            onClick={() => {
              deleteAllHistory();
            }}
          >
            Xóa tất cả
          </p>
        ) : (
          ""
        )}
      </div>
      {searchData.length ? (
        searchData.map((item, index) => {
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
            if (i.contact[0]._id == item.userId) {
              mess = i;
            }
          });
          return (
            <UserInfo
              search={true}
              key={index}
              data={item}
              other={true}
              message={mess}
              onDelete={(userName) => {
                handelDelete(userName);
              }}
            />
          );
        })
      ) : (
        <p>Không có lịch sử tìm kiếm</p>
      )}
    </div>
  );
}

export default FindHistory;
