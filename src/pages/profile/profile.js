import React, { useEffect } from "react";
import profileFile from "../../assets/profile/Personal Profile.pdf";
import liff from "@line/liff";

const Profile = () => {
  const LIFF_ID = process.env.REACT_APP_LIFF_ID;
  useEffect(() => {
    liff
      .init({ liffId: { LIFF_ID } })
      .then(() => {
        console.log("LIFF initialized");
      })
      .catch((err) => {
        console.error("LIFF Initialization failed", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
