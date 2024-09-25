import express, { Request, Response } from "express";
import { baseHandler } from "./base";
import { addCategories, deleteCategories, getCategories } from "../infrastructure/categories";
import { Type } from "@prisma/client";


export const categoriesRouter = express.Router();

categoriesRouter.get("/", (req: Request, res: Response) => {
  return baseHandler(res, getCategories, req.body);
});

categoriesRouter.post("/", (req: Request, res: Response) => {
  const newValues = req.body as Type[];

  return baseHandler(res, addCategories, newValues);
});

categoriesRouter.delete("/", (req: Request, res: Response) => {
  const ids = req.body as number[];

  return baseHandler(res, deleteCategories, ids);
});