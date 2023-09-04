import express, { Request, Response, Router } from "express";
import fetch from "node-fetch"

const router: Router = express.Router();

router.get("", express.json(), async (req: Request, res: Response) => {
  const { id_adhesion } = req.body;

  if (!id_adhesion)
    return res.status(400).json({ Message: "No adherent ID provided" });

  const dReq = await fetch(
    `${process.env.WS_SQL_EDC}/getDocuments.php?id_adherent=${id_adhesion}`,
  );

  const dRes = await dReq.json();

  return res.status(200).json(dRes);
});

export default router;
