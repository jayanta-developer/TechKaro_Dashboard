import React, { useState } from "react";

//images
import { Image } from "../../assets/Images";
//components
import { AppBtn } from "../AppButton";

export default function CategorySection() {
  const ActivePage = localStorage.getItem("ActivePage");
  const [createCategoryPop, setCreateCategoryPop] = useState(false);

  return (
    <div
      className={
        ActivePage === "Category"
          ? "mainBox mainBoxActive noScroll_Line"
          : "mainBox noScroll_Line"
      }
    >
      <div className="addSection">
        <p className="sectionHeader">All Category</p>
        <AppBtn
          btnText="Add Blog"
          icon={Image.addIcon}
          onClick={() => setCreateCategoryPop(true)}
        />
      </div>

      <div className="sectionOutBox">
        {/* ------------Create ------------------ */}
        <div
          style={{ display: createCategoryPop ? "block" : "none" }}
          className="section createBox"
        ></div>
      </div>
    </div>
  );
}
