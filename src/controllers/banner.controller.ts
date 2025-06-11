import { FilterQuery, isValidObjectId } from "mongoose";
import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import BannerModel, { Banner, bannerDTO } from "../models/banner.model";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await bannerDTO.validate(req.body);
      const result = await BannerModel.create(req.body);
      response.success(res, result, "Success to create banner");
    } catch (error) {
      response.error(res, error, "Failed to create banner");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
      } = req.query as unknown as IPaginationQuery;
      const query: FilterQuery<Banner> = {};
      if (search) {
        Object.assign(query, {
          $text: { $search: search },
        });
      }
      const result = await BannerModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await BannerModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPage: Math.ceil(count / limit),
          current: page,
        },
        "Success to find all banner"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all banner");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to get one banner. Id is not valid"
        );
      }

      const result = await BannerModel.findById(id);
      if (!result) {
        return response.notFound(
          res,
          "Failed to get one banner. Banner is not found"
        );
      }

      response.success(res, result, "Success to find one banner");
    } catch (error) {
      response.error(res, error, "Failed to find one banner");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to update banner. Id is not valid"
        );
      }

      const result = await BannerModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success to update banner");
    } catch (error) {
      response.error(res, error, "Failed to update banner");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to remove banner. Id is not valid"
        );
      }

      const result = await BannerModel.findByIdAndDelete(id, { new: true });
      response.success(res, result, "Success to remove banner");
    } catch (error) {
      response.error(res, error, "Failed to remove banner");
    }
  },
};
