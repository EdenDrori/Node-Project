import Joi from "joi";

const validation = (schema: Joi.ObjectSchema, userBody: any) => {
  const { error } = schema.validate(userBody);
  if (!error) {
    return null;
  }
//בגלל שעוצרים אחרי שגיאה אחת לא צריך את הלולאה אבל אם נרצה לעבור את כל הפרמטרים ולבדוק אותם נפעיל את :הלולאה
  //   const { details } = error;
  //     let errorObj: Record<string,any> = {};

  //   for (let detail of details) {
  //     let key = detail.path[0];
  //     let { message } = detail;
  //     errorObj[key] = message;
  //   }
  const { message, path } = error.details[0];
  return { message, path };
};
export { validation };
