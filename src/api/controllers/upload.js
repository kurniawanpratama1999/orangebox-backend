import { AppError } from "#utils/AppError.js";
import { Flash } from "#utils/Flash.js";
import { HandleImage } from "#utils/HandleImage.js";

export const upload = async (req, res, next) => {
  console.log("Running");
  try {
    const body = req.body;
    const photo = req.file;

    if (photo && !photo.mimetype.startsWith("image/")) {
      throw new AppError("File harus image", 400);
    }

    const buffer = photo.buffer;
    const convertImage = await HandleImage.convert({
      buffer,
      size: "auto",
      targetKb: "none",
      quality: 60,
      folderName: "testing-2",
    });

    return res.status(200).send({
      code: "succes save photo",
      location: convertImage,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    console.log("Done");
  }
};
