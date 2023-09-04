import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";
import {
  ADFInvestissement,
  DetailsInvestissement,
  FmtDetailsInvestissement,
  FmtIInterInverstissement,
  FmtInvestissements,
  IInterInvestissement,
  Investissements,
} from "../../types/types";

const router: Router = express.Router();

const getSoapResult: (
  emailAdh: string,
) => Promise<string | { Message: string }> = (
  emailAdh: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetListeInvestissementsAdherent(
        { EmailAdherent: `${emailAdh}` },
        (
          _err: string,
          result: {
            GetListeInvestissementsAdherentResult: string;
          },
        ) => {
          return resolve(result.GetListeInvestissementsAdherentResult);
        },
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const { email_adherent } = req.body;

  if (!email_adherent)
    return res.status(400).json({ Message: "No email_adherent provided" });

  const soapData = await getSoapResult(email_adherent);

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  const investissement = await parseSoapXML<Investissements>(soapData);

  const fmtInvestissement: FmtInvestissements[] = [];

  if (investissement.DocumentElement.Invest) {
    investissement.DocumentElement.Invest.forEach((invest) => {
      fmtInvestissement.push({
        IdProgramme: invest.IdProgramme[0],
        Nom: invest.Nom[0],
        Adresse: invest.Adresse[0],
        NombreLotResidence: invest.NombreLotResidence?.[0],
        Ville: invest.Ville[0],
        CodePostal: invest.CodePostal[0],
        Pays: invest.Pays[0],
        DateLivraisonReelle: invest.DateLivraisonReelle?.[0],
        DateLivraisonPrevisionnelle: invest.DateLivraisonPrevisionnelle?.[0],
        DateLivraisonPrevisionnelleInitiale:
          invest.DateLivraisonPrevisionnelleInitiale?.[0],
        Promoteur: invest.Promoteur?.[0],
        ADBPROG: invest.ADBPROG?.[0],
        ConseillerVendeur: invest.ConseillerVendeur?.[0],
        Syndic: invest.Syndic?.[0],
        IdInvestissement: invest.IdInvestissement[0],
        DateActe: invest.DateActe?.[0],
        DateLivraison: invest.DateLivraison?.[0],
        DateSignature: invest.DateSignature[0],
        LoiFiscale: invest.LoiFiscale[0],
        RefNum: invest.RefNum[0],
        NbPb: invest.NbPb[0],
      });
    });
  }

  return res.status(200).json({ Invest: fmtInvestissement });
});

const getSoapResultDetails: (
  id_investissement: string,
) => Promise<string | { Message: string }> = (
  id_investissement: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetDetailsInvestissement(
        { IdInvestissement: `${id_investissement}` },
        (
          _err: string,
          result: {
            GetDetailsInvestissementResult: string;
          },
        ) => {
          return resolve(result.GetDetailsInvestissementResult);
        },
      );
    });
  });
};

router.get("/details", express.json(), async (req: Request, res: Response) => {
  const { id_investissement } = req.body;
  if (!id_investissement)
    res.status(400).json({ Message: "No id_investissement provided" });

  const soapData = await getSoapResultDetails(id_investissement);

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  const listeDetails = await parseSoapXML<DetailsInvestissement>(soapData);
  const details: FmtDetailsInvestissement[] = [];

  if (listeDetails.DocumentElement.Invest) {
    listeDetails.DocumentElement.Invest.forEach((detail) => {
      details.push({
        RefNum: detail.RefNum?.[0],
        DateSignature: detail.DateSignature?.[0],
        DateLivraisonPrevisionnelle: detail.DateLivraisonPrevisionnelle?.[0],
        DateLivraisonReelle: detail.DateLivraisonReelle?.[0],
        InvestissementProduit: detail.InvestissementProduit?.[0],
        Programme: detail.Programme?.[0],
        SurfaceHabitable: detail.SurfaceHabitable?.[0],
        SurfaceAnnexe: detail.SurfaceAnnexe?.[0],
        MontantTTCLogement: detail.MontantTTCLogement?.[0],
        MontantTTCParking: detail.MontantTTCParking?.[0],
        LoyerMensuelLogement: detail.LoyerMensuelLogement?.[0],
        LoyerMensuelParking: detail.LoyerMensuelParking?.[0],
        H2Envoye_bool: detail.H2Envoye_bool?.[0],
        DateLocationInitiale: detail.DateLocationInitiale?.[0],
      });
    });
  }

  res.status(200).json({ Invest: details[0] });
});

const getSoapResultADF: (
  id_investissement: string,
) => Promise<string | { Message: string }> = (
  id_investissement: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetADFInvestissement(
        { IdInvestissement: `${id_investissement}` },
        (
          _err: string,
          result: {
            GetADFInvestissementResult: string;
          },
        ) => {
          return resolve(result.GetADFInvestissementResult);
        },
      );
    });
  });
};

router.get("/adf", express.json(), async (req: Request, res: Response) => {
  const { id_investissement } = req.body;
  if (!id_investissement)
    return res.status(400).json({ Message: "No id_investissement provided" });

  const soapData = await getSoapResultADF(id_investissement);

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  const listeDetails = await parseSoapXML<ADFInvestissement>(soapData);

  return res.status(200).json(listeDetails.DocumentElement.adf);
});

const getSoapResultInter: (
  id_investissement: string,
) => Promise<string | { Message: string }> = (
  id_investissement: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIInterInvestissement(
        { IdInvestissement: `${id_investissement}` },
        (
          _err: string,
          result: {
            GetIInterInvestissementResult: string;
          },
        ) => {
          return resolve(result.GetIInterInvestissementResult);
        },
      );
    });
  });
};

router.get("/inter", express.json(), async (req: Request, res: Response) => {
  const { id_investissement } = req.body;

  if (!id_investissement)
    return res.status(400).json({ Message: "No id_investissement provided" });

  const soapData = await getSoapResultInter(id_investissement);

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  const interInvest = await parseSoapXML<IInterInvestissement>(soapData);

  const fmtInterInvest: FmtIInterInverstissement[] = [];

  if (interInvest.DocumentElement.iinter) {
    interInvest.DocumentElement.iinter.forEach((invest) => {
      fmtInterInvest.push({
        DateEnvoiPromoteur: invest.DateEnvoiPromoteur?.[0],
        DateEnvoiPromoteurBanque: invest.DateEnvoiPromoteurBanque?.[0],
        Montant: invest.Montant?.[0],
      });
    });
  }

  res.status(200).json({ iinter: fmtInterInvest });
});

export default router;
