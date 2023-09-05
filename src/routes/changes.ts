import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
const router: Router = express.Router();

const getSoapChangePremiereLoc: (
  id_investissement: string,
  date_premiere_loc: string
) => Promise<string | { Message: string }> = (
  id_investissement: string,
  date_premiere_loc: string
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
          }
        ) => {
          return resolve(result.UpdatePremiereLocResult);
        }
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
    date_premiere_loc
  );

  if (typeof soapData !== "string") {
    return res.status(400).json(soapData);
  }
  if (soapData === "Erreur de web service")
    return res.status(400).json({ Message: soapData });

  res.status(200).json({ statut: "OK", message: "" });
});

export default router;
