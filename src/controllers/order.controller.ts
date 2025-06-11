import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import OrderModel, {
  orderDTO,
  OrderStatus,
  TypeOrder,
  TypeVoucher,
} from "../models/order.model";
import TicketModel from "../models/ticket.model";
import { FilterQuery } from "mongoose";
import { getId } from "../utils/id";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const payload = {
        ...req.body,
        createdBy: userId,
      } as TypeOrder;

      await orderDTO.validate(payload);

      const ticket = await TicketModel.findById(payload.ticket);
      if (!ticket) {
        return response.notFound(
          res,
          "Failed to create order. Ticket is not found"
        );
      }

      if (ticket.quantity < payload.quantity) {
        return response.error(
          res,
          null,
          "Failed to create order. Quantity is not enough"
        );
      }

      const total: number = +ticket.price * +payload.quantity;

      Object.assign(payload, { ...payload, total });

      const result = await OrderModel.create(payload);
      response.success(res, result, "Success to create an order");
    } catch (error) {
      response.error(res, error, "Failed to create order");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeOrder> = {};

        if (filter.search) {
          query.$text = { $search: filter.search };
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

      const result = await OrderModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await OrderModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPage: Math.ceil(count / +limit),
          current: +page,
        },
        "Success to find all orders"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all event");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await OrderModel.findOne({ orderId });

      if (!result) {
        return response.notFound(
          res,
          "Failed to get an order. Order is not found"
        );
      }
      response.success(res, result, "Success to find one order");
    } catch (error) {
      response.error(res, error, "Failed to get an order");
    }
  },

  async findAllByMember(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        const userId = req.user?.id;
        let query: FilterQuery<TypeOrder> = {
          createdBy: userId,
        };

        if (filter.search) {
          query.$text = { $search: filter.search };
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

      const result = await OrderModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await OrderModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPage: Math.ceil(count / +limit),
          current: +page,
        },
        "Success to find all orders"
      );
    } catch (error) {
      response.error(res, error, "Failed to find all event");
    }
  },

  async complete(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const order = await OrderModel.findOne({ orderId, createdBy: userId });
      if (!order) {
        return response.notFound(
          res,
          "Failed to complete order. Order is not found"
        );
      }

      if (order.status === OrderStatus.COMPLETED) {
        return response.error(
          res,
          null,
          "Failed to complete order. Order is already completed"
        );
      }

      const vouchers: TypeVoucher[] = Array.from(
        { length: order.quantity },
        () => {
          return {
            isPrint: false,
            voucherId: getId(),
          } as TypeVoucher;
        }
      );

      const result = await OrderModel.findOneAndUpdate(
        {
          orderId,
          createdBy: userId,
        },
        {
          vouchers,
          status: OrderStatus.COMPLETED,
        },
        { new: true }
      );

      const ticket = await TicketModel.findById(order.ticket);
      if (!ticket) {
        return response.notFound(
          res,
          "Failed to complete order. Ticket is not found"
        );
      }

      await TicketModel.updateOne(
        { _id: ticket._id },
        { $set: { quantity: ticket.quantity - order.quantity } }
      );

      response.success(res, result, "Success to complete an order");
    } catch (error) {
      response.error(res, error, "Failed to complete order");
    }
  },

  async pending(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await OrderModel.findOne({ orderId });
      if (!order) {
        return response.notFound(
          res,
          "Failed to pending order. Order is not found"
        );
      }

      if (order.status === OrderStatus.COMPLETED) {
        return response.error(
          res,
          null,
          "Failed to pending order. Order is already completed"
        );
      }

      if (order.status === OrderStatus.PENDING) {
        return response.error(
          res,
          null,
          "Failed to pending order. Order is already pending"
        );
      }

      const result = await OrderModel.findOneAndUpdate(
        {
          orderId,
        },
        {
          status: OrderStatus.PENDING,
        },
        { new: true }
      );

      response.success(res, result, "Success to pending an order");
    } catch (error) {
      response.error(res, error, "Failed to pending order");
    }
  },
  async cancelled(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await OrderModel.findOne({ orderId });
      if (!order) {
        return response.notFound(
          res,
          "Failed to cancel order. Order is not found"
        );
      }

      if (order.status === OrderStatus.COMPLETED) {
        return response.error(
          res,
          null,
          "Failed to cancel order. Order is already completed"
        );
      }

      if (order.status === OrderStatus.CANCELLED) {
        return response.error(
          res,
          null,
          "Failed to cancel order. Order is already cancelled"
        );
      }

      const result = await OrderModel.findOneAndUpdate(
        {
          orderId,
        },
        {
          status: OrderStatus.CANCELLED,
        },
        { new: true }
      );

      response.success(res, result, "Success to cancel an order");
    } catch (error) {
      response.error(res, error, "Failed to cancelled order");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await OrderModel.findByIdAndDelete(
        { orderId },
        { new: true }
      );

      if (!result) {
        response.notFound(res, "Failed to remove order. Order is not found");
      }

      response.success(res, result, "Success to remove an order");
    } catch (error) {
      response.error(res, error, "Failed to cancelled order");
    }
  },
};
