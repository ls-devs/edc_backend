import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
import { AllFiches, Fiche, FmtFiche } from "../../types/types";
import { parseSoapXML } from "../../utils/parseSoap";

const router: Router = express.Router();

const getSoapResult: (
  ficheID: string
) => Promise<string | { Message: string }> = (
  ficheID: string
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetInfoFiche(
        { IdFiche: ficheID },
        (_err: string, result: { GetInfoFicheResult: string }) => {
          return resolve(result.GetInfoFicheResult);
        }
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const { fiche_id } = req.body;
  if (!fiche_id)
    return res.status(400).json({ Message: "No fiche ID provided" });

  const soapData = await getSoapResult(fiche_id);
  if (typeof soapData !== "string")
    return res.status(400).json({ Message: soapData });

  const ficheInfos = await parseSoapXML<Fiche>(soapData);
  const fiche = ficheInfos.DocumentElement.fiche[0];
  const fmtFiche: FmtFiche = {
    FicheId: fiche.FicheId[0],
    FicheRef: fiche.FicheRef[0],
    DatePriseEnCompte: fiche.DatePriseEnCompte[0],
    Domaine: fiche.Domaine[0],
    Gestionnaire: fiche.Gestionnaire[0],
    Statut: fiche.Statut[0],
    DateDerniereAction: fiche.DateDerniereAction[0],
    lib_statut: fiche.lib_statut[0],
    lib_histo: fiche.lib_histo[0],
    Lot: fiche.Lot?.[0],
    Programme: fiche.Programme?.[0],
    SousDomaine: fiche.SousDomaine?.[0],
    DateCloture: fiche.DateCloture?.[0],
  };
  res.status(200).json({ fiche: fmtFiche });
});

const getSoapResultAll: (
  num_adherent: string
) => Promise<string | { Message: string }> = (
  num_adherent: string
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetListeFichesAdherent(
        { EmailAdherent: num_adherent },
        (_err: string, result: { GetListeFichesAdherentResult: string }) => {
          return resolve(result.GetListeFichesAdherentResult);
        }
      );
    });
  });
};

router.get("/all", express.json(), async (req: Request, res: Response) => {
  const { adherent_email } = req.body;
  if (!adherent_email)
    return res.status(400).json({ Message: "No adherent_email provided" });

  const soapData = await getSoapResultAll(adherent_email);
  if (typeof soapData !== "string")
    return res.status(400).json({ Message: soapData });

  const ficheInfos = await parseSoapXML<AllFiches>(soapData);
  const fmtFiches: FmtFiche[] = [];
  ficheInfos.DocumentElement.Fiches.forEach((fiche) => {
    fmtFiches.push({
      FicheId: fiche.FicheId[0],
      FicheRef: fiche.FicheRef[0],
      DatePriseEnCompte: fiche.DatePriseEnCompte[0],
      Domaine: fiche.Domaine[0],
      Gestionnaire: fiche.Gestionnaire[0],
      Statut: fiche.Statut[0],
      DateDerniereAction: fiche.DateDerniereAction[0],
      lib_statut: fiche.lib_statut[0],
      Lot: fiche.Lot?.[0],
      Programme: fiche.Programme?.[0],
      DateCloture: fiche.DateCloture?.[0],
      SousDomaine: fiche.SousDomaine?.[0],
      lib_histo: fiche.lib_histo[0],
    });
  });

  res.status(200).json({ Fiches: fmtFiches });
});

export default router;
