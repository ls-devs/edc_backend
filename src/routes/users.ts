import express, { Request, Response, Router } from "express";
import { prisma } from "../../db/getPrisma";
import Soap from "../../utils/getSoap";
const router: Router = express.Router();
import fetch from "node-fetch";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

const getSoapResult: (
  id_contact: string,
  emailAdh: string,
) => Promise<string | { Message: string }> = (
  id_contact: string,
  emailAdh: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.UpdateEmail(
        { IdContact: `${id_contact}`, email: `${emailAdh}` },
        (
          _err: string,
          result: {
            UpdateEmailResult: string;
          },
        ) => {
          return resolve(result.UpdateEmailResult);
        },
      );
    });
  });
};

router
  // GET User
  .get("", express.json(), async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email) return res.status(400).json({ Message: "No email provided" });

      if (!password)
        return res.status(400).json({ Message: "No password provided" });

      if (!/\S+@\S+\.\S+/.test(email))
        return res.status(400).json({ Message: "Invalid email" });

      const user = await prisma.adh_users.findFirst({
        where: {
          user_email: email,
        },
      });

      if (!user)
        return res
          .status(404)
          .json({ Message: "No user found with this emails" });

      const reqAdherent = await fetch("http://localhost:3000/adherents", {
        method: "POST",
        body: JSON.stringify({
          adherent_email: user.user_email,
          is_partenaire: user.partenaire,
          firstConnAfterRework: user.firstConnAfterRework,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resAdherent = await reqAdherent.json();
      return res.status(200).json(resAdherent);
    } catch (e) {
      res.status(500).json({ "Internal Error": e });
    }
  })
  // POST User
  .post("", express.json(), async (req: Request, res: Response) => {
    const {
      user_login,
      user_pass,
      user_nicename,
      user_email,
      user_url,
      user_activation_key,
      user_status,
      display_name,
      pro,
      partenaire,
      firstConnAfterRework,
    } = req.body;

    const user = await prisma.adh_users.create({
      data: {
        user_login,
        user_pass,
        user_nicename,
        user_email,
        user_url,
        user_registered: new Date(),
        user_activation_key,
        user_status,
        display_name,
        pro,
        partenaire,
        firstConnAfterRework,
      },
    });

    if (!user) res.status(400).json({ Message: "Error creating user" });

    console.log(user);
    res.status(200).json({ user });
  })

  // PUT Email
  .put("/email", express.json(), async (req: Request, res: Response) => {
    const { email, new_email, id_contact } = req.body;

    if (!email) return res.status(400).json({ Message: "No email provided" });

    if (!new_email)
      return res.status(400).json({ Message: "No new_email provided" });
    const actualUser = await prisma.adh_users.findFirst({
      where: { user_email: email },
    });

    if (!actualUser) return res.status(404).json({ Message: "User not found" });

    const updatedUser = await prisma.adh_users.update({
      where: { ID: actualUser?.ID },
      data: {
        user_email: new_email,
      },
    });

    await getSoapResult(id_contact, new_email);

    if (!updatedUser)
      return res.status(400).json({ Message: "Failed to update user" });

    res.status(200).json({ Message: "Email updated" });
  })
  // PUT Password
  .put("/password", express.json(), async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ Message: "No email provided" });

    if (!password)
      return res.status(400).json({ Message: "No email provided" });

    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ Message: "Invalid email" });

    const actualUser = await prisma.adh_users.findFirst({
      where: { user_email: email },
    });

    if (!actualUser) return res.status(404).json({ Message: "User not found" });

    const updatedUser = await prisma.adh_users.update({
      where: { ID: actualUser.ID },
      data: {
        user_pass: password,
      },
    });

    if (!updatedUser)
      return res.status(400).json({ Message: "Failed to update user" });

    res.status(200).json({ Message: "Password updated" });
  });

router.post("/id", express.json(), async (req: Request, res: Response) => {
  const { user_login } = req.body;
  if (!user_login) res.status(400).json({ Message: "No id provided" });

  try {
    const user = await prisma.adh_users.findMany({
      where: {
        user_login: {
          startsWith: user_login,
        },
      },
    });
    if (!user) res.status(400).json({ Message: "No user found" });
    console.log(user);

    res.status(200).json({ User: user });
  } catch (error) {
    console.log(error);
  }
});

router.put("", express.json(), async (req: Request, res: Response) => {
  const {
    user_login,
    user_pass,
    user_nicename,
    user_email,
    user_url,
    user_registered,
    user_activation_key,
    user_status,
    display_name,
    pro,
    partenaire,
    firstConnAfterRework,
  } = req.body;

  const dbUser = await prisma.adh_users.findFirst({
    where: {
      user_login: user_login,
    },
  });

  if (!dbUser) return res.status(400).json({ Message: "Cannot find user" });

  const user = await prisma.adh_users.update({
    where: {
      ID: dbUser.ID,
    },
    data: {
      user_login,
      user_pass,
      user_nicename,
      user_email,
      user_url,
      user_registered,
      user_activation_key,
      user_status,
      display_name,
      pro,
      partenaire,
      firstConnAfterRework,
    },
  });

  if (!user) res.status(400).json({ Message: "Cant PUT user " });

  res.status(200).json({ User: user });
});

router.get(
  "/lastlogin",
  express.json(),
  async (req: Request, res: Response) => {
    const lastLogin = await prisma.adh_users.findMany({
      select: {
        user_login: true,
      },
    });
    let nb = 0;
    lastLogin.forEach((user) => {
      if (Number(user.user_login) > nb) {
        nb = Number(user.user_login);
      }
    });
    res.status(200).json(nb);
  },
);

export default router;
