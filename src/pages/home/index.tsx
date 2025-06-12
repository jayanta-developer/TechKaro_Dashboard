import { useState, useEffect } from "react";
import "./style.css";

//components
import SideMenu from "../../Components/SideMenu";
import { toast } from "react-toastify";
import { AppBtn } from "../../Components/AppButton"


//section
import CategorySection from "../../Components/CategorySection";
import ProductSection from "../../Components/ProductSection";
import BlogSection from "../../Components/BlogSection";
import UserSection from "../../Components/UserSection"
import ReviewSection from "../../Components/ReviewSection"

import { ToastContainer } from "react-toastify";

export interface activePageProps {
  activePage: string;
}

export default function Home() {
  const [, setActivePage] = useState<string>("Product");
  const localIsLog = localStorage.getItem("localIsLog");
  const localLogDate = localStorage.getItem("localLogDate");
  const [isLogIng, setIsLogIn] = useState(false);
  const [logVal, setLogVal] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [authErr, setAuthErr] = useState(false);

  const AdminEmails = ["admin@gmail.com", "jd"];
  const PDW = "1234";


  const currentDate = new Date();
  const handleLogValu = (e: any) => {
    const { name, value } = e.target;
    setLogVal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckLog = () => {
    if (AdminEmails.includes(logVal?.email) && PDW === logVal?.password) {
      setAuthErr(false);
      setIsLogIn(true);
      localStorage.setItem("localIsLog", "true");
      localStorage.setItem("localLogDate", currentDate.toLocaleDateString());
      toast.success("Login Successfully");
      return;
    } else {
      toast.warn("Authorization failed");
      setAuthErr(true);
      return;
    }
  };

  document.addEventListener("keydown", (e) =>
    e?.key === "Enter" ? handleCheckLog() : null
  );

  useEffect(() => {
    if (localIsLog === "true") {
      if (currentDate.toLocaleDateString() === localLogDate) {
        setIsLogIn(true);
      } else {
        localStorage.setItem("localIsLog", "false");
      }
    }
  }, []);


  return (
    <>
      <div className="dashboardMainSection">
        <ToastContainer />
        {
          !isLogIng ?
            <>
              <div className="adminLogBox">
                <div className="mainAdminLogBox">
                  <h3>Admin Authentication</h3>

                  <div className="PropInputBox">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      onChange={handleLogValu}
                      value={logVal?.email}
                    />
                  </div>

                  <div className="PropInputBox">
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleLogValu}
                      value={logVal?.password}
                    />
                  </div>
                  <p className={authErr ? "errMsg errMsgActive" : "errMsg"}>
                    Authorization failed!
                  </p>
                  <AppBtn btnText="LOGIN" width="175px" onClick={handleCheckLog} />
                </div>
              </div>
            </> :
            <>
              <SideMenu setActivePage={setActivePage} />
              <div className="mainSection">
                <CategorySection />
                <ProductSection />
                <BlogSection />
                <UserSection />
                <ReviewSection />
              </div></>
        }
      </div>
    </>
  );
}
