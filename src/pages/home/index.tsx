import { useState } from "react";
import "./style.css";

//components
import SideMenu from "../../Components/SideMenu";

//section
import CategorySection from "../../Components/CategorySection";

import { ToastContainer } from "react-toastify";

export interface activePageProps {
  activePage: string;
}

export default function Home() {
  const [activePage, setActivePage] = useState<string>("Product");
  console.log(activePage);

  return (
    <>
      <div className="dashboardMainSection">
        <ToastContainer />
        <SideMenu setActivePage={setActivePage} />
        <div className="mainSection">
          {/* Blog */}
          <CategorySection />
        </div>
      </div>
    </>
  );
}
