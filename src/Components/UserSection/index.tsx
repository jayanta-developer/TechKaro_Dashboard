import React, { useEffect, useState } from 'react'
import "./style.css"

//components
import { Loader, GoTop } from "../Tools";
import { AppBtn } from "../AppButton"

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Store/store";
import { FetchUsers } from "../../Store/userSlice";

export default function UserSection() {
  const ActivePage = localStorage.getItem("ActivePage");
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.user);
  const [loding, setLoading] = useState(false);

  useEffect(() => {
    dispatch(FetchUsers());
    if (data?.length < 0) {
      dispatch(FetchUsers());
    }
  }, []);
  return (
    <>
      <div
        className={
          ActivePage === "User"
            ? "mainBox mainBoxActive noScroll_Line"
            : "mainBox noScroll_Line"
        }
      >
        {/* Loader */}
        <Loader loding={loding || status === "loading" ? true : false} />

        {/* /Top nav */}
        <div className="addSection">
          <p className="sectionHeader">All Users</p>
        </div>
        <div className="userList">
          {
            data?.map((el, i: number) => (
              <div key={i} className="UserBox">
                <h4>{el.name}</h4>
                <p>{el.email}</p>
                <p>{el.number}</p>
              </div>
            ))
          }
        </div>



      </div></>
  )
}
