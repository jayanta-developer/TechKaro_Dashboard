import { useState, useEffect } from "react";
import "./style.css";

//images
import { Image } from "../../assets/Images";

//components
import { toast } from "react-toastify";
import { AppBtn, AppHoloBtn, AppOrangeBtn } from "../AppButton";
import MultipleImageUpload from "../../Components/ImageUploader";
import { uploadImage } from "../../Util/ImageUploader";
import { GoTop, Loader } from "../Tools";

import {
  FetchCategory,
  CreateCategory,
  DeleteCategory,
  UpdateCategory,
} from "../../Store/CategorySlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Store/store";

export default function CategorySection() {
  const ActivePage = localStorage.getItem("ActivePage");
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.category);

  const [loding, setLoading] = useState(false);
  const [createCategoryPop, setCreateCategoryPop] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [imgAltText, setImgAltText] = useState<Record<string, string>>({});
  const [categroyLocData, setCategoryLocData] = useState({
    title: "",
  });

  //update
  const [updateIndex, setUpdateIndex] = useState<number>(1111111111111);
  const [categroyLocUpdateData, setCategoryLocUpdateData] = useState<{
    title: string;
  }>({ title: "" });

  //dalete
  const [deletePop, setDeletePop] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string>();

  //Create Category----------------------
  const handleCategroyLocData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: string
  ) => {
    const { name, value } = e.target;
    if (section === "create") {
      setCategoryLocData((prv) => ({
        ...prv,
        [name]: value,
      }));
    }

    if (section === "update") {
      setCategoryLocUpdateData((prv) => ({
        ...prv,
        [name]: value,
      }));
    }
  };
  const postCategroy = async () => {
    GoTop();
    setLoading(true);

    const imageUrls = await uploadImage(previewURLs);
    if (!imageUrls?.length) {
      toast.warn("Please select Icon for Category");
      return;
    }
    if (!categroyLocData?.title) {
      toast.warn("Please enter the title!");
      return;
    }

    dispatch(
      CreateCategory({
        title: categroyLocData?.title,
        icon: imageUrls[0],
      })
    );
  };
  // --------------------------------------------

  ///Category Update--------------------------------------
  const handleActiveEdit = (index: number) => {
    setUpdateIndex(index);
    setCategoryLocUpdateData((prv) => ({
      ...prv,
      title: data[index].title,
    }));
  };

  const updateCategory = async () => {
    const imageUrls = (await uploadImage(previewURLs)) || [];

    if (!data[updateIndex]?._id) {
      toast.warn("Category Id not found");
      return;
    }

    dispatch(
      UpdateCategory({
        data: {
          ...(categroyLocUpdateData?.title && {
            title: categroyLocUpdateData?.title,
          }),
          ...(imageUrls.length > 0 && {
            icon: imageUrls[0],
          }),
        },
        id: data[updateIndex]?._id,
      })
    );
  };

  // --------------------------------------------

  ///Delte Category----------------------------------
  const DeletePopOpen = (id: string | undefined) => {
    GoTop();
    setDeleteCategoryId(id);
    setDeletePop(true);
  };

  const HandleDeleteBlog = () => {
    if (deleteCategoryId) {
      dispatch(DeleteCategory(deleteCategoryId));
    }
  };
  // --------------------------------------------

  // Category icon delete-----
  const handleDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewURLs.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewURLs(updatedPreviews);

    // Remove alt text entry as well
    const updatedAltText = { ...imgAltText };
    delete updatedAltText[String(index)];
    setImgAltText(updatedAltText);
  };
  //Upload category Icon
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviewURLs((prev) => [...prev, ...fileArray]);
  };

  useEffect(() => {
    dispatch(FetchCategory());
    if (data?.length < 0) {
      dispatch(FetchCategory());
    }
  }, []);
  return (
    <div
      className={
        ActivePage === "Category"
          ? "mainBox mainBoxActive noScroll_Line"
          : "mainBox noScroll_Line"
      }
    >
      {/* Loader */}
      <Loader loding={loding || status === "loading" ? true : false} />

      {/* ---------Delete pop */}
      <div className={deletePop ? "grayBox ActiveGrayBox" : "grayBox"}>
        <div className="popBox">
          <h3>You want to delete this Blog ?</h3>
          <div className="popBtnBox">
            <AppHoloBtn btnText="Cancel" onClick={() => setDeletePop(false)} />
            <AppOrangeBtn btnText="Delete" onClick={HandleDeleteBlog} />
          </div>
        </div>
      </div>

      <div className="addSection">
        <p className="sectionHeader">All Category</p>
        <AppBtn
          btnText="Add Category"
          icon={Image.addIcon}
          onClick={() => setCreateCategoryPop(true)}
        />
      </div>

      <div className="sectionOutBox">
        {/* ------------Create ------------------ */}
        <div
          style={{ display: createCategoryPop ? "block" : "none" }}
          className="section createBox"
        >
          {/* Top btn */}
          <div className="cardTopBtnBox">
            <AppBtn btnText="Save" height="32px" onClick={postCategroy} />
            <img
              src={Image.crossIcon}
              className="deleteIcon"
              alt=""
              onClick={() => setCreateCategoryPop(false)}
            />
          </div>
          <div className="categoryEditView">
            <div className="categoryImgBox cciBox">
              <MultipleImageUpload
                images={images}
                setImages={setImages}
                previewURLs={previewURLs}
                setPreviewURLs={setPreviewURLs}
                imgAltText={imgAltText}
                setImgAltText={setImgAltText}
                id="categorIcon"
              />
            </div>

            <div className="preview-container noScroll_Line categoryIconBox">
              {previewURLs.map((url, index) => (
                <div key={index} className="preview-item">
                  <img src={url} alt="thumbnail" />
                  <button
                    onClick={() => handleDelete(index)}
                    className="delete-btn"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            <div className="ctgTextBox">
              <p className="inputLabel">Categroy Title</p>
              <input
                className="inputField"
                type="text"
                name="title"
                value={categroyLocData?.title}
                onChange={(e) => handleCategroyLocData(e, "create")}
                placeholder="Enter Categroy Title"
              />
            </div>
          </div>
        </div>

        {/* ------Render data------ */}
        <div className="sectionListBox">
          <h2>Category List</h2>

          <div className="categoryCardBox">
            {data?.length === 0 ? (
              <div className="nodataBox">
                <img src={Image.NODataImg} alt="" />
              </div>
            ) : (
              <>
                {data?.map((el, i) => (
                  <div key={i} className="categoryCard sGridItem">
                    {/* BTN Box */}
                    <div
                      className={
                        i != updateIndex
                          ? "cardTopBtnBox cardTopBtnBoxColaps"
                          : "cardTopBtnBox"
                      }
                    >
                      {i != updateIndex ? null : (
                        <img
                          src={Image.saveIcon}
                          className="editIcon"
                          alt=""
                          onClick={updateCategory}
                        />
                      )}
                      {i != updateIndex ? (
                        <img
                          src={Image.editIcon}
                          className="editIcon"
                          alt=""
                          onClick={() => handleActiveEdit(i)}
                        />
                      ) : (
                        <img
                          style={{ width: "27px" }}
                          src={Image.crossIcon}
                          className="editIcon"
                          alt=""
                          onClick={() => {
                            setUpdateIndex(9999);
                            setPreviewURLs([]);
                          }}
                        />
                      )}
                      {i != updateIndex ? (
                        <img
                          src={Image.deleteIcon}
                          className="deleteIcon"
                          alt=""
                          onClick={() => DeletePopOpen(el?._id)}
                        />
                      ) : null}
                    </div>

                    {i != updateIndex ? (
                      <>
                        <img src={el?.icon} alt="" />
                        <p>{el?.title}</p>
                      </>
                    ) : (
                      <div className="categoryEditBox">
                        <label htmlFor="categorUpdateIcon">
                          {previewURLs.length > 0 ? (
                            <img
                              alt="Upload"
                              src={previewURLs[previewURLs.length - 1]}
                            />
                          ) : (
                            <img alt="Upload" src={Image.ImageUploadIcon} />
                          )}
                        </label>

                        <input
                          id="categorUpdateIcon"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />

                        <input
                          className="inputField"
                          type="text"
                          name="title"
                          value={
                            i === updateIndex
                              ? categroyLocUpdateData?.title
                              : el?.title
                          }
                          onChange={(e) => handleCategroyLocData(e, "update")}
                          placeholder="Enter Categroy Title"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
