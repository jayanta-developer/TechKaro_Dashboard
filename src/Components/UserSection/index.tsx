import React, { useEffect, useState } from 'react'
import "./style.css"

//images
import { Image } from '../../assets/Images';

//components
import { Loader, GoTop } from "../Tools";
import { AppBtn } from "../AppButton";
// import RichTextEditor from "../TextEditor/"


import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Store/store";
import { FetchUsers } from "../../Store/userSlice";

export default function UserSection() {
  const ActivePage = localStorage.getItem("ActivePage");
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.user);
  // const [loding, setLoading] = useState(false);
  const [userPop, setUserPop] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>()

  const currentUser = data?.find((val) => val?._id === currentUserId);

  const handleClosePop = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id === "grayBox") {
      setUserPop(false);
    }
  };

  const openEmail = (email: string | undefined) => {
    window.open(`mailto:${email}`, '_blank');
  };
  const callPhone = (phoneNumber: string | undefined) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };
  const copyToClipboard = (text: string | undefined) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Copied to clipboard:', text);
        })
        .catch((err) => {
          console.error('Failed to copy:', err);
        });
    }
  };

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
        <Loader loding={status === "loading" ? true : false} />

        {/* User pop */}
        <div
          onClick={handleClosePop}
          style={{ display: userPop ? "flex" : "none" }} className="grayBox" id="grayBox">
          <div className="PopBox">
            <div className="inutBox">
              <p className="inputLabel">Name</p>
              <input
                className="inputField"
                type="text"
                value={currentUser?.name}
                disabled={true}
              />

            </div>
            <div className="inutBox">
              <p className="inputLabel">Email</p>
              <input
                className="inputField"
                type="text"
                value={currentUser?.email}
                disabled={true}
              />
              <div className="inputClickBox">
                <img onClick={() => openEmail(currentUser?.email)} src={Image.mailIcon} alt="" />
                <img src={Image.copyIcon} alt="" onClick={() => copyToClipboard(currentUser?.number)} />
              </div>
            </div>
            <div className="inutBox">
              <p className="inputLabel">Phone Number</p>
              <input
                className="inputField"
                type="text"
                value={currentUser?.number}
                disabled={true}
              />
              <div className="inputClickBox">
                <img src={Image.callIcon} onClick={() => callPhone(currentUser?.number)} alt="" />
                <img src={Image.copyIcon} alt="" onClick={() => copyToClipboard(currentUser?.number)} />
              </div>
            </div>
            <div className="inutBox">
              <p className="inputLabel">Subject</p>
              <input
                className="inputField"
                type="text"
                value={currentUser?.subject}
                disabled={true}
              />
            </div>
            <div className="inutBox">
              <p className="inputLabel">Message</p>
              <textarea
                className="inputField"
                name="title"
                value={currentUser?.message}
                disabled={true}
              />
            </div>

          </div>
        </div>

        {/* /Top nav */}
        <div className="addSection">
          <p className="sectionHeader">All Users</p>
        </div>
        <div className="userList">
          {
            data?.map((el, i: number) => (
              <div key={i} className="UserBox">
                <img className='viewIcon' src={Image.openIcon} alt="" onClick={() => {
                  setUserPop(true)
                  setCurrentUserId(el?._id)
                }} />
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
