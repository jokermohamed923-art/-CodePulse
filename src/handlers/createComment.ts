import { RequestHandler } from "express";
import { db } from "../datastor/dao/Datastor";
import crypto from "crypto";
import { Commnet } from "../types";

export type ExpressHandler<Req, Res> = RequestHandler<
  { postId?: string },
  Partial<Res>,
  Partial<Req>,
  any
>;

type CreateCommentRequest = { text: string };
type CreateCommentResponse =
  | { comment: Commnet & { userName: string } }
  | { error: string };

export const createCommentHandler: ExpressHandler<
  CreateCommentRequest,
  CreateCommentResponse
> = async (req, res, next) => {
  try {
    const userId = res.locals.userId; // من الـ authMiddleware
    const { postId } = req.params;
    const { text } = req.body;

    if (!userId) return res.status(401).send({ error: "Unauthorized" });
    if (!postId || !text)
      return res.status(400).send({ error: "Missing postId or text" });

    const comment: Commnet = {
      id: crypto.randomUUID(),
      postId,
      userId,
      text,
      createdAt: new Date().toISOString(),
    };

    await db.createComment(comment);

    const user = await db.getUserById(userId);

    return res.status(201).send({
      comment: {
        ...comment,
        userName: user?.userName || "Unknown",
      },
    });
  } catch (err) {
    console.error("Error creating comment:", err);
    next(err);
  }
};

// type RequestComments = {};
// type ResponseComments =
//   | { comments: (Commnet & { userName: string })[] }
//   | { error: string };

// export const listComment: ExpressHandler<RequestComments, ResponseComments> = async (req, res, next) => {
//   const { postId } = req.params;

//   if (!postId)
//     return res.status(400).send({ error: "Missing postId" });

//   try {
//     const comments = await db.listComment(postId);
//     return res.status(200).send({ comments });
//   } catch (err) {
//     console.error("Error fetching comments:", err);
//     next(err);
//   }
// };


type ListCommentResponse =
  | { comments: Commnet [] }
  | { error: string };

export const listCommentHandler: ExpressHandler<{}, ListCommentResponse> = async (
  req,
  res,
  next
) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).send({ error: "Missing postId" });
    }

    // استدعاء دالة listComment من DAO
    const comments = await db.listComment(postId);

    return res.status(200).send({ comments });
  } catch (err) {
    console.error("Error listing comments:", err);
    next(err);
  }
};
