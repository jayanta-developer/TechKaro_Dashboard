import axios from "axios";

export const uploadImage = async (file: string[]) => {
  let imageUploads = [];
  let dbUrls: string[] = [];

  if (file && file.length > 0) {
    for (const url of file) {
      const blob = await fetch(url).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "TechKaro");
      formData.append("folder", "CategoryIcon");

      imageUploads.push(
        axios.post(
          "https://api.cloudinary.com/v1_1/det2eolem/image/upload",
          formData
        )
      );
    }

    const responses = await Promise.all(imageUploads);

    dbUrls = responses.map((res) => res.data.secure_url);
    return dbUrls;
  }
};
