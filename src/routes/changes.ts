import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";
import { ChangeDOBType } from "../../types/types";
const router: Router = express.Router();

const getSoapChangePremiereLoc: (
  id_investissement: string,
  date_premiere_loc: string,
) => Promise<string | { Message: string }> = (
  id_investissement: string,
  date_premiere_loc: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.UpdatePremiereLoc(
        {
          IdInvestissement: `${id_investissement}`,
          datePremiereLoc: `${date_premiere_loc}`,
        },
        (
          _err: string,
          result: {
            UpdatePremiereLocResult: string;
          },
        ) => {
          return resolve(result.UpdatePremiereLocResult);
        },
      );
    });
  });
};

router.get("/loc", express.json(), async (req: Request, res: Response) => {
  const { id_investissement, date_premiere_loc } = req.body;
  if (!id_investissement)
    return res.status(400).json({ Message: "No id_investissement provided" });
  if (!date_premiere_loc)
    return res.status(400).json({ Message: "No date_premiere_loc provided" });

  const soapData = await getSoapChangePremiereLoc(
    id_investissement,
    date_premiere_loc,
  );

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  res.status(200).json({ statut: "OK", message: "" });
});

const getSoapChangeDOB: (
  IdContact: string,
  DateNaissance: string,
) => Promise<string | { Message: string }> = (
  IdContact: string,
  DateNaissance: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.UpdateDOB(
        {
          IdContact: `${IdContact}`,
          DateNaissance: `${DateNaissance}`,
        },
        (
          _err: string,
          result: {
            UpdateDOBResult: string;
          },
        ) => {
          return resolve(result.UpdateDOBResult);
        },
      );
    });
  });
};

router.get("/dob", express.json(), async (req: Request, res: Response) => {
  const { IdContact, DateNaissance } = req.body;

  if (!IdContact)
    return res.status(400).json({ Message: "No IdContact provided" });
  if (!DateNaissance)
    return res.status(400).json({ Message: "No DateNaissance provided" });

  const soapData = await getSoapChangeDOB(IdContact, DateNaissance);

  if (typeof soapData !== "string")
    return res.status(400).json({ Message: soapData });

  const DOB = await parseSoapXML<ChangeDOBType>(soapData);

  if (DOB.Result === "1")
    return res.status(200).json({ Message: "DOB Changed" });
  else return res.status(400).json({ Message: "Error changing DOB" });
});

export default router;
