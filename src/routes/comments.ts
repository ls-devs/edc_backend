import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
const router: Router = express.Router();

const getSoapComment: (
  if_fiche: string,
  message: string,
  id_contact: string
) => Promise<string | { Message: string }> = (
  id_fiche: string,
  message: string,
  id_contact: string
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.InsertWebAction(
        {
          IdFiche: `${id_fiche}`,
          Message: `${message}`,
          IdContact: `${id_contact}`,
        },
        (
          _err: string,
          result: {
            InsertWebActionResult: string;
          }
        ) => {
          return resolve(result.InsertWebActionResult);
        }
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  console.log(req)
  const { id_fiche, message, id_contact } = req.body;
  if (!id_fiche)
    return res.status(400).json({ Message: "No id_fiche provided" });
  if (!message) return res.status(400).json({ Message: "No message provided" });
  if (!id_contact)
    return res.status(400).json({ Message: "No id_contact provided" });

  const soapData = await getSoapComment(id_fiche, message, id_contact);

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  console.log(soapData);

  res.status(200).json({ statut: "OK", message: "" });
});

export default router;
