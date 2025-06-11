import * as yup from "yup";
import mongoose, { ObjectId } from "mongoose";

const Schema = mongoose.Schema;

export const TICKET_MODEL_NAME = "Ticket";

export const ticketDTO = yup.object().shape({
  price: yup.number().required(),
  name: yup.string().required(),
  event: yup.string().required(),
  description: yup.string().required(),
  quantity: yup.number().required(),
});

export type TTicket = yup.InferType<typeof ticketDTO>;

export interface Ticket extends Omit<TTicket, "event"> {
  event: ObjectId;
}

const TicketShema = new Schema<Ticket>(
  {
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    quantity: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  { timestamps: true }
).index({ name: "text" });

const TicketModel = mongoose.model(TICKET_MODEL_NAME, TicketShema);
export default TicketModel;
