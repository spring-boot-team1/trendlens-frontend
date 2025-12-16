import axiosInstance from "./axiosInstance";
import axios from "axios";

export const getPresignedUrl = async (file: File) => {
  const ext = file.name.split(".").pop();
  const contentType = file.type;

  const res = await axiosInstance.post(`/api/v1/presigned/profilepic`, {
    ext,
    contentType,
  });

  return res.data; // { presignedURL, fileURL }
};

export const uploadImageToS3 = async (presignedUrl: string, file: File) => {
  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};