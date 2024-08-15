import React, { useEffect, useState } from "react";
import profileFile from "../../assets/profile/Personal Profile.pdf";
import liff from "@line/liff";

const Profile = () => {
  const LIFF_ID = process.env.REACT_APP_LIFF_ID;
  const [user, setUser] = useState();
  useEffect(() => {
    console.log("LIFF_ID", LIFF_ID);
    liff
      .init({ liffId: "2006066572-J30jR9kB" })
      .then(() => {
        console.log("LIFF initialized");
        getUser();
      })
      .catch((err) => {
        console.error("LIFF Initialization failed", err);
      });
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = () => {
    liff
      .getProfile()
      .then((profile) => {
        const name = profile.displayName;
        setUser(name);
      })
      .catch((err) => {
        console.log("get profile error", err);
      });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <p>{user}</p>
      <iframe
        src={profileFile}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PDF Viewer"
      />
    </div>
  );
};

export default Profile;
