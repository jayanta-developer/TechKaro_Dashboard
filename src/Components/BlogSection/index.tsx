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
import RichTextEditor from "../TextEditor"

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

  const [loding, setLoading] = useState(false);
  const [createBlogPop, setCreateBlogPop] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [previewBlogURLs, setPreviewBlogURLs] = useState<
    { url: string; index: number }[]
  >([]);
  const [updateIndex, setUpdateIndex] = useState<number>(1111111111111);
  const [deletePop, setDeletePop] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState<string>();
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [metaKeyword, setMetaKeyword] = useState<string>("");
  const [blogSummaryData, setBlogSummaryData] = useState<blogTextType[]>([
    {
      title: "",
      summarys: [{ summary: "" }],
      image: "",
    },
  ]);
  const [blogUpdateTitle, setBlogUpdateTitle] = useState<string>("");
  const [metaTitleUpdate, setMetaTitleUpdate] = useState<string>("");
  const [metaDescriptionUpdate, setMetaDescriptionUpdate] =
    useState<string>("");
  const [metaKeywordUpdate, setMetaKeywordUpdate] = useState<string>("");


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

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  //handle blog image

  const handleBlogImg = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    for (const file of files) {
      try {
        const base64 = await fileToBase64(file); // Convert file to base64

        const uploadedUrls = await uploadImage([base64]); // still expects a string[]

        const uploadedUrl = uploadedUrls?.length && uploadedUrls[0]; // get first uploaded image url

        if (typeof uploadedUrl !== "string") {
          console.error("Invalid uploaded URL:", uploadedUrl);
          return;
        }

        // Update previewBlogURLs state
        setPreviewBlogURLs((prev) => {
          const filtered = prev.filter((item) => item.index !== index);
          return [...filtered, { url: uploadedUrl, index }];
        });

        // Optionally update blogSummaryData
        setBlogSummaryData((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, image: uploadedUrl } : item
          )
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleBlogSummaryDelete = (index: number) => {
    const updatedPreviews = previewBlogURLs.filter(
      (item) => item.index !== index
    );
    setPreviewBlogURLs(updatedPreviews);
  };

  // const imageUploader = async () => {
  //   const blogSummaryImg = await uploadImage(previewBlogURLs);
  // };

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
      setLoading(false);
      return;
    }

    if (
      !blogTitle ||
      !metaTitle ||
      !metaDescription ||
      !metaKeyword ||
      !blogSummaryData[0].title.length
    ) {
      toast.warn("Please fill all the values!");
      setLoading(false);
      return;
    }

    setBlogSummaryData((prevData) =>
      prevData.map((item, index) => {
        const matchedPreview = previewBlogURLs.find(
          (preview) => preview.index === index
        );
        if (matchedPreview) {
          return { ...item, image: matchedPreview?.url };
        }
        return item;
      })
    );

    dispatch(
      CreateBlog({
        title: blogTitle,
        metaTitle,
        metaDescription,
        metaKeyword,
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
    setMetaKeywordUpdate(data[index]?.metaKeyword || "");
    setBlogSummaryUpdateData(() => [...(data[index]?.blogText || [])]);
  };

  const updateBlog = async () => {
    GoTop()
    setLoading(true);
    if (!data[updateIndex]?._id) {
      setLoading(false);
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
          ...(metaKeywordUpdate && {
            metaKeyword: metaKeywordUpdate,
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
                    placeholder="Enter Meta Title"
                  />
                  <p className="inputLabel">Meta Description</p>
                  <input
                    className="inputField"
                    type="text"
                    name="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Enter Meta Description"
                  />
                  <p className="inputLabel">Meta Keywords</p>
                  <input
                    className="inputField"
                    type="text"
                    name="metaKeyword"
                    value={metaKeyword}
                    onChange={(e) => setMetaKeyword(e.target.value)}
                    placeholder="Enter Meta Keyword"
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
                          {/* <textarea
                            className="inputField"
                            name="summary"
                            value={blPoint.summary}
                            onChange={(e) =>
                              handleChangeForMap(e, i, "blogSectionChange", j)
                            }
                            placeholder="Enter summarys..."
                          /> */}
                          <RichTextEditor
                            state={blPoint.summary}
                            setState={(val) => {
                              setBlogSummaryData((prev) => {
                                const updated = [...prev];
                                updated[i] = {
                                  ...updated[i],
                                  summarys: updated[i].summarys.map((s, idx) =>
                                    idx === j ? { ...s, summary: val } : s
                                  ),
                                };
                                return updated;
                              });
                            }}
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

                        <div className="bannerImgUploadBox">
                          <label htmlFor={"BlogUpdateImage" + i}>
                            <img src={Image.ImageUploadIcon} alt="" />
                          </label>

                          <input
                            id={"BlogUpdateImage" + i}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleBlogImg(e, i)}
                            style={{ display: "none" }}
                          />
                        </div>
                        {previewBlogURLs.some((val) => val.index === i) && (
                          <div className="preview-item blogSummaryImgBox">
                            <img
                              src={
                                previewBlogURLs.find((val) => val.index === i)
                                  ?.url
                              }
                              alt="thumbnail"
                            />
                            <button
                              onClick={() => handleBlogSummaryDelete(i)}
                              className="delete-btn"
                            >
                              ✖
                            </button>
                          </div>
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

                            {
                              el?.image && !previewURLs.length ?
                                <div className="categoryImgBox ProdDbImg">
                                  <img className="categoryNImg" src={el?.image} alt="" />
                                </div> : null
                            }

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
                            <p className="inputLabel">Meta Title</p>
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
                            <p className="inputLabel">Meta Keyword</p>
                            <input
                              className="inputField"
                              type="text"
                              name="metaKeywordUpdate"
                              value={
                                i === updateIndex
                                  ? metaKeywordUpdate
                                  : el?.metaKeyword
                              }
                              onChange={(e) =>
                                setMetaKeywordUpdate(e.target.value)
                              }
                              placeholder="Enter Meta Keyword"
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
                                    <RichTextEditor
                                      state={blPoint.summary}
                                      setState={(val) => {
                                        setBlogSummaryUpdateData((prev) => {
                                          const updated = [...prev];
                                          updated[i] = {
                                            ...updated[i],
                                            summarys: updated[i].summarys.map((s, idx) =>
                                              idx === j ? { ...s, summary: val } : s
                                            ),
                                          };
                                          return updated;
                                        });
                                      }}
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
                                  {bl?.image?.length ? (
                                    <div className="preview-item blogSummaryImgBox">
                                      <img src={bl?.image} alt="thumbnail" />
                                    </div>
                                  ) : null}
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
