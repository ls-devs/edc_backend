import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";
import { ActionsProgramme, FmtActionsProgramme } from "../../types/types";

const router: Router = express.Router();

const getSoapResult: (
  id_programme: string,
) => Promise<string | { Message: string }> = (
  id_programme: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve, reject) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetActionsWebProgramme(
        { IdProgramme: `${id_programme}` },
        (
          _err: string,
          result: {
            GetActionsWebProgrammeResult: string;
          },
        ) => {
          return resolve(result.GetActionsWebProgrammeResult);
        },
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const { id_programme } = req.body;

  if (!id_programme)
    res.status(400).json({ Message: "No id_programme provided" });

  const soapData = await getSoapResult(id_programme);

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  const actions = await parseSoapXML<ActionsProgramme>(soapData);
  const fmtActions: FmtActionsProgramme[] = [];

  if (actions.DocumentElement.WebPgm) {
    actions.DocumentElement.WebPgm.forEach((action) => {
      fmtActions.push({
        Observations: action.Observations?.[0],
        DateCreation: action.DateCreation?.[0],
        type_action: action.type_action?.[0],
      });
    });
  }

  res.status(200).json({ WebPgm: fmtActions[0] });
});

export default router;
