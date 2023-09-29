/* eslint-disable @typescript-eslint/no-unused-vars */
import { adh_users } from "@prisma/client";
import { randomUUID } from "crypto";
import express, { Request, Response, Router } from "express";
import { prisma } from "../../db/getPrisma";
import { hashPass } from "../../utils/hashPass";
import fetch from "node-fetch";

const router: Router = express.Router();

router
  .post("/token", express.json(), async (req: Request, res: Response) => {
    const { user }: { user: adh_users } = req.body;

    if (!user) return res.status(400).json({ Message: "No user provided" });

    const allTokens = await prisma.token.findMany({
      where: {
        adh_usersID: user.ID,
      },
    });

    let alreadyUp: boolean = false;

    allTokens.map(async (token) => {
      if (
        token.isValid &&
        Math.abs(Date.now() - token.createdAt.getTime()) < 60 * 60 * 1000
      ) {
        alreadyUp = true;
      }
    });

    if (alreadyUp)
      return res.status(400).json({ Message: "A valid token is already up" });

    const token = await prisma.token.create({
      data: {
        tokenStr: randomUUID(),
        adh_usersID: user.ID,
      },
    });

    if (!token)
      return res.status(400).json({ Message: "Error creating token" });

    const url = "http://debug.edc.asso.fr/adherent-reinitialiser-mot-de-passe/";
    const message = `Veuillez modifier votre mot de passe en cliquant lien suivant : ${url}?token=${token.tokenStr} <br> Ce lien est valide pendant une heure.`;

    const sendMail = await fetch(
      `http://debug.edc.asso.fr/wp-admin/admin-ajax.php?action=mail_before_submit&toemail=${user.user_pass}&message=${message}`,
    );

    const resMail = await sendMail.json();

    res.status(200).json(resMail);
  })

  .get("/verify", express.json(), async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token) return res.status(400).json({ Message: "Token non fournit" });
    if (!password)
      return res
        .status(400)
        .json({ Message: "Veuillez rentrer un mot de passe" });

    const myToken = await prisma.token.findUnique({
      where: {
        tokenStr: token,
      },
    });

    if (!myToken)
      return res
        .status(400)
        .json({ Message: "Le token de validation n'existe pas" });

    if (!myToken.isValid)
      return res
        .status(400)
        .json({ Message: "Votre token de validation n'est pas valide" });

    if (Math.abs(Date.now() - myToken.createdAt.getTime()) > 60 * 60 * 1000) {
      await prisma.token.update({
        data: {
          isValid: false,
        },
        where: {
          tokenStr: token,
        },
      });
      return res
        .status(400)
        .json({ Message: "Votre token de validation a expiré" });
    }

    const myUser = await prisma.adh_users.findUnique({
      where: {
        ID: myToken.adh_usersID,
      },
    });

    if (!myUser)
      return res
        .status(400)
        .json({ Message: "Ce token n'appartient à aucun utilisateur" });

    const updatedToken = await prisma.token.update({
      data: {
        isValid: false,
      },
      where: {
        tokenStr: token,
      },
    });

    if (!updatedToken)
      return res
        .status(400)
        .json({ Message: "Impossible de modifier le token" });

    const updatedUser = await prisma.adh_users.update({
      data: {
        user_pass: await hashPass(password),
        firstConnAfterRework: false,
      },
      where: {
        ID: myUser.ID,
      },
    });

    if (!updatedUser)
      return res
        .status(400)
        .json({ Message: "Impossible de modifier l'utilisateur" });

    return res.status(200).json({ Message: "Mot de passe mis à jours" });
  });

export default router;
