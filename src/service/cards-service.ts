import { RequestHandler } from "express";
import { ICard } from "../@types/card";
import { Card } from "../database/model/card";
import { BizCardsError } from "../error/biz-cards-error";
import { Logger } from "../logs/logger";
import { extractToken } from "../middleware/is-admin";
import { isBusiness } from "../middleware/is-business";
import { auth } from "./auth-service";
import { User } from "../database/model/user";
import { ICardInput } from "./../@types/card.d";
const createCard = async (data: ICardInput, userId: string) => {
  //bizNumber, userId
  const card = new Card(data);

  card.userId = userId;
  //random number that does not exist in the database:
  while (true) {
    const random = Math.floor(Math.random() * 1_000_000);
    const dbRes = await Card.findOne({ bizNumber: random });
    if (!dbRes) {
      card.bizNumber = random;
      break;
    }
  }

  return card.save();
};



// const userIdOnCard: RequestHandler = async (req, res, next) => {
//   const token = extractToken(req);
//   const { email } = auth.verifyJWT(token);
//   //get user from database
//   const user = await User.findOne({ email });
//   const userId = user.id;
//   Logger.debug("user id succsses");
//   req.body.userId = userId;
//   next();
// };

// const createCard = async (cardData: ICard) => {
//   const card = new Card(cardData);

//   if (!card.bizNumber) {
//     card.bizNumber = randomBizNumber(10000, 99999999999);
//   }
//   Logger.debug("biz number successed");
//   //   card.password = await auth.hashPassword(card.password);
//   //const isBusiness =await isBusiness(req)
//   return card.save();
//   // TODO: לבדוק אם המשתמש ביזנס
// };

// const validatecard = async (email: string, password: string) => {
//   const card = await Card.findOne({ email });

//   if (!card) {
//     throw new BizCardsError("Bad credentials", 401);
//   }

//   //check the password:
//   //   const isPasswordValid = await auth.validatePassword(password, card.password);

//   //   if (!isPasswordValid) {
//   //     throw new BizCardsError("Bad credentials", 401);
//   //   }

//   const jwt = auth.generateJWT({ email });

//   return { jwt };
// };

export { createCard };
