import express, { Request, Response, Router } from "express";
import { Paiement } from "../../types/types";
import fetch from "node-fetch"

const router: Router = express.Router();

router.get("", express.json(), async (req: Request, res: Response) => {
  const { num_adherent } = req.body;

  if (!num_adherent)
    return res.status(400).json({ Message: "No num_adherent provided" });

  const reqPaiement = await fetch(
    `${process.env.WS_SQL_EDC}/getPaiementEnLigne.php?num_adherent=${num_adherent}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (reqPaiement.status === 400)
    return res.status(400).json({
      Message: `Error fetching`,
    });

  const resPaiement = await reqPaiement.json();
  if (resPaiement === null) return res.status(200).json({});

  const formattedPaiement: Paiement = {
    "0": resPaiement[0][0],
    "1": resPaiement[0][1],
    "2": resPaiement[0][2],
    "3": resPaiement[0][3],
    "4": resPaiement[0][4],
    "5": resPaiement[0][5],
    Numero: resPaiement[0].Numero,
    Montant: resPaiement[0].Montant,
    DateAppelCotisation: resPaiement[0].DateAppelCotisation,
    IdCotisationAnnee: resPaiement[0].IdCotisationAnnee,
    MessageAccueil: resPaiement[0].MessageAccueil,
    MessagePaiement: resPaiement[0].MessagePaiement,
  };

  res.status(200).json(formattedPaiement);
});

router.get(
  "/appel2023",
  express.json(),
  async (req: Request, res: Response) => {
    const { id_adherent } = req.body;
    if (!id_adherent)
      return res.status(400).json({ Message: "No id_adherent provided" });

    const cReq = await fetch(
      `${process.env.WS_SQL_EDC}/getAppelCotissation2023.php?id_adherent=${id_adherent}`,
    );

    const cRes = await cReq.json();

    res.status(200).json(cRes);
  },
);

router.get("/new", express.json(), async (req: Request, res: Response) => {
  const { id_adherent, id_contact } = req.body;

  if (!id_adherent)
    return res.status(400).json({ Message: "No id_adherent provided" });

  const cReq = await fetch(
    `${process.env.WS_SQL_EDC}/getAttestations.php?id_adherent=${id_adherent}&IdContact=${id_contact}`,
  );

  const cRes = await cReq.json();

  res.status(200).json({ Cotisations: cRes });
});

router.get("/montant", express.json(), async (req: Request, res: Response) => {
  const cReq = await fetch(
    `${process.env.WS_SQL_EDC}/getMontantCotissation.php`,
  );

  const cRes = await cReq.json();

  res.status(200).json(cRes);
});

export default router;
