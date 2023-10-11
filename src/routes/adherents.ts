/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
import { Adherent } from "../../types/types";
import { parseSoapXML } from "../../utils/parseSoap";

const router: Router = express.Router();

const getSoapResult: (
  emailAdh: string,
) => Promise<string | { Message: string }> = (
  emailAdh: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve, _reject) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetAdherentDonnees(
        { EmailAdherent: `${emailAdh}` },
        (
          _err: string,
          result: {
            GetAdherentDonneesResult: string;
          },
        ) => {
          return resolve(result.GetAdherentDonneesResult);
        },
      );
    });
  });
};

router.post("", express.json(), async (req: Request, res: Response) => {
  const { adherent_email, is_partenaire, firstConnAfterRework } = req.body;
  if (!adherent_email)
    return res.status(400).json({ Message: "No email provided" });
  const soapData = await getSoapResult(adherent_email);
  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  const adhJson = await parseSoapXML<Adherent>(soapData);
  const adherent = adhJson.DocumentElement.Adherent[0];

  const formatedAdh = {
    IdContact: adherent.IdContact[0],
    IdAdhesion: adherent.IdAdhesion[0],
    NumAdhesion: adherent.NumAdhesion[0],
    DateAdhesion: adherent.DateAdhesion[0],
    Civilite: adherent.Civilite[0],
    Nom: adherent.Nom[0],
    Prenom: adherent.Prenom[0],
    Adresse1: adherent.Adresse1[0],
    Adresse2: adherent.Adresse2[0],
    Adresse3: adherent.Adresse3[0],
    Npai_bool: adherent.Npai_bool[0],
    CodePostal: adherent.CodePostal[0],
    Ville: adherent.Ville[0],
    PAYS: adherent.PAYS[0],
    Email: adherent.Email[0],
    TypePaiement: adherent.TypePaiement[0],
    IsPartenaire: is_partenaire,
    firstConnAfterRework: firstConnAfterRework,
    DateNaissance: adherent.DateNaissance?.[0],
  };


  res.status(200).json(formatedAdh);
});

export default router;
