import { Document } from 'mongoose';

type Doc = Document<unknown, {}, unknown> & Required<{ _id: unknown }>;
type Ret = Record<string, any>;
export const transformDoc = (doc: Doc, ret: Ret) => {
  ret.id = ret._id;
  delete ret._id;
  return ret;
};