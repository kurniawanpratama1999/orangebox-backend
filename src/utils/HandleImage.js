import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { AppError } from "./AppError.js";
import { HTTP_FAILED } from "./Flash.js";

export class HandleImage {
  #folderName;
  #prefixName;
  #fileName;
  #sizePixel;
  #targetKb;
  #qualityPercentage;
  #buffer;
  #sharpBuffer;

  constructor({
    folderName = "general",
    prefixName = "img",
    fileName = null,
    sizePixel = "auto",
    targetKb = "none",
    qualityPercentage = 60,
  } = {}) {
    this.#folderName = folderName;
    this.#prefixName = prefixName;
    this.#fileName = fileName;
    this.#sizePixel = sizePixel;
    this.#targetKb = targetKb;
    this.#qualityPercentage = qualityPercentage;
  }

  get folderName() {
    return this.#folderName;
  }

  get fileName() {
    return this.#fileName;
  }

  get sharpBuffer() {
    return this.#sharpBuffer;
  }

  async convert(buffer) {
    if (buffer) {
      this.#buffer = buffer;
    }

    try {
      const resizeConfig = {
        fit: "cover",
        withoutEnlargement: true,
      };

      if (this.#sizePixel !== "auto") {
        if (this.#sizePixel.height && this.#sizePixel.width) {
          const height = Number(this.#sizePixel.height);
          const width = Number(this.#sizePixel.width);

          if (Number.isNaN(height) || Number.isNaN(width)) {
            throw new AppError("width and height should a number", 400);
          }

          resizeConfig.height = height;
          resizeConfig.width = width;
        }
      }

      let quality = this.#qualityPercentage;
      let currentBuffer = await sharp(this.#buffer)
        .resize(resizeConfig)
        .webp({ quality })
        .toBuffer();

      if (this.#targetKb !== "none") {
        const kilobytes = Number(this.#targetKb);

        if (Number.isNaN(kilobytes)) {
          throw new AppError("kilobtyes should be a number", 400);
        }

        while (currentBuffer.length / 1024 > kilobytes && quality > 30) {
          quality -= 5;

          currentBuffer = await sharp(this.#buffer)
            .resize(resizeConfig)
            .webp({ quality })
            .toBuffer();
        }

        if (currentBuffer.length / 1024 > kilobytes) {
          throw new AppError(
            "can't compress image, please use another image",
            400,
          );
        }
      }

      this.#sharpBuffer = currentBuffer;

      const uuid = randomUUID();

      this.#fileName = `${this.#folderName}/${this.#prefixName}-${uuid}.webp`;
    } catch (error) {
      console.log(error);
      throw new AppError("convert image is failed", 500);
    }
  }

  async save({ folderName, fileName, buffer } = {}) {
    if (folderName) {
      this.#folderName = folderName;
    }

    if (fileName) {
      this.#fileName = fileName;
    }

    if (buffer) {
      this.#sharpBuffer = buffer;
    }

    try {
      const uploadDir = path.join("src", "uploads", this.#folderName);
      await fs.mkdir(uploadDir, { recursive: true });

      const outputFile = path.join("src", "uploads", this.#fileName);

      await fs.writeFile(outputFile, this.#sharpBuffer);
    } catch (error) {
      throw new AppError("Failed for save an image", HTTP_FAILED.CONFLICT);
    }
  }

  static async delete(filePath) {
    const dir = path.join("src", "uploads", filePath);
    await fs.unlink(dir).catch(() => {});
  }
}
