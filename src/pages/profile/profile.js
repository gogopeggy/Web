import React from "react";
import page1 from "../../assets/profile/Slide1.PNG";
import page2 from "../../assets/profile/Slide2.PNG";
import page3 from "../../assets/profile/Slide3.PNG";
import page4 from "../../assets/profile/Slide4.PNG";
import webLogo from "../../assets/webLogo.png";
import Stack from "@mui/material/Stack";

const Profile = ({ user }) => {
  const pageList = [page1, page2, page3, page4];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {user === undefined ? (
        <Stack
          direction={"column"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img src={webLogo} alt="logo" height={"200vh"}></img>
          <img
            src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&pause=1000&color=3b699f&center=true&vCenter=true&width=600&height=60&lines=Welcome to Peggyideas!;Be curious, then create your ideas!"
            alt="Typing SVG"
            width={"100%"}
          ></img>
        </Stack>
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
