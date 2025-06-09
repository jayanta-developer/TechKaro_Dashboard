import "./style.css";
import { useEffect } from "react";

//images
import { Image } from "../../assets/Images";


export const Reloader = (del: number) => {
  setTimeout(() => {
    window.location.reload();
  }, del);
};

export const GoTop = () => {
  const element = document.querySelector(
    ".mainBoxActive"
  ) as HTMLElement | null;
  if (element) {
    element.scrollTo({ top: 0, behavior: "smooth" });
  }
};

interface loadingProps {
  loding: boolean;
}
export const Loader = ({ loding }: loadingProps) => {
  useEffect(() => {
    const element = document.querySelector(".mainBoxActive") as HTMLElement;

    if (element) {
      if (loding) {
        element.style.overflow = "hidden";
      } else {
        element.style.overflow = "scroll";
      }
    }
  }, [loding]);

  return (
    <div className={loding ? "loaderBox ActiveloaderBox" : "loaderBox"}>
      <img src={Image.loaderImg} alt="loader" />
    </div>
  );
};

interface dropProps {
  setDropVal: any;
  list?: (string | number)[];
  defaultVal?: string;
  width?: string;
}
export const DropBox = ({ setDropVal, list, defaultVal, width }: dropProps) => {
  return (
    <>
      <select
        id="drop"
        style={{ width: width || "100%" }}
        className="DropBox"
        onChange={(e) => setDropVal(e.target.value)}
        defaultValue="hello"
      >
        <option value="">{defaultVal}</option>
        {list?.map((el, i: number) => (
          <option key={i} value={el}>
            {el}
          </option>
        ))}
      </select>
    </>
  );
};

interface ratingStar {
  rating: string;
}

export const GiveStar = ({ rating }: ratingStar) => {
  const fullStar = Image.FullStar;
  const halfStar = Image.HulfStar;
  const emptyStar = Image.EmptyStar;

  const ratingValue = parseFloat(rating);
  const fullCount = Math.floor(ratingValue);
  const hasHalf = ratingValue - fullCount >= 0.5;
  const emptyCount = 5 - fullCount - (hasHalf ? 1 : 0);

  const stars: string[] = [
    ...Array(fullCount).fill(fullStar),
    ...(hasHalf ? [halfStar] : []),
    ...Array(emptyCount).fill(emptyStar),
  ];

  return (
    <div className="starBox">
      {stars.map((star, index) => (
        <img key={index} src={star} alt={`star-${index}`} />
      ))}
    </div>
  );
};
