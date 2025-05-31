import { Response } from "express";
import response from "../utils/response";
import TicketModel, { ticketDAO, TTicket } from "../models/ticket.model";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body } as TTicket;
      await ticketDAO.validate(payload);
      const result = await TicketModel.create(payload);
      response.success(res, result, "Success to create a ticket");
    } catch (error) {
      response.error(res, error, "Failed to create a ticket");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TTicket> = {};
      if (search) {
        Object.assign(query, {
          $text: { $search: search },
        });
      }

      const result = await TicketModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await TicketModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPage: Math.ceil(count / limit),
          current: page,
        },
        "Success to get all tickets"
      );
    } catch (error) {
      response.error(res, error, "Failed to get all tickets");
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to get one ticket. Id is not valid"
        );
      }

      const result = await TicketModel.findById(id);
      if (!result) {
        return response.notFound(
          res,
          "Failed to get one ticket. Ticket is not found"
        );
      }
      response.success(res, result, "Success to get one ticket");
    } catch (error) {
      response.error(res, error, "Failed to get one ticket");
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to update ticket. Id is not valid"
        );
      }

      const result = await TicketModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "Success to update ticket");
    } catch (error) {
      response.error(res, error, "Failed to update ticket");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(
          res,
          "Failed to remove ticket. Id is not valid"
        );
      }

      const result = await TicketModel.findByIdAndDelete(id, { new: true });
      response.success(res, result, "Success to remove ticket");
    } catch (error) {
      response.error(res, error, "Failed to remove ticket");
    }
  },

  async findTicketsByEvent(req: IReqUser, res: Response) {
    try {
      const { event } = req.params;
      if (!isValidObjectId(event)) {
        return response.notFound(
          res,
          "Failed to get one ticket by event. Id is not valid"
        );
      }

      const result = await TicketModel.find({ event });
      if (!result) {
        return response.notFound(
          res,
          "Failed to get one ticket by event. Ticket is not found"
        );
      }

      response.success(res, result, "Success to get one ticket");
    } catch (error) {
      response.error(res, error, "Failed to get one ticket");
    }
  },
};
