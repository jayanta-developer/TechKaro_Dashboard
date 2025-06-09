import { useState } from "react";
import "./style.css";

//images
import { Image } from "../../assets/Images";

type SidebarProps = {
  setActivePage: any;
};

export default function SideMenu({ setActivePage }: SidebarProps) {
  const [sideMenu, setSideMenu] = useState<boolean>(true);
  const ActivePage = localStorage.getItem("ActivePage");

  if (!ActivePage) {
    localStorage.setItem("ActivePage", "Category");
    setActivePage("Category");
  }

  const HandleActivePage = (page: string) => {
    localStorage.setItem("ActivePage", page);
    setActivePage(page);
  };

  const sideMenuList = [
    {
      title: "Category",
      icon: Image.categroyIcon,
      ActiveIcon: Image.categroy_AIcon,
    },
    {
      title: "Product",
      icon: Image.productIcon,
      ActiveIcon: Image.product_AIcon,
    },
    {
      title: "Blogs",
      icon: Image.blogIcon,
      ActiveIcon: Image.blogActiveIcon,
    },
    {
      title: "User",
      icon: Image.userIcon,
      ActiveIcon: Image.user_AIcon,
    },
    {
      title: "Rviews",
      icon: Image.reviewIcon,
      ActiveIcon: Image.reviewIcon_A,
    },
    {
      title: "Settings",
      icon: Image.settringIcon,
      ActiveIcon: Image.settring_AIcon,
    },
  ];

  return (
    <>
      <div className={sideMenu ? "sideMenu sideMenuActive" : "sideMenu"}>
        <div className="clogBox">
          {sideMenu ? (
            <img alt="Clogo" src={Image.Clog} />
          ) : (
            <div className="Clog_Box">
              <p>
                NB<samp>S</samp>
              </p>
            </div>
          )}
        </div>
        <div
          className={
            sideMenu
              ? "sideMenuItem_Box"
              : "sideMenuItem_Box sideMenuItem_Box_C"
          }
        >
          {sideMenuList?.map((sm, i) => (
            <div
              key={i}
              className={
                ActivePage === sm.title
                  ? "sideMenuItem ActiveSideMenuItem"
                  : "sideMenuItem"
              }
              onClick={() => HandleActivePage(sm.title)}
            >
              <img
                src={ActivePage === sm.title ? sm.ActiveIcon : sm.icon}
                alt=""
              />
              <p style={{ display: sideMenu ? "block" : "none" }}>{sm.title}</p>
            </div>
          ))}
        </div>
        <div
          className={
            sideMenu ? "menuActionBtn menuActionBtnActive" : "menuActionBtn"
          }
          onClick={() => setSideMenu(!sideMenu)}
        >
          {sideMenu ? (
            <img src={Image.crossIcon} alt="" />
          ) : (
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/ios-filled/50/44465a/forward--v1.png"
              alt="forward--v1"
            />
          )}
          {sideMenu && <p>Close Menu</p>}
        </div>
      </div>
    </>
  );
}
