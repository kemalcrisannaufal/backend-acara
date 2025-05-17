import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

type TRegister = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullname: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test(
      "at-least-one-uppercase-letter",
      "Contains at least one uppercase letter",
      (value) => {
        if (!value) {
          return false;
        }

        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test("at-least-one-number", "Contains at least one number", (value) => {
      if (!value) {
        return false;
      }

      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password doesn't match"),
});

const loginValidateSchema = Yup.object({
  identifier: Yup.string().required(),
  password: Yup.string().required(),
});

export default {
  /**
   #swagger.tags = ['Auth']
   */
  async register(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
      required:true,
      schema: {$ref: "#/components/schemas/RegisterRequest" }
     }
     */
    const { fullname, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullname,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullname,
        username,
        email,
        password,
      });

      response.success(res, result, "Success Registration");
    } catch (error) {
      response.error(res, error, "Failed Registration");
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody={
      required:true,
      schema: {$ref: "#/components/schemas/LoginRequest" }
    }
    */

    const { identifier, password } = req.body as unknown as TLogin;
    try {
      await loginValidateSchema.validate({ identifier, password });

      // ambil data user berdasarkan "identifier" -> email dan username
      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
        isActive: true,
      });

      // Validasi password input dengan password di database
      if (!userByIdentifier) {
        return response.unathorize(res, "user not found");
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return response.unathorize(res, "user not found");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      response.success(res, token, "Success Login");
    } catch (error) {
      response.error(res, error, "Failed Login");
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.security=[{ "bearerAuth": [] }]
     */
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);
      response.success(res, result, "Success Get User Profile");
    } catch (error) {
      response.error(res, error, "Failed Get User Profile");
    }
  },

  async activation(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody={
       required:true,
       schema: {$ref: "#/components/schemas/ActivationRequest"}

     }
     */
    try {
      const { code } = req.body as { code: string };

      const user = await UserModel.findOneAndUpdate(
        { activationCode: code },
        { isActive: true },
        { new: true }
      );

      response.success(res, user, "User successfully activated");
    } catch (error) {
      response.error(res, error, "Failed Activation User");
    }
  },
};
