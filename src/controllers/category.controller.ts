import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import { Response } from "express";
import CategoryModel, { categoryDTO } from "../models/category.model";
import response from "../utils/response";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await categoryDTO.validate(req.body);
      const result = await CategoryModel.create(req.body);
      response.success(res, result, "Success create category");
    } catch (error) {
      response.error(res, error, "Failed create category");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
      } = req.query as unknown as IPaginationQuery;
      const query = {};
      if (search) {
        Object.assign(query, {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        });
      }

      const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await CategoryModel.countDocuments(query);
      response.pagination(
        res,
        result,
        { total: count, totalPage: Math.ceil(count / limit), current: page },
        "Success get all category"
      );
    } catch (error) {
      response.error(res, error, "Failed get all category");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to get one category. Id is not valid"
        );
      }

      const result = await CategoryModel.findById(id);
      if (!result) {
        return response.notFound(
          res,
          "Failed to get one category. Category is not found"
        );
      }

      response.success(res, result, "Success get one category");
    } catch (error) {
      response.error(res, error, "Failed get one category");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to update category. Id is not valid"
        );
      }

      const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success update category");
    } catch (error) {
      response.error(res, error, "Failed update category");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to remove category. Id is not valid"
        );
      }

      const result = await CategoryModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "Success remove category");
    } catch (error) {
      response.error(res, error, "Failed remove category");
    }
  },
};
