import { RequestHandler, Request } from "express";
import { auth } from "../service/auth-service";
import { User } from "../database/model/user";
import { extractToken } from "./is-admin";
import { BizCardsError } from "../error/biz-cards-error";
import { IUser } from "../@types/user";
import { Logger } from "../logs/logger";
import { isValidObjectId } from "mongoose";

const isUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const valid = isValidObjectId(id);
    if (!valid) {
      throw new BizCardsError("The Id is not type of ObjectId", 401);
    }
    const userExist = await User.findById(id);
    if (!userExist) throw new BizCardsError("User does not exist", 401);
    const token = extractToken(req);
    const { email } = auth.verifyJWT(token);

    //get user from database
    const user = (await User.findOne({ email }).lean()) as IUser;

    req.user = user;

    if (!user) throw new BizCardsError("User does not exist", 401);

Logger.debug(id == user?._id);
    if (id == user?._id) return next();

    res.status(401).json({ message: "The id must belong to the user" });
  } catch (e) {
    next(e);
  }
};

export { isUser };
