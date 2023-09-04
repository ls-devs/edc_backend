import express, { Request, Response, Router } from "express";
import * as fs from "fs";
const router: Router = express.Router();

router.get("", express.json(), async (req: Request, res: Response) => {
  const { num_adhesion }: { num_adhesion: string } = req.body;

  if (!num_adhesion)
    return res.status(400).json({ Message: "No num_adhesion provided" });

  const adhPdfPath =
    "/var/www/file.edc.asso.fr/html/pdfs/ad2015/" +
    num_adhesion.slice(0, 1) +
    "/" +
    num_adhesion.slice(0, 2).trim() +
    "000/" +
    num_adhesion +
    "/";

  const filesList: string[] = [];
  if (fs.existsSync(adhPdfPath))
    fs.readdirSync(adhPdfPath).forEach((file) => {
      filesList.push(file);
    });
    console.log(filesList);
  return res.status(200).json(filesList);
});

export default router;
