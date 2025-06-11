import { useState, useEffect, useRef } from "react";
import "./style.css";

//images
import { Image } from "../../assets/Images";

//components
import { toast } from "react-toastify";
import {
  AppBtn,
  AddMoreBtn,
  RemoveBtn,
  AppHoloBtn,
  AppOrangeBtn,
} from "../AppButton";
import MultipleImageUpload from "../../Components/ImageUploader";
import { uploadImage } from "../../Util/ImageUploader";
import { GoTop, Loader } from "../Tools";
import RichTextEditor from "../TextEditor"
import Quill from 'quill';


import type { productStateType } from "../../Store/ProductSlice";
import { FetchCategory } from "../../Store/CategorySlice";
import {
  FetchProduct,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
} from "../../Store/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Store/store";

export default function ProductSection() {
  const ActivePage = localStorage.getItem("ActivePage");
  const ProductSummary = useRef<Quill | null>(null);
  const BannerSummary = useRef<Quill | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { data,status } = useSelector((state: RootState) => state.product);
  const category = useSelector((state: RootState) => state.category);

  const [loding, setLoading] = useState(false);
  const [createProductPop, setCreateProductPop] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);

  const [bannerImages, setBannerImages] = useState<File[]>([]);
  const [bannerPreviewURLs, setBannerPreviewURLs] = useState<string[]>([]);
  const [categoryDrop, setCategroyDrop] = useState<string>();

  const [productLocVal, setProductLocVal] = useState<productStateType>({
    title: "",
    aboutTitle: "",
    aboutSummary: "",
    userCoutnTitle: "",
    userCountValue: "",
    infoCountTitle: "",
    infoCountValue: "",
    bannerTitle: "",
    bannerSummary: "",
  });

  const [summaryParagraph, setSummaryParagraph] = useState([
    {
      title: "",
      summarys: [
        {
          summary: "",
        },
      ],
    },
  ]);

  const [keyInsightsData, setKeyInsightsData] = useState([
    { title: "", value: "" },
  ]);
  const [AdvertisingCostData, setAdvertisingCostData] = useState<
    { title: string; value: string; _id?: string }[]
  >([{ title: "", value: "" }]);
  //update state
  const [updateIndex, setUpdateIndex] = useState<number>(1111111111111);
  const [productLocUpdateVal, setProductLocUpdateVal] = useState({
    title: "",
    aboutTitle: "",
    aboutSummary: "",
    userCoutnTitle: "",
    userCountValue: "",
    infoCountTitle: "",
    infoCountValue: "",
    bannerTitle: "",
    bannerSummary: "",
    bannerImg: ""
  });

  const [summaryUpdateParagraph, setSummaryUpdateParagraph] = useState([
    {
      title: "",
      summarys: [
        {
          summary: "",
        },
      ],
    },
  ]);
  const [keyInsightsUpdateData, setKeyInsightsUpdateData] = useState<
    { title: string; value: string; _id?: string }[]
  >([{ title: "", value: "" }]);
  const [AdvertisingCostUpdateData, setAdvertisingCostUpdateData] = useState<
    { title: string; value: string; _id?: string }[]
  >([{ title: "", value: "" }]);

  //dalete
  const [deletePop, setDeletePop] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string>();

  const handleAddSummary = (section: string, index?: number) => {
    if (section === "ELGBTBPoints") {
      setSummaryParagraph((prevData) => [
        ...prevData,
        {
          title: "",
          summarys: [
            {
              summary: "",
            },
          ],
        },
      ]);
    }
    if (section === "addSummarySection") {
      setSummaryUpdateParagraph((prevData) => [
        ...prevData,
        {
          title: "",
          summarys: [
            {
              summary: "",
            },
          ],
        },
      ]);
    }

    if (section === "summaryParagraph") {
      setSummaryParagraph((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, summarys: [...item.summarys, { summary: "" }] }
            : item
        )
      );
    }
    if (section === "addSummary") {
      setSummaryUpdateParagraph((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, summarys: [...item.summarys, { summary: "" }] }
            : item
        )
      );
    }
    if (section === "KeyInsights") {
      setKeyInsightsData((prevData) => [
        ...prevData,
        {
          title: "",
          value: "",
        },
      ]);
    }
    if (section === "Advertising") {
      setAdvertisingCostData((prevData) => [
        ...prevData,
        {
          title: "",
          value: "",
        },
      ]);
    }
    if (section === "KeyInsightsUpdate") {
      setKeyInsightsUpdateData((prevData) => [
        ...prevData,
        {
          title: "",
          value: "",
        },
      ]);
    }
    if (section === "AdvertisingUpdate") {
      setAdvertisingCostUpdateData((prevData) => [
        ...prevData,
        {
          title: "",
          value: "",
        },
      ]);
    }
  };

  const handleRemoveSummary = (section: string, index?: number) => {
    if (section === "ELGBTBPoints") {
      setSummaryParagraph((prevData) => prevData.slice(0, -1));
    }
    if (section === "addSummarySection") {
      setSummaryUpdateParagraph((prevData) => prevData.slice(0, -1));
    }
    if (section === "summaryParagraph") {
      setSummaryParagraph((prev) =>
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
    if (section === "addSummary") {
      setSummaryUpdateParagraph((prev) =>
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
    if (section === "KeyInsights") {
      setKeyInsightsData((prevData) => prevData.slice(0, -1));
    }
    if (section === "Advertising") {
      setAdvertisingCostData((prevData) => prevData.slice(0, -1));
    }
    if (section === "KeyInsightsUpdate") {
      setKeyInsightsUpdateData((prevData) => prevData.slice(0, -1));
    }
    if (section === "AdvertisingUpdate") {
      setAdvertisingCostUpdateData((prevData) => prevData.slice(0, -1));
    }
  };

  const handleChangeForMap = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    section: string,
    summaryIndex?: number
  ) => {
    const { name, value } = e.target;

    if (section === "EGBLTChange") {
      setSummaryParagraph((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
              ...item,
              ...(summaryIndex !== undefined
                ? {
                  summarys: item.summarys.map((bp: any, j: number) =>
                    j === summaryIndex ? { ...bp, summary: value } : bp
                  ),
                }
                : { [name]: value }),
            }
            : item
        )
      );
    }
    if (section === "summaryUpdateChange") {
      setSummaryUpdateParagraph((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
              ...item,
              ...(summaryIndex !== undefined
                ? {
                  summarys: item.summarys.map((bp: any, j: number) =>
                    j === summaryIndex ? { ...bp, summary: value } : bp
                  ),
                }
                : { [name]: value }),
            }
            : item
        )
      );
    }
    if (section === "KeyInsights") {
      setKeyInsightsData((prevData) =>
        prevData.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        )
      );
    }
    if (section === "Advertising") {
      setAdvertisingCostData((prevData) =>
        prevData.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        )
      );
    }
    if (section === "KeyInsightsUpdate") {
      setKeyInsightsUpdateData((prevData) =>
        prevData.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        )
      );
    }
    if (section === "AdvertisingUpdate") {
      setAdvertisingCostUpdateData((prevData) =>
        prevData.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        )
      );
    }
  };
  const handleChangeProductVal = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: string
  ) => {
    const { name, value } = e?.target;

    if (section === "create") {
      setProductLocVal((prv) => ({
        ...prv,
        [name]: value,
      }));
    }
    if (section === "update") {
      setProductLocUpdateVal((prv) => ({
        ...prv,
        [name]: value,
      }));
    }
  };

  //handel banner icon upload
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setBannerImages((prev) => [...prev, ...files]);
    setBannerPreviewURLs((prev) => [...prev, ...fileArray]);
  };
  // create Product----------------------------------------------
  const postProduct = async () => {
    setLoading(true);

    const imageUrls = await uploadImage(previewURLs);
    if (!imageUrls?.length) {
      setLoading(false);
      toast.warn("Please select a image for Product");
      return;
    }
    const BannderimageUrls = (await uploadImage(bannerPreviewURLs)) || [];
    if (!imageUrls?.length) {
      setLoading(false);
      toast.warn("Please select a image for Banner");
      return;
    }

    if (
      !productLocVal.title ||
      !productLocVal.aboutTitle ||
      !productLocVal.aboutSummary ||
      !productLocVal.userCoutnTitle ||
      !productLocVal.userCountValue ||
      !keyInsightsData[0].title.length ||
      !AdvertisingCostData[0].title.length ||
      !productLocVal.bannerSummary ||
      !productLocVal.bannerTitle ||
      !productLocVal.infoCountTitle ||
      !productLocVal.infoCountValue ||
      !summaryParagraph[0]?.title.length ||
      !BannderimageUrls?.length ||
      !categoryDrop
    ) {
      setLoading(false);
      toast.warn("Please fill all the values!");
      return;
    }

    dispatch(
      CreateProduct({
        title: productLocVal?.title,
        image: imageUrls[0],
        About: {
          title: productLocVal?.aboutTitle,
          summary: productLocVal?.aboutSummary,
        },
        KeyInsights: keyInsightsData,
        AdvertisingCost: AdvertisingCostData,
        userCount: {
          title: productLocVal.userCoutnTitle,
          count: productLocVal.userCountValue,
        },
        infoCount: {
          title: productLocVal?.infoCountTitle,
          count: productLocVal?.infoCountValue,
        },
        summary: summaryParagraph,
        bannerData: {
          title: productLocVal?.bannerTitle,
          summary: productLocVal?.bannerSummary,
          img: BannderimageUrls[0],
        },
        category: categoryDrop,
      })
    );
  };

  //update product-------------------------------------------------
  const handleActiveEdit = (index: number) => {
    setUpdateIndex(index);
    setProductLocUpdateVal((prv) => ({
      ...prv,
      title: data[index]?.title,
      aboutTitle: data[index]?.About?.title,
      aboutSummary: data[index]?.About?.summary,
      userCoutnTitle: data[index]?.userCount?.title,
      userCountValue: data[index]?.userCount?.count,
      infoCountTitle: data[index]?.infoCount?.title,
      infoCountValue: data[index]?.infoCount?.count,
      bannerTitle: data[index]?.bannerData?.title || "",
      bannerSummary: data[index]?.bannerData?.summary || "",
      bannerImg: data[index]?.bannerData?.img || "",
    }));
    setSummaryUpdateParagraph(data[index].summary);
    if (data[index].KeyInsights) {
      setKeyInsightsUpdateData(data[index].KeyInsights);
    }
    if (data[index].AdvertisingCost) {
      setAdvertisingCostUpdateData(data[index].AdvertisingCost);
    }
  };
  const updateProduct = async () => {
    setLoading(true)
    if (!data[updateIndex]?._id) {
      toast.warn("Product Id not found");
      setLoading(false)
      return;
    }

    const imageUrls = await uploadImage(previewURLs);
    const BannderimageUrls = (await uploadImage(bannerPreviewURLs)) || [];

    dispatch(
      UpdateProduct({
        data: {
          ...(productLocUpdateVal?.title.length && {
            title: productLocUpdateVal?.title,
          }),
          ...(imageUrls?.length && {
            image: imageUrls[0],
          }),
          ...(keyInsightsUpdateData[0]?.title.length && {
            KeyInsights: keyInsightsUpdateData,
          }),
          ...(AdvertisingCostUpdateData[0]?.title.length && {
            AdvertisingCost: AdvertisingCostUpdateData,
          }),
          ...(productLocUpdateVal?.aboutTitle.length && {
            About: {
              title: productLocUpdateVal?.aboutTitle,
              summary: productLocUpdateVal?.aboutSummary,
            },
          }),
          ...(productLocUpdateVal?.userCoutnTitle.length && {
            userCount: {
              title: productLocUpdateVal?.userCoutnTitle,
              count: productLocUpdateVal?.userCountValue,
            },
          }),
          ...(productLocUpdateVal?.infoCountTitle.length && {
            infoCount: {
              title: productLocUpdateVal?.infoCountTitle,
              count: productLocUpdateVal?.infoCountValue,
            },
          }),
          ...(summaryUpdateParagraph[0]?.title.length && {
            summary: summaryUpdateParagraph,
          }),
          ...(productLocUpdateVal.bannerTitle.length && {
            bannerData: {
              title: productLocUpdateVal?.bannerTitle,
              summary: productLocUpdateVal?.bannerSummary,
              img: BannderimageUrls[0] ? BannderimageUrls[0] : productLocUpdateVal?.bannerImg,
            },
          }),

          ...(categoryDrop && {
            category: categoryDrop,
          }),
        },
        id: data[updateIndex]?._id,
      })
    );
  };

  ///Delte Product----------------------------------
  const DeletePopOpen = (id: string | undefined) => {
    GoTop();
    setDeleteProductId(id);
    setDeletePop(true);
  };

  const HandleDeleteBlog = () => {
    if (deleteProductId) {
      dispatch(DeleteProduct(deleteProductId));
    }
  };

  useEffect(() => {
    dispatch(FetchProduct());
    dispatch(FetchCategory());
    if (data?.length < 0) {
      dispatch(FetchProduct());
    }
    if (category.data?.length < 0) {
      dispatch(FetchCategory());
    }
  }, []);
  return (
    <>
      <div
        className={
          ActivePage === "Product"
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

        <div className="addSection">
          <p className="sectionHeader">All Products</p>
          <AppBtn
            btnText="Add Product"
            icon={Image.addIcon}
            onClick={() => setCreateProductPop(true)}
          />
        </div>

        <div className="sectionOutBox">
          {/* ------------Create ------------------ */}
          <div
            style={{ display: createProductPop ? "block" : "none" }}
            className="section createBox"
          >
            {/* Top btn */}
            <div className="cardTopBtnBox">
              <AppBtn btnText="Save" height="32px" onClick={postProduct} />
              <img
                src={Image.crossIcon}
                className="deleteIcon"
                alt=""
                onClick={() => setCreateProductPop(false)}
              />
            </div>

            <div className="categoryEditView">
              <div className="categoryImgBox cciBox">
                <MultipleImageUpload
                  images={images}
                  setImages={setImages}
                  previewURLs={previewURLs}
                  setPreviewURLs={setPreviewURLs}
                  id="ProductIcon"
                />
              </div>

              <div className="ctgTextBox">
                <p className="inputLabel">Title</p>
                <input
                  className="inputField"
                  type="text"
                  name="title"
                  value={productLocVal?.title}
                  onChange={(e) => handleChangeProductVal(e, "create")}
                  placeholder="Enter Categroy Title"
                />
                <p className="inputLabel">About Title</p>
                <input
                  className="inputField"
                  type="text"
                  name="aboutTitle"
                  value={productLocVal?.aboutTitle}
                  onChange={(e) => handleChangeProductVal(e, "create")}
                  placeholder="Enter Categroy Title"
                />
                <p className="inputLabel">About Summary</p>
                <RichTextEditor ref={ProductSummary} state={productLocVal?.aboutSummary} setState={(val) => setProductLocVal((prv) => ({ ...prv, aboutSummary: val }))} />

                <div className="threeInBox">
                  <div className="thrInputBox">
                    <p className="inputLabel">User Count Title</p>
                    <input
                      className="inputField"
                      type="text"
                      name="userCoutnTitle"
                      value={productLocVal?.userCoutnTitle}
                      onChange={(e) => handleChangeProductVal(e, "create")}
                      placeholder="Enter Categroy Title"
                    />
                  </div>
                  <div className="thrInputBox">
                    <p className="inputLabel">User Count Value</p>
                    <input
                      className="inputField"
                      type="text"
                      name="userCountValue"
                      value={productLocVal?.userCountValue}
                      onChange={(e) => handleChangeProductVal(e, "create")}
                      placeholder="Enter Categroy Title"
                    />
                  </div>
                  <div className="thrInputBox">
                    <p className="inputLabel">Info Coutn title</p>
                    <input
                      className="inputField"
                      type="text"
                      name="infoCountTitle"
                      value={productLocVal?.infoCountTitle}
                      onChange={(e) => handleChangeProductVal(e, "create")}
                      placeholder="Enter Categroy Title"
                    />
                  </div>
                  <div className="thrInputBox">
                    <p className="inputLabel">Info Coutn Value</p>
                    <input
                      className="inputField"
                      type="text"
                      name="infoCountValue"
                      value={productLocVal?.infoCountValue}
                      onChange={(e) => handleChangeProductVal(e, "create")}
                      placeholder="Enter Categroy Title"
                    />
                  </div>
                </div>

                <div className="createDropBox">
                  <p className="inputLabel">Select Category</p>
                  <select
                    id="drop"
                    style={{ width: "100%" }}
                    className="DropBox"
                    onChange={(e) => setCategroyDrop(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {category.data?.map((el, i: number) => (
                      <option key={i} value={el?._id}>
                        {el?.title}
                      </option>
                    ))}
                  </select>
                </div>
                {/* -----------Key Insights------------------- */}
                <h2>Key Insights</h2>
                <div className="featuresBox">
                  {keyInsightsData?.map((fVal, i: number) => (
                    <div key={i} className="featureInputCard">
                      <p className="inputLabel">Title</p>
                      <input
                        className="inputField"
                        placeholder="Enter Insights title..."
                        type="text"
                        name="title"
                        value={fVal?.title}
                        onChange={(e) =>
                          handleChangeForMap(e, i, "KeyInsights")
                        }
                      />
                      <p className="inputLabel">Value</p>
                      <input
                        className="inputField"
                        placeholder="Enter Insights value..."
                        name="value"
                        value={fVal?.value}
                        onChange={(e) =>
                          handleChangeForMap(e, i, "KeyInsights")
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="featureBtnBox">
                  <AddMoreBtn
                    icon={Image.addIcon}
                    btnText="Add More"
                    onClick={() => handleAddSummary("KeyInsights")}
                  />
                  {keyInsightsData.length ? (
                    <RemoveBtn
                      icon={Image.minusIcon}
                      btnText="Remove"
                      onClick={() => handleRemoveSummary("KeyInsights")}
                    />
                  ) : null}
                </div>

                {/* ----------------Advertising Cost---------------------- */}
                <h2>Advertising Cost</h2>
                <div className="featuresBox">
                  {AdvertisingCostData?.map((fVal, i: number) => (
                    <div key={i} className="featureInputCard">
                      <p className="inputLabel">Title</p>
                      <input
                        className="inputField"
                        placeholder="Enter Advertising title..."
                        type="text"
                        name="title"
                        value={fVal?.title}
                        onChange={(e) =>
                          handleChangeForMap(e, i, "Advertising")
                        }
                      />
                      <p className="inputLabel">Value</p>
                      <input
                        className="inputField"
                        placeholder="Enter Advertising value..."
                        name="value"
                        value={fVal?.value}
                        onChange={(e) =>
                          handleChangeForMap(e, i, "Advertising")
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="featureBtnBox">
                  <AddMoreBtn
                    icon={Image.addIcon}
                    btnText="Add More"
                    onClick={() => handleAddSummary("Advertising")}
                  />
                  {keyInsightsData.length ? (
                    <RemoveBtn
                      icon={Image.minusIcon}
                      btnText="Remove"
                      onClick={() => handleRemoveSummary("Advertising")}
                    />
                  ) : null}
                </div>

                <h2>Summary Paragraphs</h2>
                {summaryParagraph?.map((bl, i) => (
                  <div key={i} className="overviewInputBox">
                    <p className="inputLabel">Title</p>
                    <input
                      className="inputField"
                      name="title"
                      value={bl.title}
                      onChange={(e) => handleChangeForMap(e, i, "EGBLTChange")}
                      placeholder="Enter title..."
                    />
                    <h2>Add summary</h2>
                    {bl?.summarys?.map((blPoint: any, j: number) => (
                      <div key={j} className="bulletPointRow">

                        {/* <input
                          className="inputField"
                          name="summary"
                          value={blPoint.summary}
                          onChange={(e) =>
                            handleChangeForMap(e, i, "EGBLTChange", j)
                          }
                          placeholder="Enter summary point..."
                        /> */}

                        <RichTextEditor
                          state={blPoint.summary}
                          setState={(val) => {
                            setSummaryParagraph((prev) => {
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
                        btnText="Add More"
                        onClick={() => handleAddSummary("summaryParagraph", i)}
                      />
                      {bl.summarys.length > 1 && (
                        <RemoveBtn
                          icon={Image.minusIcon}
                          btnText="Remove"
                          onClick={() =>
                            handleRemoveSummary("summaryParagraph", i)
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}

                <div className="featureBtnBox">
                  <AddMoreBtn
                    icon={Image.addIcon}
                    btnText="Add More"
                    onClick={() => handleAddSummary("ELGBTBPoints")}
                  />
                  {summaryParagraph.length ? (
                    <RemoveBtn
                      icon={Image.minusIcon}
                      btnText="Remove"
                      onClick={() => handleRemoveSummary("ELGBTBPoints")}
                    />
                  ) : null}
                </div>

                <p className="inputLabel">Banner Title</p>
                <input
                  className="inputField"
                  type="text"
                  name="bannerTitle"
                  value={productLocVal?.bannerTitle}
                  onChange={(e) => handleChangeProductVal(e, "create")}
                  placeholder="Enter Categroy Title"
                />
                <p className="inputLabel">Banner Summary</p>
                <RichTextEditor ref={BannerSummary} state={productLocVal?.bannerSummary} setState={(val) => setProductLocVal((prv) => ({ ...prv, bannerSummary: val }))} />


                <div className="bannerImgUploadBox">
                  <div className="imageUploader">
                    <label htmlFor="bannerUpdateIcon">
                      <img src={Image.ImageUploadIcon} alt="" />
                    </label>

                    <input
                      id="bannerUpdateIcon"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleBannerFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  {bannerPreviewURLs.length > 0 && (
                    <div className="bannerImgBox">
                      <img
                        alt="Upload"
                        src={bannerPreviewURLs[bannerPreviewURLs.length - 1]}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ----------------------------------------Render Product------------------------------------------ */}
          {data.length === 0 ? (
            <div style={{ display: "flex" }} className="nodataBox">
              <img src={Image.NODataImg} alt="" />
            </div>
          ) : (
            <div style={{ display: "block" }}>
              {data?.map((el, i: number) => (
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
                        onClick={updateProduct}
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
                          // Reloader(100);
                        }}
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
                        <img className="categoryNImg" alt="" src={el?.image} />
                      </div>
                      <div className="ctgTextBox">
                        <h2>{el?.title}</h2>
                        {/* <p>{el?.category?.title}</p> */}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="categoryEditView prod">
                        <div className="outerImgUploadBox noScroll_Line">
                          <MultipleImageUpload
                            images={images}
                            setImages={setImages}
                            previewURLs={previewURLs}
                            setPreviewURLs={setPreviewURLs}
                            id="ProductIcon"
                          />
                          {
                            el?.image && !previewURLs.length ?
                              <div className="categoryImgBox ProdDbImg">
                                <img className="categoryNImg" src={el?.image} alt="" />
                              </div> : null
                          }

                        </div>

                        <div className="ctgTextBox">
                          <p className="inputLabel">Title</p>
                          <input
                            className="inputField"
                            type="text"
                            name="title"
                            value={productLocUpdateVal?.title}
                            onChange={(e) =>
                              handleChangeProductVal(e, "update")
                            }
                            placeholder="Enter Categroy Title"
                          />
                          <p className="inputLabel">About Title</p>
                          <input
                            className="inputField"
                            type="text"
                            name="aboutTitle"
                            value={productLocUpdateVal?.aboutTitle}
                            onChange={(e) =>
                              handleChangeProductVal(e, "update")
                            }
                            placeholder="Enter Categroy Title"
                          />
                          <p className="inputLabel">About Summary</p>
                          <RichTextEditor ref={ProductSummary} state={productLocUpdateVal?.aboutSummary} setState={(val) => setProductLocUpdateVal((prv) => ({ ...prv, aboutSummary: val }))} />

                          <div className="threeInBox">
                            <div className="thrInputBox">
                              <p className="inputLabel">User Count Title</p>
                              <input
                                className="inputField"
                                type="text"
                                name="userCoutnTitle"
                                value={productLocUpdateVal?.userCoutnTitle}
                                onChange={(e) =>
                                  handleChangeProductVal(e, "update")
                                }
                                placeholder="Enter Categroy Title"
                              />
                            </div>
                            <div className="thrInputBox">
                              <p className="inputLabel">User Count Value</p>
                              <input
                                className="inputField"
                                type="text"
                                name="userCountValue"
                                value={productLocUpdateVal?.userCountValue}
                                onChange={(e) =>
                                  handleChangeProductVal(e, "update")
                                }
                                placeholder="Enter Categroy Title"
                              />
                            </div>
                            <div className="thrInputBox">
                              <p className="inputLabel">Info Coutn title</p>
                              <input
                                className="inputField"
                                type="text"
                                name="infoCountTitle"
                                value={productLocUpdateVal?.infoCountTitle}
                                onChange={(e) =>
                                  handleChangeProductVal(e, "update")
                                }
                                placeholder="Enter Categroy Title"
                              />
                            </div>
                            <div className="thrInputBox">
                              <p className="inputLabel">Info Coutn Value</p>
                              <input
                                className="inputField"
                                type="text"
                                name="infoCountValue"
                                value={productLocUpdateVal?.infoCountValue}
                                onChange={(e) =>
                                  handleChangeProductVal(e, "update")
                                }
                                placeholder="Enter Categroy Title"
                              />
                            </div>
                          </div>
                          <div className="createDropBox">
                            <p className="inputLabel">Select Category</p>
                            <select
                              id="drop"
                              style={{ width: "100%" }}
                              className="DropBox"
                              onChange={(e) => setCategroyDrop(e.target.value)}
                            >
                              <option value="">
                                {category?.data?.find(
                                  (cval) => cval?._id === el?.category
                                )?.title || "Select Category"}
                              </option>
                              {category.data?.map((el, i: number) => (
                                <option key={i} value={el?._id}>
                                  {el?.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* -----------Key Insights------------------- */}
                          <h2>Key Insights</h2>
                          <div className="featuresBox">
                            {keyInsightsUpdateData?.map((fVal, i: number) => (
                              <div key={i} className="featureInputCard">
                                <p className="inputLabel">Title</p>
                                <input
                                  className="inputField"
                                  placeholder="Enter Insights title..."
                                  type="text"
                                  name="title"
                                  value={fVal?.title}
                                  onChange={(e) =>
                                    handleChangeForMap(
                                      e,
                                      i,
                                      "KeyInsightsUpdate"
                                    )
                                  }
                                />
                                <p className="inputLabel">Value</p>
                                <input
                                  className="inputField"
                                  placeholder="Enter Insights value..."
                                  name="value"
                                  value={fVal?.value}
                                  onChange={(e) =>
                                    handleChangeForMap(
                                      e,
                                      i,
                                      "KeyInsightsUpdate"
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                          <div className="featureBtnBox">
                            <AddMoreBtn
                              icon={Image.addIcon}
                              btnText="Add More"
                              onClick={() =>
                                handleAddSummary("KeyInsightsUpdate")
                              }
                            />
                            {keyInsightsData.length ? (
                              <RemoveBtn
                                icon={Image.minusIcon}
                                btnText="Remove"
                                onClick={() =>
                                  handleRemoveSummary("KeyInsightsUpdate")
                                }
                              />
                            ) : null}
                          </div>

                          {/* ----------------Advertising Cost---------------------- */}
                          <h2>Advertising Cost</h2>
                          <div className="featuresBox">
                            {AdvertisingCostUpdateData?.map(
                              (fVal, i: number) => (
                                <div key={i} className="featureInputCard">
                                  <p className="inputLabel">Title</p>
                                  <input
                                    className="inputField"
                                    placeholder="Enter Advertising title..."
                                    type="text"
                                    name="title"
                                    value={fVal?.title}
                                    onChange={(e) =>
                                      handleChangeForMap(
                                        e,
                                        i,
                                        "AdvertisingUpdate"
                                      )
                                    }
                                  />
                                  <p className="inputLabel">Value</p>
                                  <input
                                    className="inputField"
                                    placeholder="Enter Advertising value..."
                                    name="value"
                                    value={fVal?.value}
                                    onChange={(e) =>
                                      handleChangeForMap(
                                        e,
                                        i,
                                        "AdvertisingUpdate"
                                      )
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                          <div className="featureBtnBox">
                            <AddMoreBtn
                              icon={Image.addIcon}
                              btnText="Add More"
                              onClick={() =>
                                handleAddSummary("AdvertisingUpdate")
                              }
                            />
                            {keyInsightsUpdateData.length ? (
                              <RemoveBtn
                                icon={Image.minusIcon}
                                btnText="Remove"
                                onClick={() =>
                                  handleRemoveSummary("AdvertisingUpdate")
                                }
                              />
                            ) : null}
                          </div>

                          <h2>Summary Paragraphs</h2>
                          {summaryUpdateParagraph?.map((bl, i) => (
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
                                    "summaryUpdateChange"
                                  )
                                }
                                placeholder="Enter title..."
                              />
                              <h2>Add summary</h2>
                              {bl?.summarys?.map((blPoint: any, j: number) => (
                                <div key={j} className="bulletPointRow">
                                  {/* <input
                                    className="inputField"
                                    name="summary"
                                    value={blPoint.summary}
                                    onChange={(e) =>
                                      handleChangeForMap(
                                        e,
                                        i,
                                        "summaryUpdateChange",
                                        j
                                      )
                                    }
                                    placeholder="Enter summary point..."
                                  /> */}

                                  <RichTextEditor
                                    state={blPoint.summary}
                                    setState={(val) => {
                                      setSummaryUpdateParagraph((prev) => {
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
                                  btnText="Add More"
                                  onClick={() =>
                                    handleAddSummary("addSummary", i)
                                  }
                                />
                                {bl.summarys.length > 1 && (
                                  <RemoveBtn
                                    icon={Image.minusIcon}
                                    btnText="Remove"
                                    onClick={() =>
                                      handleRemoveSummary("addSummary", i)
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          ))}

                          <div className="featureBtnBox">
                            <AddMoreBtn
                              icon={Image.addIcon}
                              btnText="Add More"
                              onClick={() =>
                                handleAddSummary("addSummarySection")
                              }
                            />
                            {summaryUpdateParagraph.length ? (
                              <RemoveBtn
                                icon={Image.minusIcon}
                                btnText="Remove"
                                onClick={() =>
                                  handleRemoveSummary("addSummarySection")
                                }
                              />
                            ) : null}
                          </div>

                          <p className="inputLabel">Banner Title</p>
                          <input
                            className="inputField"
                            type="text"
                            name="bannerTitle"
                            value={productLocUpdateVal?.bannerTitle}
                            onChange={(e) =>
                              handleChangeProductVal(e, "update")
                            }
                            placeholder="Enter Categroy Title"
                          />
                          <p className="inputLabel">Banner Summary</p>
                          <RichTextEditor ref={BannerSummary} state={productLocUpdateVal?.bannerSummary} setState={(val) => setProductLocUpdateVal((prv) => ({ ...prv, bannerSummary: val }))} />

                          <div className="bannerImgUploadBox">
                            <div className="imageUploader">
                              <label htmlFor="bannerUpdateIcon">
                                <img src={Image.ImageUploadIcon} alt="" />
                              </label>

                              <input
                                id="bannerUpdateIcon"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleBannerFileChange}
                                style={{ display: "none" }}
                              />
                            </div>
                            {el?.bannerData?.img && (
                              <div className="bannerImgBox">
                                <img
                                  alt="Upload"
                                  src={
                                    bannerPreviewURLs.length
                                      ? bannerPreviewURLs[0]
                                      : el?.bannerData?.img
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
