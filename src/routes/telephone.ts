import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";
import { FmtTelephones, Telephones } from "../../types/types";

const router: Router = express.Router();

const getSoapResult: (
  IdContact: string,
) => Promise<string | { Message: string }> = (
  IdContact: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetTelephones(
        { IdContact: IdContact },
        (_err: string, result: { GetTelephonesResult: string }) => {
          return resolve(result.GetTelephonesResult);
        },
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const { id_contact } = req.body;

  if (!id_contact)
    return res.status(400).json({ Message: "No id_contact provided" });

  const soapData = await getSoapResult(id_contact);
  if (typeof soapData !== "string")
    return res.status(400).json({ Message: soapData });

  const telephones = await parseSoapXML<Telephones>(soapData);

  const fmtTelephones: FmtTelephones[] = [];
  telephones.DocumentElement.Telephones.forEach((tel) => {
    fmtTelephones.push({
      IdContactTelephone: tel.IdContactTelephone[0],
      Numero: tel.Numero[0],
      IdTelephoneType: tel.IdTelephoneType[0],
      type: tel.type[0],
    });
  });

  res.status(200).json(fmtTelephones);
});

const getSoapResultTypes: () // IdContact: string,
=> Promise<string | { Message: string }> = () // IdContact: string,
: Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetTelephoneType(
        {},
        (_err: string, result: { GetTelephoneTypeResult: string }) => {
          return resolve(result.GetTelephoneTypeResult);
        },
      );
    });
  });
};

router.get("/types", express.json(), async (req: Request, res: Response) => {
  const soapData = await getSoapResultTypes();

  if (typeof soapData !== "string")
    return res.status(400).json({ Message: soapData });

  const telTypes = parseSoapXML(soapData);

  res.status(200).json(telTypes);
});

export default router;
