import React from "react";
import page1 from "../../assets/profile/Slide1.PNG";
import page2 from "../../assets/profile/Slide2.PNG";
import page3 from "../../assets/profile/Slide3.PNG";
import page4 from "../../assets/profile/Slide4.PNG";
import webLogo from "../../assets/webLogo.png";

const Profile = ({ user }) => {
  const pageList = [page1, page2, page3, page4];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {user === undefined ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img src={webLogo} alt="logo" height={"200vh"}></img>
        </div>
      ) : (
        <>
          <p>{`Hi ${user}, please check my profile below:`}</p>
          {pageList.map((list, index) => (
            <img
              src={list}
              alt={`page${index}`}
              width={"100%"}
              style={{ paddingBottom: 4 }}
            ></img>
          ))}
        </>
      )}
    </div>
  );
};

export default Profile;
