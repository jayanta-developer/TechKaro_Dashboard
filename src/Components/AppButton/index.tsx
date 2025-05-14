import React from "react";
import "./style.css";

interface btnProps {
  btnText: string;
  bgColor?: string;
  width?: string;
  height?: string;
  textColor?: string;
  icon?: string;
  onClick?: () => void;
}

export const AppBtn: React.FC<btnProps> = ({
  btnText,
  bgColor,
  width,
  height,
  textColor,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="appBtn"
      style={{
        width,
        minHeight: height || "50px",
        background: bgColor || "#0D203B",
      }}
    >
      <p style={{ color: textColor || "#fff" }}>{btnText}</p>
      {icon ? <img src={icon} alt="" /> : null}
    </div>
  );
};

export const AppHoloBtn: React.FC<btnProps> = ({
  btnText,
  bgColor,
  width,
  height,
  textColor,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="appBtn appholorBtn"
      style={{
        width,
        minHeight: height || "50px",
        background: bgColor,
      }}
    >
      <p style={{ color: textColor || "#fff" }}>{btnText}</p>
      {icon ? <img style={{ width: "19px" }} src={icon} alt="" /> : null}
    </div>
  );
};

export const AppOrangeBtn: React.FC<btnProps> = ({
  btnText,
  bgColor,
  width,
  height,
  textColor,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="appBtn orangeBtn"
      style={{
        width,
        minHeight: height || "50px",
        background: bgColor || "#0D203B",
      }}
    >
      <p style={{ color: textColor || "#fff" }}>{btnText}</p>
      {icon ? <img src={icon} alt="" /> : null}
    </div>
  );
};

export const AddMoreBtn = ({ btnText, icon, onClick }: btnProps) => {
  return (
    <div className="addMoreBtn" onClick={onClick}>
      <img src={icon} alt="" />
      <p>{btnText}</p>
    </div>
  );
};

export const RemoveBtn = ({ btnText, icon, onClick }: btnProps) => {
  return (
    <div className="addMoreBtn removeBtn" onClick={onClick}>
      <img style={{width:"32px"}} src={icon} alt="" />
      <p>{btnText}</p>
    </div>
  );
};
