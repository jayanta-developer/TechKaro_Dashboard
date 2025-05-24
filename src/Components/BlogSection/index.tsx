import { useState, useEffect } from "react";
import "./style.css";

//images
import { Image } from "../../assets/Images";

//components
import { Loader, GoTop } from "../Tools";
import {
  AppBtn,
  AddMoreBtn,
  RemoveBtn,
  AppHoloBtn,
  AppOrangeBtn,
} from "../AppButton";
import { toast } from "react-toastify";
import { uploadImage } from "../../Util/ImageUploader";
import MultipleImageUpload from "../../Components/ImageUploader";

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Store/store";
import type { blogTextType, BlogDataType } from "../../Store/blogSlice";
import {
  FetchBlog,
  CreateBlog,
  DeleteBlog,
  UpdateBlog,
} from "../../Store/blogSlice";

export default function BlogSection() {
  const ActivePage = localStorage.getItem("ActivePage");
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.blog);
  console.log(data);

  const [loding, setLoading] = useState(false);
  const [createBlogPop, setCreateBlogPop] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [updateIndex, setUpdateIndex] = useState<number>(1111111111111);
  const [deletePop, setDeletePop] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState<string>();
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");

  const [blogSummaryData, setBlogSummaryData] = useState<blogTextType[]>([
    {
      title: "",
      summarys: [{ summary: "" }],
    },
  ]);
  const [blogUpdateTitle, setBlogUpdateTitle] = useState<string>("");
  const [metaTitleUpdate, setMetaTitleUpdate] = useState<string>("");
  const [metaDescriptionUpdate, setMetaDescriptionUpdate] =
    useState<string>("");

  const [blogSummaryUpdateData, setBlogSummaryUpdateData] = useState<
    blogTextType[]
  >([
    {
      title: "",
      summarys: [{ summary: "" }],
    },
  ]);

  //handleChange
  const handleChangeForMap = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    section: string,
    bulletIndex?: number
  ) => {
    const { name, value } = e.target;

    if (section === "blogSectionChange") {
      setBlogSummaryData((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                ...(bulletIndex !== undefined
                  ? {
                      summarys: item.summarys.map((bp, j) =>
                        j === bulletIndex ? { ...bp, summary: value } : bp
                      ),
                    }
                  : { [name]: value }),
              }
            : item
        )
      );
    }
    if (section === "blogSectionUpdateChange") {
      setBlogSummaryUpdateData((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                ...(bulletIndex !== undefined
                  ? {
                      summarys: item.summarys.map((bp, j) =>
                        j === bulletIndex ? { ...bp, summary: value } : bp
                      ),
                    }
                  : { [name]: value }),
              }
            : item
        )
      );
    }
  };

  // All Section's summary add handler-------------------------------
  const handleAddSummary = (Section: string, index?: number) => {
    if (Section === "blogSection") {
      setBlogSummaryData((prevData) => [
        ...prevData,
        {
          title: "",
          summarys: [{ summary: "" }],
        },
      ]);
    }
    if (Section === "blogUpdateSection") {
      setBlogSummaryUpdateData((prevData) => [
        ...prevData,
        {
          title: "",
          summarys: [{ summary: "" }],
        },
      ]);
    }
    if (Section === "blogSummarySection") {
      setBlogSummaryData((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, summarys: [...item.summarys, { summary: "" }] }
            : item
        )
      );
    }
    if (Section === "blogSummaryUpdateSection") {
      setBlogSummaryUpdateData((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, summarys: [...item.summarys, { summary: "" }] }
            : item
        )
      );
    }
  };

  // All Section's summary remove handler-------------------------------
  const handleRemoveSummary = (Section: string, index?: number) => {
    if (Section === "blogSection") {
      setBlogSummaryData((prevData) => prevData.slice(0, -1));
    }
    if (Section === "blogUpdateSection") {
      setBlogSummaryUpdateData((prevData) => prevData.slice(0, -1));
    }
    if (Section === "blogSummarySection") {
      setBlogSummaryData((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                summarys:
                  item.summarys.length > 1
                    ? item.summarys.slice(0, -1) // Removes the last item
                    : item.summarys,
              }
            : item
        )
      );
    }
    if (Section === "blogSummaryUpdateSection") {
      setBlogSummaryUpdateData((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                summarys:
                  item.summarys.length > 1
                    ? item.summarys.slice(0, -1) // Removes the last item
                    : item.summarys,
              }
            : item
        )
      );
    }
  };
  //Create Blog--------------------------------------------------------------
  const postBlogData = async () => {
    GoTop();
    setLoading(true);

    if (!images) {
      toast.warn("No image selected !");
      setLoading(false);
      return;
    }

    const imageUrls = await uploadImage(previewURLs);
    if (!imageUrls?.length) {
      toast.warn("Please select Icon for Blog");
      return;
    }

    if (
      !blogTitle ||
      !metaTitle ||
      !metaDescription ||
      !blogSummaryData[0].title.length
    ) {
      toast.warn("Please fill all the values!");
      return;
    }

    dispatch(
      CreateBlog({
        title: blogTitle,
        metaTitle,
        metaDescription,
        image: imageUrls[0],
        blogText: blogSummaryData,
        date: new Date().toLocaleDateString("en-GB"),
      })
    );
  };
  //Update Blog ----------------------------------------------------------------------------
  const handleActiveEdit = (index: number) => {
    setUpdateIndex(index);
    setBlogUpdateTitle(data[index]?.title || "");
    setMetaTitleUpdate(data[index]?.metaTitle || "");
    setMetaDescriptionUpdate(data[index]?.metaDescription || "");
    setBlogSummaryUpdateData(() => [...(data[index]?.blogText || [])]);
  };

  const updateBlog = async () => {
    if (!data[updateIndex]?._id) {
      return;
    }
    const imageUrls = await uploadImage(previewURLs);

    dispatch(
      UpdateBlog({
        data: {
          ...(blogUpdateTitle && {
            title: blogUpdateTitle,
          }),
          ...(metaTitleUpdate && {
            metaTitle: metaTitleUpdate,
          }),
          ...(metaDescriptionUpdate && {
            metaDescription: metaDescriptionUpdate,
          }),
          ...(blogSummaryUpdateData[0].title.length && {
            blogText: blogSummaryUpdateData,
          }),
          ...(imageUrls?.length && {
            image: imageUrls[0],
          }),
        },
        id: data[updateIndex]?._id,
      })
    );
  };

  ///Delete Blog-------------------------------------------------------------
  const DeletePopOpen = (id: string | undefined) => {
    GoTop();
    setDeleteBlogId(id);
    setDeletePop(true);
  };

  const HandleDeleteBlog = () => {
    if (deleteBlogId) {
      dispatch(DeleteBlog(deleteBlogId));
    }
  };

  useEffect(() => {
    dispatch(FetchBlog());
    if (data?.length < 0) {
      dispatch(FetchBlog());
    }
  }, []);

  return (
    <>
      <div
        className={
          ActivePage === "Blogs"
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
              <AppHoloBtn
                btnText="Cancel"
                onClick={() => setDeletePop(false)}
              />
              <AppOrangeBtn btnText="Delete" onClick={HandleDeleteBlog} />
            </div>
          </div>
        </div>

        {/* /Top nav */}
        <div className="addSection">
          <p className="sectionHeader">All Blog</p>
          <AppBtn
            btnText="Add Blog"
            icon={Image.AddIcon}
            onClick={() => setCreateBlogPop(true)}
          />
        </div>

        {status === "error" ? (
          <div className="nodataBox inSerErr">
            <img src={Image.InternalServerErrImg} alt="" />
          </div>
        ) : status === "idle" ? (
          <div className="sectionOutBox">
            {/* ------------------------Create Blog--------------------------------- */}
            <div
              style={{ display: createBlogPop ? "block" : "none" }}
              className="section createBox"
            >
              {/* Top btn */}
              <div className="cardTopBtnBox">
                <AppBtn btnText="Save" height="32px" onClick={postBlogData} />
                <img
                  src={Image.crossIcon}
                  className="deleteIcon"
                  alt=""
                  onClick={() => setCreateBlogPop(false)}
                />
              </div>

              <div className="categoryEditView">
                <div className="categoryImgBox cciBox">
                  <MultipleImageUpload
                    images={images}
                    setImages={setImages}
                    previewURLs={previewURLs}
                    setPreviewURLs={setPreviewURLs}
                    id="blogIcon"
                  />
                </div>

                <div className="ctgTextBox">
                  <p className="inputLabel">Blog Title</p>
                  <input
                    className="inputField"
                    type="text"
                    name="title"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Enter Title"
                  />
                  <p className="inputLabel">Meta Title</p>
                  <input
                    className="inputField"
                    type="text"
                    name="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Enter Title"
                  />
                  <p className="inputLabel">Meta Description</p>
                  <input
                    className="inputField"
                    type="text"
                    name="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Enter Title"
                  />

                  {blogSummaryData?.map((bl, i) => (
                    <div key={i} className="overviewInputBox">
                      <p className="inputLabel">Title</p>
                      <input
                        className="inputField"
                        name="title"
                        value={bl.title}
                        onChange={(e) =>
                          handleChangeForMap(e, i, "blogSectionChange")
                        }
                        placeholder="Enter title..."
                      />
                      <h4>Summay Paragraphs</h4>
                      {bl?.summarys?.map((blPoint, j) => (
                        <div key={j} className="bulletPointRow">
                          <textarea
                            className="inputField"
                            name="summary"
                            value={blPoint.summary}
                            onChange={(e) =>
                              handleChangeForMap(e, i, "blogSectionChange", j)
                            }
                            placeholder="Enter summarys..."
                          />
                        </div>
                      ))}
                      <div className="featureBtnBox">
                        <AddMoreBtn
                          icon={Image.addIcon}
                          btnText="Add Summary"
                          onClick={() =>
                            handleAddSummary("blogSummarySection", i)
                          }
                        />
                        {bl.summarys.length > 1 && (
                          <RemoveBtn
                            icon={Image.minusIcon}
                            btnText="Remove"
                            onClick={() =>
                              handleRemoveSummary("blogSummarySection", i)
                            }
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="featureBtnBox">
                    <AddMoreBtn
                      icon={Image.addIcon}
                      btnText="Add Section"
                      onClick={() => handleAddSummary("blogSection")}
                    />
                    {blogSummaryData.length ? (
                      <RemoveBtn
                        icon={Image.minusIcon}
                        btnText="Remove"
                        onClick={() => handleRemoveSummary("blogSection")}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* -----------------------Render section------------------------------- */}

            <div className="sectionListBox">
              {data?.length < 0 ? (
                <div className="nodataBox">
                  <img src={Image.NODataImg} alt="" />
                </div>
              ) : (
                <>
                  {data?.map((el: BlogDataType, i: number) => (
                    <div key={i} className="section">
                      {/* BTN Box */}
                      <div
                        className={
                          i != updateIndex
                            ? "cardTopBtnBox cardTopBtnBoxColaps"
                            : "cardTopBtnBox"
                        }
                      >
                        {i != updateIndex ? null : (
                          <AppBtn
                            btnText="Save"
                            height="32px"
                            onClick={updateBlog}
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
                            onClick={() => setUpdateIndex(9999)}
                          />
                        )}

                        <img
                          src={Image.deleteIcon}
                          className="deleteIcon"
                          alt=""
                          onClick={() => DeletePopOpen(el?._id)}
                        />
                      </div>

                      {i != updateIndex ? (
                        <div className="categoryNormalView">
                          <div className="categoryImgBox">
                            <img
                              className="categoryNImg"
                              src={el?.image}
                              alt=""
                            />
                          </div>
                          <div className="ctgTextBox">
                            <h2>{el?.title}</h2>
                            <p>Created at: {el?.date}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="categoryEditView">
                          <div className="categoryImgBox cciBox">
                            <MultipleImageUpload
                              images={images}
                              setImages={setImages}
                              previewURLs={previewURLs}
                              setPreviewURLs={setPreviewURLs}
                              id="blogUpdateIcon"
                            />
                          </div>

                          <div className="ctgTextBox">
                            <p className="inputLabel">Blog Title</p>
                            <input
                              className="inputField"
                              type="text"
                              name="blogUpdateTitle"
                              value={
                                i === updateIndex ? blogUpdateTitle : el?.title
                              }
                              onChange={(e) =>
                                setBlogUpdateTitle(e.target.value)
                              }
                              placeholder="Enter Title"
                            />
                            <input
                              className="inputField"
                              type="text"
                              name="metaTitleUpdate"
                              value={
                                i === updateIndex
                                  ? metaTitleUpdate
                                  : el?.metaTitle
                              }
                              onChange={(e) =>
                                setMetaTitleUpdate(e.target.value)
                              }
                              placeholder="Enter Title"
                            />
                            <p className="inputLabel">Meta Description</p>
                            <input
                              className="inputField"
                              type="text"
                              name="metaDescriptionUpdate"
                              value={
                                i === updateIndex
                                  ? metaDescriptionUpdate
                                  : el?.metaDescription
                              }
                              onChange={(e) =>
                                setMetaDescriptionUpdate(e.target.value)
                              }
                              placeholder="Enter Title"
                            />

                            {(i === updateIndex
                              ? blogSummaryUpdateData
                              : blogSummaryData
                            ).map((bl, i) => (
                              <div key={i} className="overviewInputBox">
                                <p className="inputLabel">Title</p>
                                <input
                                  className="inputField"
                                  name="title"
                                  value={bl.title}
                                  onChange={(e) =>
                                    handleChangeForMap(
                                      e,
                                      i,
                                      "blogSectionUpdateChange"
                                    )
                                  }
                                  placeholder="Enter title..."
                                />
                                <h2>App Paragraphs</h2>
                                {bl?.summarys?.map((blPoint, j) => (
                                  <div key={j} className="bulletPointRow">
                                    <input
                                      className="inputField"
                                      name="summary"
                                      value={blPoint.summary}
                                      onChange={(e) =>
                                        handleChangeForMap(
                                          e,
                                          i,
                                          "blogSectionUpdateChange",
                                          j
                                        )
                                      }
                                      placeholder="Enter bullet point..."
                                    />
                                  </div>
                                ))}
                                <div className="featureBtnBox">
                                  <AddMoreBtn
                                    icon={Image.addIcon}
                                    btnText="Add Summary"
                                    onClick={() =>
                                      handleAddSummary(
                                        "blogSummaryUpdateSection",
                                        i
                                      )
                                    }
                                  />
                                  {bl.summarys.length > 1 && (
                                    <RemoveBtn
                                      icon={Image.minusIcon}
                                      btnText="Remove"
                                      onClick={() =>
                                        handleRemoveSummary(
                                          "blogSummaryUpdateSection",
                                          i
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            ))}

                            <div className="featureBtnBox">
                              <AddMoreBtn
                                icon={Image.addIcon}
                                btnText="Add Section"
                                onClick={() =>
                                  handleAddSummary("blogUpdateSection")
                                }
                              />
                              {blogSummaryUpdateData.length ? (
                                <RemoveBtn
                                  icon={Image.minusIcon}
                                  btnText="Remove"
                                  onClick={() =>
                                    handleRemoveSummary("blogUpdateSection")
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
