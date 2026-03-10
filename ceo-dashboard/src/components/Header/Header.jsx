import React from "react";
import "./Header.css";

import { FiBell } from "react-icons/fi";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";

const Header = () => {
  return (
    <div className="header">

      {/* LEFT SIDE */}
      <div className="header-left">
        <div className="logo-box">VG</div>
        <h2 className="title">
          Vishwaguru Infotech Pvt Ltd <span>CEO Dashboard</span>
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div className="header-right">

        <div className="icon-box notification">
          <MdOutlineNotificationsNone />
          <span className="badge">1</span>
        </div>

        <div className="profile">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
          />
          <IoChevronDown />
        </div>

      </div>

    </div>
  );
};

export default Header;  