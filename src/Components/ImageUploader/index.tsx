import React from "react";
import "./style.css";

import AddIcon from "../../assets/Images/ImageUpload.png";

interface ImageUploadProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  previewURLs: string[];
  setPreviewURLs: React.Dispatch<React.SetStateAction<string[]>>;
  imgAltText: Record<string, string>;
  setImgAltText: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  id: string;
}

const MultipleImageUpload = ({
  images,
  setImages,
  previewURLs,
  setPreviewURLs,
  imgAltText,
  setImgAltText,
  id,
}: ImageUploadProps) => {
  console.log(previewURLs);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviewURLs((prev) => [...prev, ...fileArray]);
  };

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

  // const handleLocalAltVal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setImgAltText((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  return (
    <div className="outerImgUploadBox noScroll_Line">
      <div className="upload-container">
        <label htmlFor={id}>
          <img src={AddIcon} alt="Upload" className="CEImgUploadIcon" />
        </label>
        <input
          id={id}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="preview-container noScroll_Line">
        {previewURLs.map((url, index) => (
          <div key={index} className="preview-item">
            <img src={url} alt="thumbnail" />
            <button onClick={() => handleDelete(index)} className="delete-btn">
              ✖
            </button>
            {/* <textarea
              name={String(index)}
              className="imgAltTextInput"
              placeholder="ALT Text"
              onChange={handleLocalAltVal}
              value={imgAltText[String(index)] || ""}
            /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleImageUpload;
