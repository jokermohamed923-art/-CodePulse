import { RequestHandler } from "express";
import { db } from "../datastor/dao/Datastor";

export type ExpressHandler<Req, Res> = RequestHandler<
  { postId?: string },
  Partial<Res>,
  Partial<Req>,
  any
>;

type DeletePostResponse =
  | { success: true; message: string }
  | { error: string };

export const deletePostHandler: ExpressHandler<{}, DeletePostResponse> = async (
  req,
  res,
  next
) => {
  try {
    const userId = res.locals.userId; // من الـ authMiddleware
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    if (!postId) {
      return res.status(400).send({ error: "Missing postId" });
    }

    // حذف البوست
    await db.deletePost(postId, userId);

    return res.status(200).send({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    next(err);
  }
};
