import express, { Request, Response, Router, json } from "express";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";
import { FmtListePays, ListePays } from "../../types/types";

const router: Router = express.Router();

const getSoapResult: () => Promise<string | { Message: string }> = (): Promise<
  string | { Message: string }
> => {
  return new Promise((resolve, reject) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetListePays(
        {},
        (
          _err: string,
          result: {
            GetListePaysResult: string;
          }
        ) => {
          return resolve(result.GetListePaysResult);
        }
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const soapData = await getSoapResult();

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  const listePays = await parseSoapXML<ListePays>(soapData);

  const fmtPays: FmtListePays[] = [];

  listePays.DocumentElement.Pays.forEach((pays) => {
    fmtPays.push({
      IdPays: pays.IdPays[0],
      Pays: pays.Pays[0],
    });
  });

  res.status(200).json({ Pays: fmtPays });
});

export default router;
