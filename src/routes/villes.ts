import express, { Request, Response, Router, json } from "express";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";
import { FmtVilles, ListeVilles } from "../../types/types";

const router: Router = express.Router();

const getSoapResult: (
  code_postal: string
) => Promise<string | { Message: string }> = (
  code_postal: string
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetListeVille(
        { CodePostal: `${code_postal}` },
        (
          _err: string,
          result: {
            GetListeVilleResult: string;
          }
        ) => {
          return resolve(result.GetListeVilleResult);
        }
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const { code_postal } = req.body;

  if (!code_postal)
    return res.status(400).json({ Message: "No code_postal provided" });

  const soapData = await getSoapResult(code_postal);

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }

  const soapResultVilles = await parseSoapXML<ListeVilles>(soapData);
  const fmtVille: FmtVilles[] = [];

  soapResultVilles.DocumentElement.Ville.forEach((ville) => {
    fmtVille.push({
      IdCommune: ville.IdCommune[0],
      Ville: ville.Ville[0],
      CodePostal: ville.CodePostal[0],
    });
  });

  let liste = `<select name='ListeIdCommune' Id='ListeIdCommune'>
    <option value='0'>Choisir votre ville</option>`;
  fmtVille.forEach((ville) => {
    liste += `<option value='${ville.IdCommune}'>`;
    liste += `${ville.Ville} ${ville.CodePostal}</option>`;
  });
  liste += `</select>`;

  res.status(200).send(liste);
});

export default router;
