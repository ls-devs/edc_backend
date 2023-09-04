import express, { Request, Response, Router, json } from "express";
import Soap from "../../utils/getSoap";

const router: Router = express.Router();

const getSoapResult: (
  addr1: string,
  addr2: string,
  addr3: string,
  id_commune: string,
  id_contact: string,
) => Promise<string | { Message: string }> = (
  addr1: string,
  addr2: string,
  addr3: string,
  id_commune: string,
  id_contact: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.InsertAdresse(
        {
          AdresseComplement1: addr1,
          AdresseComplement2: addr2,
          AdresseComplement3: addr3,
          IdCommune: id_commune,
          IdContact: id_contact,
        },
        (
          _err: string,
          result: {
            InsertAdresseResult: string;
          },
        ) => {
          return resolve(result.InsertAdresseResult);
        },
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const { addr1, addr2, addr3, id_commune, id_contact } = req.body;
  console.log(req)

  if (!addr1) return res.status(400).json({ Message: "No addr1 provided" });
  if (!addr2) return res.status(400).json({ Message: "No addr2 provided" });
  if (!addr3) return res.status(400).json({ Message: "No addr3 provided" });
  if (!id_commune)
    return res.status(400).json({ Message: "No id_commune provided" });
  if (!id_contact)
    return res.status(400).json({ Message: "No id_contact provided" });

  const soapData = await getSoapResult(
    addr1,
    addr2,
    addr3,
    id_commune,
    id_contact,
  );
  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  return res.status(200);
});

export default router;
