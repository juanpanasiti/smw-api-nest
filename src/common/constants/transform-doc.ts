import { Document } from 'mongoose';

type Doc = Document<unknown, {}, unknown> & Required<{ _id: unknown }>;
type Ret = Record<string, any>;
export const transformDoc = (doc: Doc, ret: Ret) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.isActive;
  if(ret.amount && typeof ret.amount === 'number') ret.amount = +ret.amount.toFixed(2)
  return ret;
};
