import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import uploader from "../utils/uploader";

export default {
  async single(req: IReqUser, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: "File is not found", data: null });
    }
    try {
      const result = await uploader.uploadSingle(
        req.file as Express.Multer.File
      );
      res.status(200).json({ message: "Success upload file", data: result });
    } catch {
      res.status(400).json({ message: "Failed upload file", data: null });
    }
  },

  async multiple(req: IReqUser, res: Response) {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Files are not found", data: null });
    }
    try {
      const result = await uploader.uploadMultiple(
        req.files as Express.Multer.File[]
      );
      res.status(200).json({ message: "Success upload files", data: result });
    } catch {
      res.status(400).json({ message: "Failed upload files", data: null });
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await uploader.remove(fileUrl);
      res.status(200).json({ message: "Success remove file", data: result });
    } catch {
      res.status(400).json({ message: "Failed remove file", data: null });
    }
  },
};
