import { RequestHandler } from "express";
import { db } from "../datastor/dao/Datastor";
import { Post } from "../types";

export type ExpressHandler<Req, Res> = RequestHandler<
  { id?: string },
  Partial<Res>,
  Partial<Req>,
  any
>;

type GetSinglePostResponse = { post: Post | null } | { erorr: string };
type GetSinglePostRequest = { id: string };

export const getPostById: ExpressHandler<GetSinglePostRequest, GetSinglePostResponse> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ post: null, erorr: "Missing post ID" });
    }

    const post = await db.getPostById(id);
    if (!post) {
      return res.status(404).send({ post: null, erorr: "Post not found" });
    }

    return res.status(200).send({ post });
  } catch (err) {
    next(err);
  }
};
