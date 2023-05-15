import { BeAnObject, DocumentType as MgDocumentType } from "@typegoose/typegoose/lib/types";
import { FilterQuery, UpdateQuery, Document as MgDocument} from "mongoose";

export type MgFilterQuery<T> = FilterQuery<MgDocumentType<T & MgDocument, BeAnObject>>
export type MgUpdateQuery<T> = UpdateQuery<MgDocumentType<T & MgDocument, BeAnObject>>
export type MgPartial<T> = Partial<MgDocumentType<T & MgDocument, BeAnObject>>