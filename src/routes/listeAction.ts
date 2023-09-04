/* eslint-disable @typescript-eslint/ban-ts-comment */
import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";
import { Actions, FmtListeActions, ListeActions } from "../../types/types";

const router: Router = express.Router();

const getSoapResult: (
  ficheID: string,
) => Promise<string | { Message: string }> = (
  ficheID: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetListeActionsFiche(
        { IdFiche: ficheID },
        (_err: string, result: { GetListeActionsFicheResult: string }) => {
          return resolve(result.GetListeActionsFicheResult);
        },
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const { fiche_id } = req.body;

  if (!fiche_id)
    return res.status(400).json({ Message: "No fiche_id provided" });

  const soapData = await getSoapResult(fiche_id);
  if (typeof soapData !== "string")
    return res.status(400).json({ Message: soapData });

  const listeActions = await parseSoapXML<ListeActions>(soapData);
  const actions: Actions[] = [];

  listeActions.DocumentElement.Actions.forEach((action) => {
    actions.push({
      Observations: action.Observations?.[0],
      DateCreation: action.DateCreation[0],
      Type: action.Type[0],
      Expediteur: action?.Expediteur,
      ExpediteurIntitule: action.ExpediteurIntitule?.[0],
      Createur: action.Createur[0],
      NomCreateur: action.NomCreateur[0],
      Gestionnaire: action.Gestionnaire[0],
      ReponseWeb_bool: action.ReponseWeb_bool[0],
    });
  });

  const fmtListeActions: FmtListeActions = {
    Actions: actions,
  };

  res.status(200).json(fmtListeActions);
});

export default router;
