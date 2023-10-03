import express, { Request, Response, Router } from "express";
import { prisma } from "../../db/getPrisma";
import fetch from "node-fetch";

const router: Router = express.Router();

router.get("/", express.json(), async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) res.status(400).json({ Messsage: "No email provided" });

  const user = await prisma.adh_users.findFirst({
    where: { user_email: email },
  });

  if (!user) res.status(400).json({ Message: "No user found" });

  const eReq = await fetch(
    `http://192168.1.147.4/wp-content/plugins/edc_adherent/ws_email.php?email=${email}`,
  );

  const eRes = await eReq.json();

  res.status(200).json(eRes);
});

export default router;
