import express, { Request, Response, Router } from "express";
import {
  DetailCotisation,
  FmtDetailCotisation,
  Paiement,
} from "../../types/types";
import fetch from "node-fetch";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";

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

const getSoapResult: (
  idCotisation: string,
  idContact: string,
) => Promise<string | { Message: string }> = (
  idCotisation: string,
  idContact: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetDetailCotisation(
        {
          IdCotisation: idCotisation,
          IdContact: idContact,
        },
        (
          _err: string,
          result: {
            GetDetailCotisationResult: string;
          },
        ) => {
          return resolve(result.GetDetailCotisationResult);
        },
      );
    });
  });
};

router.get("/details", express.json(), async (req: Request, res: Response) => {
  const { idContact, idCotisation } = req.body;

  if (!idContact) res.status(400).json({ Message: "No idContact provided" });
  if (!idCotisation)
    res.status(400).json({ Message: "No idCotisation provided" });

  const soapData = await getSoapResult(idCotisation, idContact);
  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  const detailSoap = await parseSoapXML<DetailCotisation>(soapData);

  const fmtDetails: FmtDetailCotisation = {
    Annee: detailSoap.DocumentElement?.cotisation[0]?.Annee[0],
    IdAdhesion: detailSoap.DocumentElement?.cotisation[0]?.IdAdhesion[0],
    Numero: detailSoap.DocumentElement?.cotisation[0]?.Numero[0],
    idcontact: detailSoap.DocumentElement?.cotisation[0]?.idcontact[0],
    nom: detailSoap.DocumentElement?.cotisation[0]?.nom[0],
    prenom: detailSoap.DocumentElement?.cotisation[0]?.prenom[0],
    intitule: detailSoap.DocumentElement?.cotisation[0]?.intitule[0],
    CiviliteCourte:
      detailSoap.DocumentElement?.cotisation[0]?.CiviliteCourte[0],
    Adresse1: detailSoap.DocumentElement?.cotisation[0]?.Adresse1[0],
    Adresse2: detailSoap.DocumentElement?.cotisation[0]?.Adresse2[0],
    Adresse3: detailSoap.DocumentElement?.cotisation[0]?.Adresse3[0],
    CodePostal: detailSoap.DocumentElement?.cotisation[0]?.CodePostal[0],
    Ville: detailSoap.DocumentElement?.cotisation[0]?.Ville[0],
    pays: detailSoap.DocumentElement?.cotisation[0]?.pays[0],
    mode_reglement:
      detailSoap.DocumentElement?.cotisation[0]?.mode_reglement[0],
    DateEncaissementCotisation:
      detailSoap.DocumentElement?.cotisation[0]?.DateEncaissementCotisation[0],
    MontantCotisation:
      detailSoap.DocumentElement?.cotisation[0]?.MontantCotisation[0],
  };
  res.status(200).json(fmtDetails);
});

export default router;
