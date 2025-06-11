import { useEffect, useState } from 'react';
import "./style.css"
//images
import { Image } from '../../assets/Images';
//compnents
import { Loader, GoTop, GiveStar, DropBox } from "../Tools";
import { AppBtn, AppHoloBtn, AppOrangeBtn } from "../AppButton";
import { toast } from "react-toastify";




import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Store/store";
import type { ReviewDataType } from "../../Store/reviewSlice"
import { FetchReview, UpdateReview, DeleteReview } from "../../Store/reviewSlice"

export default function ReviewSection() {
  const ActivePage = localStorage.getItem("ActivePage");
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.review);

  const [loding, setLoading] = useState(false);
  const [createReviewPop, setCreateReviewPop] = useState(false);
  const [reviewPop, setReviewPop] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string>();
  const ratingList = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"]
  const [reviewLocVal, setReviewLocVal] = useState(
    { userName: "", review: "", }
  );
  const [rating, setRating] = useState<string>();
  const [reviewStatus, setReviewStatus] = useState<string>("Panding");
  const statusList = ["Panding", "Approve"];
  //dalete
  const [deletePop, setDeletePop] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string>();
  const currentReview = data?.find((val) => val?._id === currentReviewId);


  useEffect(() => {
    setReviewLocVal((prv) => ({
      ...prv,
      userName: currentReview?.userName || "",
      review: currentReview?.review || ""
    }))
  }, [currentReview])



  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewLocVal((prv) => ({
      ...prv,
      [name]: value
    }))
  }
  const handleClosePop = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.id === "grayBox") {
      setReviewPop(false);
    }
  };

  //update review
  const updateReview = () => {
    setLoading(true)
    if (!currentReviewId) {
      toast.warn("Id not found !")
      setLoading(false)
      return;
    }

    dispatch(UpdateReview({
      id: currentReviewId,
      data: {
        userName: reviewLocVal?.userName,
        review: reviewLocVal?.review,
        ...(rating && {
          rating: rating
        }),
        ...(reviewStatus && {
          status: reviewStatus
        })
      }
    }))

  }


  ///Delte Review----------------------------------
  const DeletePopOpen = (id: string | undefined) => {
    GoTop();
    setDeleteCategoryId(id);
    setDeletePop(true);
  };
  const HandleDeleteReview = () => {
    if (!deleteCategoryId) {
      toast.warn("Id not found !")
      return;
    }
    dispatch(DeleteReview(deleteCategoryId))
  }


  useEffect(() => {
    dispatch(FetchReview());
    if (data?.length < 0) {
      dispatch(FetchReview());
    }
  }, []);
  return (
    <>
      <div
        className={
          ActivePage === "Rviews"
            ? "mainBox mainBoxActive noScroll_Line"
            : "mainBox noScroll_Line"
        }
      >
        {/* Loader */}
        <Loader loding={loding || status === "loading" ? true : false} />
        {/* /Top nav */}

        {/* User pop */}
        <div
          onClick={handleClosePop}
          style={{ display: reviewPop ? "flex" : "none" }} className="grayBox" id="grayBox">
          <div className="PopBox reviewpop">
            <div className="inToIn">
              <p className="inputLabel">Name</p>
              <input
                className="inputField"
                type="text"
                name="userName"
                placeholder="Enter Your Name"
                value={reviewLocVal?.userName}
                onChange={handleReviewChange}
              />
            </div>

            <div className="inToIn">
              <p className="inputLabel">Give Your Review</p>
              <textarea
                className="inputField"
                name="review"
                placeholder="Enter Your Review"
                value={reviewLocVal?.review}
                onChange={handleReviewChange}
              />
            </div>
            <div className="inputTowBox">


              <div className="rating_Box">
                <p className="inputLabel">Rating</p>
                <GiveStar rating={rating ? rating : currentReview?.rating || "1"} />
                <DropBox setDropVal={setRating} list={ratingList} defaultVal={currentReview?.rating} />
              </div>
              <div className="rating_Box">
                <p className="inputLabel">Status</p>
                <DropBox setDropVal={setReviewStatus} list={statusList} defaultVal="Select" />
              </div>
            </div>

            <div className="btnBox">
              <AppBtn btnText='Submit' onClick={updateReview} />
            </div>
          </div>
        </div>


        {/* ---------Delete pop */}
        <div className={deletePop ? "grayBox ActiveGrayBox" : "grayBox"}>
          <div className="popBox">
            <h3>You want to delete this Review ?</h3>
            <div className="popBtnBox">
              <AppHoloBtn btnText="Cancel" onClick={() => setDeletePop(false)} />
              <AppOrangeBtn btnText="Delete" onClick={HandleDeleteReview} />
            </div>
          </div>
        </div>

        <div className="addSection">
          <p className="sectionHeader">All Review</p>
          {/* <AppBtn
            btnText="Add Review"
            icon={Image.AddIcon}
            onClick={() => setCreateReviewPop(true)}
          /> */}
        </div>
        <div className="reviewCardBox">
          {data?.map((el: ReviewDataType, i: number) => (
            <div key={i} className="UserBox">
              <div className="cardTopBtnBox">
                <img className="deleteIcon" src={Image.openIcon} alt="" onClick={() => {
                  setReviewPop(true);
                  setCurrentReviewId(el?._id);
                }} />
                <img
                  src={Image.deleteIcon}
                  className="deleteIcon"
                  alt=""
                  onClick={() => DeletePopOpen(el?._id)}
                />
              </div>
              <h3>{el?.userName} <span style={{ background: el.status === "Panding" ? "#F29339" : "#53a653" }}>{el.status}</span></h3>
              <GiveStar rating={el.rating} />
              <p>{el?.review?.slice(0, 100)}...</p>
            </div>
          ))
          }
        </div>
      </div >
    </>
  )
}
