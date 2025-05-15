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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviewURLs((prev) => [...prev, ...fileArray]);
  };

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
    </div>
  );
};

export default MultipleImageUpload;
