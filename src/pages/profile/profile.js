import React, { useEffect } from "react";
// import profileFile from "../../assets/profile/Personal Profile.pdf";
import page1 from "../../assets/profile/Slide1.PNG";
import page2 from "../../assets/profile/Slide2.PNG";
import page3 from "../../assets/profile/Slide3.PNG";
import page4 from "../../assets/profile/Slide4.PNG";
// import liff from "@line/liff";

const Profile = ({ user }) => {
  const LIFF_ID = process.env.REACT_APP_LIFF_ID;
  const pageList = [page1, page2, page3, page4];
  //   const [user, setUser] = useState();
  useEffect(() => {
    console.log("LIFF_ID", LIFF_ID);
    // liff
    //   .init({ liffId: "2006066572-J30jR9kB" })
    //   .then(() => {
    //     console.log("LIFF initialized");
    //     getUser();
    //   })
    //   .catch((err) => {
    //     console.error("LIFF Initialization failed", err);
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   const getUser = () => {
  //     liff
  //       .getProfile()
  //       .then((profile) => {
  //         const name = profile.displayName;
  //         setUser(name);
  //       })
  //       .catch((err) => {
  //         console.log("get profile error", err);
  //       });
  //   };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <p>{user && `Hi ${user}, please check my profile below:`}</p>
      {pageList.map((list, index) => (
        <img
          src={list}
          alt={`page${index}`}
          width={"100%"}
          style={{ paddingBottom: 4 }}
        ></img>
      ))}
    </div>
  );
};

export default Profile;
