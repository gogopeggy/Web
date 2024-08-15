import React from "react";
import page1 from "../../assets/profile/Slide1.PNG";
import page2 from "../../assets/profile/Slide2.PNG";
import page3 from "../../assets/profile/Slide3.PNG";
import page4 from "../../assets/profile/Slide4.PNG";

const Profile = ({ user }) => {
  const pageList = [page1, page2, page3, page4];

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
