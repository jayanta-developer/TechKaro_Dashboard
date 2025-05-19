import { useState, useEffect } from "react";
import "./style.css";

//images
import { Image } from "../../assets/Images";

//components
import { toast } from "react-toastify";
import {
  AppBtn,
  AppHoloBtn,
  AppOrangeBtn,
  AddMoreBtn,
  RemoveBtn,
} from "../AppButton";
import MultipleImageUpload from "../../Components/ImageUploader";
import { uploadImage } from "../../Util/ImageUploader";
import { GoTop, Loader } from "../Tools";

import type { productDataType } from "../../Store/ProductSlice";
import { FetchProduct, CreateProduct } from "../../Store/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Store/store";

export default function ProductSection() {
  const ActivePage = localStorage.getItem("ActivePage");
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.product);
  console.log(data, status);
  const [loding, setLoading] = useState(false);
  const [createProductPop, setCreateProductPop] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewURLs, setPreviewURLs] = useState<string[]>([]);
  const [bannerImages, setBannerImages] = useState<File[]>([]);
  const [bannerPreviewURLs, setBannerPreviewURLs] = useState<string[]>([]);
  const [imgAltText, setImgAltText] = useState<Record<string, string>>({});
  const [productLocVal, setProductLocVal] = useState<productDataType>({
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
  const [AdvertisingCostData, setAdvertisingCostData] = useState([
    { title: "", value: "" },
  ]);

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

    if (section === "summaryParagraph") {
      setSummaryParagraph((prev) =>
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
  };

  const handleRemoveSummary = (section: string, index?: number) => {
    if (section === "ELGBTBPoints") {
      setSummaryParagraph((prevData) => prevData.slice(0, -1));
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
    if (section === "KeyInsights") {
      setKeyInsightsData((prevData) => prevData.slice(0, -1));
    }
    if (section === "Advertising") {
      setAdvertisingCostData((prevData) => prevData.slice(0, -1));
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
  };

  //handel banner icon upload
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setBannerImages((prev) => [...prev, ...files]);
    setBannerPreviewURLs((prev) => [...prev, ...fileArray]);
  };
  // create Product
  const postProduct = async () => {
    setLoading(true);

    const imageUrls = await uploadImage(previewURLs);
    if (!imageUrls?.length) {
      setLoading(false);
      toast.warn("Please select a image for Product");
      return;
    }
    const BannderimageUrls = await uploadImage(bannerPreviewURLs);
    if (!imageUrls?.length) {
      setLoading(false);
      toast.warn("Please select a image for Banner");
      return;
    }

    console.log(imageUrls);
    console.log(BannderimageUrls);
    console.log({
      title: productLocVal?.title,
      image: imageUrls[0],
      About: {
        title: productLocVal?.aboutTitle,
        summary: productLocVal?.aboutSummary,
      },
      userCount: {
        title: productLocVal.userCoutnTitle,
        count: productLocVal.userCountValue,
      },
      infoCount: {
        title: productLocVal?.infoCountTitle,
        count: productLocVal?.infoCountValue,
      },
      KeyInsights: keyInsightsData,
      AdvertisingCost: AdvertisingCostData,

      summary: summaryParagraph,
      bannerData: {
        title: productLocVal?.bannerTitle,
        summary: productLocVal?.bannerSummary,
        img: {},
      },
    });

    if (
      !productLocVal.title ||
      !productLocVal.aboutTitle ||
      !productLocVal.aboutSummary ||
    ) {
      console.log("all value is not there");
    } else {
      console.log("all value is there");
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
      !productLocVal.bannerImg
    ) {
      setLoading(false);
      console.log("all value is not there");

      toast.warn("Please fill all the values!");
      return;
    }

    // dispatch(
    //   CreateProduct({
    //     title: productLocVal?.title,
    //     image: imageUrls[0],
    //     About: {
    //       title: productLocVal?.aboutTitle,
    //       summary: productLocVal?.aboutSummary,
    //     },
    //     KeyInsights: keyInsightsData,
    //     AdvertisingCost: AdvertisingCostData,
    //     userCount: {
    //       title: productLocVal.userCoutnTitle,
    //       count: productLocVal.userCountValue,
    //     },
    //     infoCount: {
    //       title: productLocVal?.infoCountTitle,
    //       count: productLocVal?.infoCountValue,
    //     },
    //     summary: summaryParagraph,
    //     bannerData: {
    //       title: productLocVal?.bannerTitle,
    //       summary: productLocVal?.bannerSummary,
    //       img: {},
    //     },
    //   })
    // );
  };

  useEffect(() => {
    dispatch(FetchProduct());
    if (data?.length < 0) {
      dispatch(FetchProduct());
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
        <Loader loding={loding ? true : false} />

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
                  imgAltText={imgAltText}
                  setImgAltText={setImgAltText}
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
                <textarea
                  className="inputField"
                  name="aboutSummary"
                  value={productLocVal?.aboutSummary}
                  onChange={(e) => handleChangeProductVal(e, "create")}
                  placeholder="Enter Categroy Title"
                />

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
                        <input
                          className="inputField"
                          name="summary"
                          value={blPoint.summary}
                          onChange={(e) =>
                            handleChangeForMap(e, i, "EGBLTChange", j)
                          }
                          placeholder="Enter summary point..."
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
                <textarea
                  className="inputField"
                  name="bannerSummary"
                  value={productLocVal?.bannerSummary}
                  onChange={(e) => handleChangeProductVal(e, "create")}
                  placeholder="Enter Categroy Title"
                />
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
        </div>
      </div>
    </>
  );
}
