import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import EventModel, { eventDAO, TEvent } from "../models/event.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body, user: req.user?.id } as TEvent;
      await eventDAO.validate(payload);
      const result = await EventModel.create(payload);
      response.success(res, result, "Success to create an event");
    } catch (error) {
      response.error(res, error, "Failed to create an event");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TEvent> = {};

        if (filter.search) {
          query.$text = { $search: filter.search };
        }

        if (filter.category) {
          query.category = filter.category;
        }

        if (isFeatured) {
          query.isFeatured = filter.isFeatured;
        }

        if (isOnline) {
          query.isOnline = filter.isOnline;
        }

        if (isPublish) {
          query.isPublish = filter.isPublish;
        }
        return query;
      };

      const {
        limit = 10,
        page = 1,
        search,
        category,
        isOnline,
        isFeatured,
        isPublish,
      } = req.query;

      const query = buildQuery({
        search,
        category,
        isPublish,
        isFeatured,
        isOnline,
      });

      const result = await EventModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await EventModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPage: Math.ceil(count / +limit),
          current: +page,
        },
        "Success to find all event"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all event");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to get one event. Id is not valid"
        );
      }

      const result = await EventModel.findById(id);
      if (!result) {
        return response.notFound(
          res,
          "Failed to get one event. Event is not found"
        );
      }
      response.success(res, result, "Success to find one event");
    } catch (error) {
      response.error(res, error, "Failed to find one event");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to update event. Id is not valid"
        );
      }

      const result = await EventModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success to update event");
    } catch (error) {
      response.error(res, error, "Failed to update event");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to remove event. Id is not valid"
        );
      }

      const result = await EventModel.findByIdAndDelete(id, { new: true });
      response.success(res, result, "Success to remove an event");
    } catch (error) {
      response.error(res, error, "Failed to remove an event");
    }
  },
  async findOneBySlug(req: IReqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await EventModel.findOne({ slug });
      if (!result) {
        return response.notFound(
          res,
          "Failed to find an event by slug. Event is not found"
        );
      }
      response.success(res, result, "Success to find an event by slug");
    } catch (error) {
      response.error(res, error, "Failed to find an event by slug");
    }
  },
};
