import express, { Request, Response, Router } from "express";
import Soap from "../../utils/getSoap";
import { parseSoapXML } from "../../utils/parseSoap";
import {
  ChangementCoord,
  FicheSuivi,
  NewAssoc,
  NewDomaine,
  NewFiche,
  NewIdAction,
  NewIdActionType,
  NewInsertFiche,
  NewSerice,
  NewStatut,
  NewStatutUp,
  NewValideur,
  SousDomaine,
} from "../../types/types";

const router: Router = express.Router();

const getSoapResultFicheSuivi: (
  id_adhesion: string,
) => Promise<string | { Message: string }> = (
  id_adhesion: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdFicheSuiviAdhesion(
        {
          IdAdhesion: `${id_adhesion}`,
        },
        (
          _err: string,
          result: {
            GetIdFicheSuiviAdhesionResult: string;
          },
        ) => {
          return resolve(result.GetIdFicheSuiviAdhesionResult);
        },
      );
    });
  });
};

const getSoapResultPubExtr: (
  id_fiche: string,
) => Promise<string | { Message: string }> = (
  id_fiche: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.UpdateFichePublicationExtranet(
        {
          IdFiche: `${id_fiche}`,
        },
        (
          _err: string,
          result: {
            UpdateFichePublicationExtranetResult: string;
          },
        ) => {
          return resolve(result.UpdateFichePublicationExtranetResult);
        },
      );
    });
  });
};

const getSoapResultCreateFiche: () => Promise<
  string | { Message: string }
> = (): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.CreateIdFiche(
        {},
        (
          _err: string,
          result: {
            CreateIdFicheResult: string;
          },
        ) => {
          return resolve(result.CreateIdFicheResult);
        },
      );
    });
  });
};

const getSoapResultGetDomaine: () => Promise<
  string | { Message: string }
> = (): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdDomaine(
        { Domaine: "Suivi de l''adhésion" },
        (
          _err: string,
          result: {
            GetIdDomaineResult: string;
          },
        ) => {
          return resolve(result.GetIdDomaineResult);
        },
      );
    });
  });
};

const getSoapResultGetIdServiceEdc: () => Promise<
  string | { Message: string }
> = (): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdServiceEDC(
        { Service: "ADMINISTRATIF" },
        (
          _err: string,
          result: {
            GetIdServiceEDCResult: string;
          },
        ) => {
          return resolve(result.GetIdServiceEDCResult);
        },
      );
    });
  });
};

const getSoapResultAssociation: () => Promise<
  string | { Message: string }
> = (): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdContactAssociationEDC(
        {},
        (
          _err: string,
          result: {
            GetIdContactAssociationEDCResult: string;
          },
        ) => {
          return resolve(result.GetIdContactAssociationEDCResult);
        },
      );
    });
  });
};

const getSoapResultFicheStatus: () => Promise<
  string | { Message: string }
> = (): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdFicheStatut(
        { Statut: "2" },
        (
          _err: string,
          result: {
            GetIdFicheStatutResult: string;
          },
        ) => {
          return resolve(result.GetIdFicheStatutResult);
        },
      );
    });
  });
};

const getSoapResultUpFicheStatut: (
  id_fiche: string,
  fiche_status: string,
) => Promise<string | { Message: string }> = (
  id_fiche: string,
  fiche_status: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.UpdateFicheStatut(
        { IdFiche: `${id_fiche}`, IdFicheStatut: `${fiche_status}` },
        (
          _err: string,
          result: {
            UpdateFicheStatutResult: string;
          },
        ) => {
          return resolve(result.UpdateFicheStatutResult);
        },
      );
    });
  });
};

const getSoapResultValideur: () => Promise<
  string | { Message: string }
> = (): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdContactValideur(
        { Nom: "ASSOC", Prenom: "PATRIMEA" },
        (
          _err: string,
          result: {
            GetIdContactValideurResult: string;
          },
        ) => {
          return resolve(result.GetIdContactValideurResult);
        },
      );
    });
  });
};

const getSoapResultInsertFiche: (
  id_fiche: string,
  id_adhesion: string,
  id_contact: string,
  id_service_edc: string,
  id_valideur: string,
  id_fiche_status: string,
  id_domaine: string,
  id_sous_domaine: string,
) => Promise<string | { Message: string }> = (
  id_fiche: string,
  id_adhesion: string,
  id_contact: string,
  id_service_edc: string,
  id_valideur: string,
  id_fiche_status: string,
  id_domaine: string,
  id_sous_domaine: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.InsertFiche(
        {
          IdFiche: `${id_fiche}`,
          IdAdhesion: `${id_adhesion}`,
          IdContact: `${id_contact}`,
          IdServiceEDC: `${id_service_edc}`,
          IdContactCreateur: `${id_valideur}`,
          IdFicheStatut: `${id_fiche_status}`,
          IdDomaine: `${id_domaine}`,
          IdSousDomaine: `${id_sous_domaine}`,
        },
        (
          _err: string,
          result: {
            InsertFicheResult: string;
          },
        ) => {
          return resolve(result.InsertFicheResult);
        },
      );
    });
  });
};

const getSoapResultUpFicheValidation: (
  id_fiche: string,
  id_valideur: string,
) => Promise<string | { Message: string }> = (
  id_fiche: string,
  id_valideur: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.UpdateFicheValidation(
        { IdFiche: `${id_fiche}`, IdContactValideur: id_valideur },
        (
          _err: string,
          result: {
            UpdateFicheValidationResult: string;
          },
        ) => {
          return resolve(result.UpdateFicheValidationResult);
        },
      );
    });
  });
};

const getSoapResultCreateIdAction: () => Promise<
  string | { Message: string }
> = (): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.CreateIdAction(
        {},
        (
          _err: string,
          result: {
            CreateIdActionResult: string;
          },
        ) => {
          return resolve(result.CreateIdActionResult);
        },
      );
    });
  });
};

const getSoapResultGetIdActionType: () => Promise<
  string | { Message: string }
> = (): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdActionType(
        { ActionType: "Web" },
        (
          _err: string,
          result: {
            GetIdActionTypeResult: string;
          },
        ) => {
          return resolve(result.GetIdActionTypeResult);
        },
      );
    });
  });
};

const getSoapResultInsertAction: (
  id_action: string,
  id_fiche: string,
  id_contact_createur: string,
  id_contact_emetteur: string,
  id_contact_destinataire: string,
  id_action_type: string,
  observation: string,
) => Promise<string | { Message: string }> = (
  id_action: string,
  id_fiche: string,
  id_contact_createur: string,
  id_contact_emetteur: string,
  id_contact_destinataire: string,
  id_action_type: string,
  observation: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.InsertAction(
        {
          IdAction: `${id_action}`,
          IdFiche: `${id_fiche}`,
          IdContactCreateur: `${id_contact_createur}`,
          IdContactEmetteur: `${id_contact_emetteur}`,
          IdContactDestinataire: `${id_contact_destinataire}`,
          IdActionType: `${id_action_type}`,
          Observation: `${observation}`,
        },
        (
          _err: string,
          result: {
            InsertActionResult: string;
          },
        ) => {
          return resolve(result.InsertActionResult);
        },
      );
    });
  });
};

const getSoapResultInsertWebAction: (
  id_fiche: string,
  ActionWebModifAdressse: string,
  id_contact: string,
) => Promise<string | { Message: string }> = (
  id_fiche: string,
  ActionWebModifAdressse: string,
  id_contact: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.InsertWebAction(
        {
          IdFiche: `${id_fiche}`,
          Message: `${ActionWebModifAdressse}`,
          IdContact: `${id_contact}`,
        },
        (
          _err: string,
          result: {
            InsertWebActionResult: string;
          },
        ) => {
          return resolve(result.InsertWebActionResult);
        },
      );
    });
  });
};

const getSoapResultGetChgCoord: (
  id_adhesion: string,
) => Promise<string | { Message: string }> = (
  id_adhesion: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdFicheChangementCoordonnees(
        {
          IdAdhesion: `${id_adhesion}`,
        },
        (
          _err: string,
          result: {
            GetIdFicheChangementCoordonneesResult: string;
          },
        ) => {
          return resolve(result.GetIdFicheChangementCoordonneesResult);
        },
      );
    });
  });
};

const getSoapResultSousDom: (
  id_domaine: string,
) => Promise<string | { Message: string }> = (
  id_domaine: string,
): Promise<string | { Message: string }> => {
  return new Promise((resolve) => {
    Soap.createClient(`${process.env.SOAP_URL}`, {}, (_err, client) => {
      if (_err) return resolve({ Message: "Error creating SOAP Client" });
      client.GetIdSousDomaine(
        {
          IdDomaine: `${id_domaine}`,
        },
        (
          _err: string,
          result: {
            GetIdSousDomaineResult: string;
          },
        ) => {
          return resolve(result.GetIdSousDomaineResult);
        },
      );
    });
  });
};

router.get("", express.json(), async (req: Request, res: Response) => {
  const {
    InfoCreationFicheEureka,
    AncienneAdresse,
    NouvelleAdresse,
    // IdCommune,
    ValuePays,
    CheckVilleManuelle,
    ChoixDiffusionAdresse,
    IdAdhesion,
    IdContact,
    Prenom,
    Nom,
  }: {
    AncienneAdresse: string;
    NouvelleAdresse: string;
    IdAdhesion: string;
    IdContact: string;
    Prenom: string;
    Nom: string;
    ValuePays: string;
    ChoixDiffusionAdresse: string;
    CheckVilleManuelle: string | number;
    InfoCreationFicheEureka: number;
  } = req.body;

  let nid_fiche_glob = "";
  let gIdAction = "";
  let gAssos = "";
  let gActionType = "";

  const soapDataFicheSuivi = await getSoapResultFicheSuivi(IdAdhesion);
  if (typeof soapDataFicheSuivi !== "string") {
    return res.status(400).json(soapDataFicheSuivi);
  }

  const id_fiche = await parseSoapXML<FicheSuivi>(soapDataFicheSuivi);
  console.log(
    "id fiche : ",
    id_fiche.DocumentElement.IdFicheSuiviAdhesion?.[0].IdFiche?.[0],
  );

  if (id_fiche.DocumentElement.IdFicheSuiviAdhesion?.[0].IdFiche?.[0] !== "") {
    const soapDataResultPubextr = await getSoapResultPubExtr(
      id_fiche.DocumentElement.IdFicheSuiviAdhesion?.[0].IdFiche?.[0],
    );

    if (typeof soapDataResultPubextr !== "string") {
      return res.status(400).json(soapDataFicheSuivi);
    }
  } else {
    const soapDataCreateFiche = await getSoapResultCreateFiche();
    if (typeof soapDataCreateFiche !== "string") {
      return res.status(400).json(soapDataCreateFiche);
    }
    const newFicheId = await parseSoapXML<NewFiche>(soapDataCreateFiche);
    const nid_fiche =
      newFicheId.DocumentElement.CreateIdFiche?.[0].IdFiche?.[0];
    nid_fiche_glob = nid_fiche;

    const soapDataDomaine = await getSoapResultGetDomaine();
    if (typeof soapDataDomaine !== "string") {
      return res.status(400).json(soapDataDomaine);
    }

    const newDomaine = await parseSoapXML<NewDomaine>(soapDataDomaine);
    const domaine = newDomaine.DocumentElement.Domaine?.[0].IdDomaine?.[0];

    const soapDataIDService = await getSoapResultGetIdServiceEdc();
    if (typeof soapDataIDService !== "string") {
      return res.status(400).json(soapDataIDService);
    }

    const newService = await parseSoapXML<NewSerice>(soapDataIDService);
    const serviceEDC =
      newService.DocumentElement.ServiceEDC?.[0].IdServiceEDC?.[0];

    const soapDataResultAssoc = await getSoapResultAssociation();
    if (typeof soapDataResultAssoc !== "string") {
      return res.status(400).json(soapDataResultAssoc);
    }
    const newAssoc = await parseSoapXML<NewAssoc>(soapDataResultAssoc);
    const assoc =
      newAssoc.DocumentElement.ContactAssociationEDC?.[0].IdContact?.[0];

    const soapDataFicheStatut = await getSoapResultFicheStatus();
    if (typeof soapDataFicheStatut !== "string") {
      return res.status(400).json(soapDataFicheStatut);
    }

    const newStatut = await parseSoapXML<NewStatut>(soapDataFicheStatut);
    const status =
      newStatut.DocumentElement.FicheStatut?.[0].IdFicheStatut?.[0];

    const soapDataValideur = await getSoapResultValideur();
    if (typeof soapDataValideur !== "string") {
      return res.status(400).json(soapDataValideur);
    }

    const newValideur = await parseSoapXML<NewValideur>(soapDataValideur);
    const valideur =
      newValideur.DocumentElement.ContactValideur?.[0].IdContact?.[0];

    const soapDataInsertFiche = await getSoapResultInsertFiche(
      nid_fiche,
      IdAdhesion,
      IdContact,
      serviceEDC,
      assoc,
      status,
      domaine,
      "NULL",
    );

    if (typeof soapDataInsertFiche !== "string") {
      return res.status(400).json(soapDataValideur);
    }

    const newInsertFiche = await parseSoapXML<NewInsertFiche>(
      soapDataInsertFiche,
    );

    const soapDataUpFiche = await getSoapResultUpFicheStatut(nid_fiche, status);
    if (typeof soapDataUpFiche !== "string") {
      return res.status(400).json(soapDataUpFiche);
    }

    const new_status = await parseSoapXML<NewStatutUp>(soapDataUpFiche);

    const updFicheValidation = await getSoapResultUpFicheValidation(
      nid_fiche,
      valideur,
    );

    if (typeof updFicheValidation !== "string") {
      return res.status(400).json(updFicheValidation);
    }

    const newUpFicheVal = await parseSoapXML(updFicheValidation);
  }
  let AncienneAdresseActionWeb = AncienneAdresse.replace("<br/>", "\n");
  let NouvelleAdresseActionWeb = NouvelleAdresse.replace("<br/>", "\n");
  let ActionWebModifAdressse = `Mise à jour de l''adresse postale par ${Prenom} ${Nom} \n Ancienne adresse : \n ${AncienneAdresseActionWeb} \n Nouvelle adresse : \n ${NouvelleAdresseActionWeb}`;

  if (IdAdhesion === "c57e42cf-bb7d-484c-8d6f-fdb8de62f1f8") {
    const soapDataGetIdAction = await getSoapResultCreateIdAction();

    if (typeof soapDataGetIdAction !== "string") {
      return res.status(400).json(soapDataGetIdAction);
    }

    const IdAction = await parseSoapXML<NewIdAction>(soapDataGetIdAction);
    const newIdAction =
      IdAction.DocumentElement.CreateIdAction?.[0].IdAction?.[0];
    console.log("new id action: ", newIdAction);

    const soapDataGetIdActionType = await getSoapResultGetIdActionType();
    if (typeof soapDataGetIdActionType !== "string") {
      return res.status(400).json(soapDataGetIdActionType);
    }

    const IdActionType = await parseSoapXML<NewIdActionType>(
      soapDataGetIdActionType,
    );

    const newIdActionType =
      IdActionType.DocumentElement.IdActionType?.[0].IdActionType?.[0];
    console.log("IdActionType: ", newIdActionType);

    const IdContactAssocEDC = await getSoapResultAssociation();
    if (typeof IdContactAssocEDC !== "string") {
      return res.status(400).json(IdContactAssocEDC);
    }
    const newAssoc = await parseSoapXML<NewAssoc>(IdContactAssocEDC);
    const new_assoc =
      newAssoc.DocumentElement.ContactAssociationEDC?.[0].IdContact?.[0];
    console.log("new assoc: ", new_assoc);

    let Observation = "";
    let UpdateAdresseKO = 0;

    if (ValuePays && ValuePays === "etranger") {
      Observation +=
        "L''adresse que l''adhérent a renseigné ne se trouve pas en France Métropolitaine ou DOM-TOM.\n";
      UpdateAdresseKO++;
    }

    if (
      (CheckVilleManuelle && CheckVilleManuelle !== 0) ||
      CheckVilleManuelle !== ""
    ) {
      Observation +=
        "L''adhérent a inséré une ville manuellement. Cela signifie que cette ville n''existe pas sous Eureka. Il sera nécessaire de valider cette commune avant de l''intégrer dans la base de données via le site :http://www.laposte.fr/sna/rubrique.php3?id_rubrique=59.\n";
      UpdateAdresseKO++;
    }

    if (UpdateAdresseKO > 0) {
      Observation +=
        "La nouvelle adresse de l''adhérent n''a pas été renseignée dans Eureka.\n";
      UpdateAdresseKO++;
    }

    if (ChoixDiffusionAdresse !== "edc") {
      Observation +=
        "L''adhérent souhaite que l''association communique sa nouvelle adresse aux différents intervenants de son (ses) investissement(s).\n";
    } else {
      Observation +=
        "Le changement d''adresse ne concerne que l''association.\n";
    }

    AncienneAdresseActionWeb = AncienneAdresse.replace("<br/>", "\n");
    NouvelleAdresseActionWeb = NouvelleAdresse.replace("<br/>", "\n");
    Observation += `Ancienne adresse : \n ${AncienneAdresseActionWeb} \n NouvelleAdresse : \n ${NouvelleAdresseActionWeb}`;

    const test = await getSoapResultInsertAction(
      newIdAction,
      nid_fiche_glob,
      IdContact,
      IdContact,
      new_assoc,
      newIdActionType,
      Observation,
    );
  } else {
    await getSoapResultInsertWebAction(
      nid_fiche_glob,
      ActionWebModifAdressse,
      IdContact,
    );
  }

  if (InfoCreationFicheEureka > 0) {
    const soapDataResultAssoc = await getSoapResultAssociation();
    if (typeof soapDataResultAssoc !== "string") {
      return res.status(400).json(soapDataResultAssoc);
    }
    const assoc_str = await parseSoapXML<NewAssoc>(soapDataResultAssoc);
    const assoc =
      assoc_str.DocumentElement.ContactAssociationEDC?.[0].IdContact?.[0];

    const soapDataChgCoord = await getSoapResultGetChgCoord(IdAdhesion);
    console.log(IdAdhesion);
    console.log("soapcgcoord: ", soapDataChgCoord);
    if (typeof soapDataChgCoord !== "string") {
      return res.status(400).json(soapDataChgCoord);
    }
    gAssos = assoc;
    console.log("assoc", assoc);
    const chgCoord_str = await parseSoapXML<ChangementCoord>(soapDataChgCoord);
    const cid_fiche =
      chgCoord_str.DocumentElement.IdFicheChangementCoordonnes?.[0]
        .IdFiche?.[0];

    console.log("cid_fiche", chgCoord_str.DocumentElement);

    if (cid_fiche !== "" || cid_fiche === undefined) {
      await getSoapResultPubExtr(cid_fiche);
      console.log("pub");
    } else {
      const soapDataNfiche = await getSoapResultCreateFiche();
      if (typeof soapDataNfiche !== "string") {
        return res.status(400).json(soapDataNfiche);
      }

      const Nfiche_str = await parseSoapXML<NewFiche>(soapDataNfiche);
      const nfiche = Nfiche_str.DocumentElement.CreateIdFiche?.[0].IdFiche?.[0];

      const soapDataDomaine = await getSoapResultGetDomaine();
      if (typeof soapDataDomaine !== "string") {
        return res.status(400).json(soapDataDomaine);
      }
      const domaine_str = await parseSoapXML<NewDomaine>(soapDataDomaine);
      const ndomaine = domaine_str.DocumentElement.Domaine?.[0].IdDomaine?.[0];

      const soapDataSousDomaine = await getSoapResultSousDom(ndomaine);
      if (typeof soapDataSousDomaine !== "string") {
        return res.status(400).json(soapDataSousDomaine);
      }
      const sousdom_str = await parseSoapXML<SousDomaine>(soapDataSousDomaine);
      const sousdom =
        sousdom_str.DocumentElement.SousDomaine?.[0].IdSousDomaine?.[0];

      const soapDataIDService = await getSoapResultGetIdServiceEdc();
      if (typeof soapDataIDService !== "string") {
        return res.status(400).json(soapDataIDService);
      }

      const idService_str = await parseSoapXML<NewSerice>(soapDataIDService);
      const idService =
        idService_str.DocumentElement.ServiceEDC?.[0].IdServiceEDC?.[0];

      const soapDataFicheStatut = await getSoapResultFicheStatus();
      if (typeof soapDataFicheStatut !== "string") {
        return res.status(400).json(soapDataFicheStatut);
      }
      const ficheStatut_str = await parseSoapXML<NewStatut>(
        soapDataFicheStatut,
      );
      const ficheStatut =
        ficheStatut_str.DocumentElement.FicheStatut?.[0].IdFicheStatut?.[0];

      const soapDataValideur = await getSoapResultValideur();
      if (typeof soapDataValideur !== "string") {
        return res.status(400).json(soapDataValideur);
      }

      const valideur_str = await parseSoapXML<NewValideur>(soapDataValideur);
      const valideur =
        valideur_str.DocumentElement.ContactValideur?.[0].IdContact?.[0];

      await getSoapResultInsertFiche(
        nfiche,
        IdAdhesion,
        IdContact,
        idService,
        valideur,
        ficheStatut,
        ndomaine,
        sousdom,
      );

      await getSoapResultUpFicheStatut(nfiche, ficheStatut);

      await getSoapResultUpFicheValidation(nfiche, valideur);
    }

    const soapDataIdAction = await getSoapResultCreateIdAction();
    if (typeof soapDataIdAction !== "string") {
      return res.status(400).json(soapDataIdAction);
    }
    const idAction_str = await parseSoapXML<NewIdAction>(soapDataIdAction);
    const idAction =
      idAction_str.DocumentElement.CreateIdAction?.[0].IdAction?.[0];
    gIdAction = idAction;

    const soapDataGetIdActionType = await getSoapResultGetIdActionType();
    if (typeof soapDataGetIdActionType !== "string") {
      return res.status(400).json(soapDataGetIdActionType);
    }

    const IdActionType_str = await parseSoapXML<NewIdActionType>(
      soapDataGetIdActionType,
    );

    const idActionType =
      IdActionType_str.DocumentElement.IdActionType?.[0].IdActionType?.[0];

    gActionType = idActionType;
  }

  let Observation = "";
  let UpdateAdresseKO = 0;

  if (ValuePays && ValuePays == "etranger") {
    Observation +=
      "L''adresse que l''adhérent a renseigné ne se trouve pas en France Métropolitaine ou DOM-TOM.\n";
    UpdateAdresseKO++;
  }

  if (
    (CheckVilleManuelle && CheckVilleManuelle !== 0) ||
    CheckVilleManuelle !== ""
  ) {
    Observation +=
      "L''adhérent a inséré une ville manuellement. Cela signifie que cette ville n''existe pas sous Eureka. Il sera nécessaire de valider cette commune avant de l''intégrer dans la base de données via le site :http://www.laposte.fr/sna/rubrique.php3?id_rubrique=59.\n";
    UpdateAdresseKO++;
  }

  if (UpdateAdresseKO > 0) {
    Observation +=
      "La nouvelle adresse de l''adhérent n''a pas été renseignée dans Eureka.\n";
    let actionEdc =
      "<p style=\"color:#FF0000;\">L'adresse n'a pas été automatiquement mise à jour sur Eureka.</p>";
    let actionAdh = `<p style="color:#FF0000;">L'adresse n'a pas été automatiquement mise à jour sur Eureka.</p>`;
    let messageFin =
      '<p style="font-size:12pt; color:#FF0000;">Nous n\'avons pas pu mettre à jour votre adresse dans notre base de données car une intervention manuelle est nécessaire.</p>';
    messageFin +=
      '<p style="font-size:12pt; color:#FF0000;">Néanmoins, soyez assurés que votre demande a bien été prise en compte et qu\'un dossier a été ouvert et transféré dans le service concerné afin de mettre à jour votre adresse dans les meilleurs délais.';
    let timeout = 5;
  } else {
    Observation +=
      "La nouvelle adresse de l''adhérent a déjà été renseignée dans Eureka.\n";
    let actionEDC = `<p style="color:#009900;">L\'adresse a été automatiquement mise à jour sur Eureka.</p>`;
    let actionADH =
      '<p style="color:#009900;">Votre adresse a été automatiquement mise à jour dans notre base de données.</p>';
    let timeout = 5;
  }

  if (ChoixDiffusionAdresse !== "edc") {
    let actionEDC =
      "<p style=\"color:#FF0000;\">L'adhérent souhaite qu'EDC communique sa nouvelle adresse à ses différents interlocuteurs.</p>";
    let actionADH =
      "<p>Nous engageons une proc&eacute;dure d&acute;information aupr&egrave;s des intervenants de votre (ou vos) investissement(s). Celle ci concerne :</p>";
    actionADH +=
      "<p>Nous engageons une proc&eacute;dure d&acute;information aupr&egrave;s des intervenants de votre (ou vos) investissement(s). Celle ci concerne :</p>";

    Observation += "Le changement d''adresse ne concerne que l''association.\n";
  } else {
    Observation += "Le changement d''adresse ne concerne que l''association.\n";
    let actionEDC =
      "<p style=\"color:#009900;\">Il n'est pas nécesaire de diffuser la nouvelle adresse de l'adhérent.</p>";
  }

  ActionWebModifAdressse = AncienneAdresse.replace("<br/>", "\n");
  NouvelleAdresseActionWeb = NouvelleAdresse.replace("<br/>", "\n");
  Observation += `Ancienne adresse :\n ${AncienneAdresseActionWeb} \n NouvelleAdresse :\n ${NouvelleAdresseActionWeb}`;

  if (InfoCreationFicheEureka > 0) {
    await getSoapResultInsertAction(
      gIdAction,
      nid_fiche_glob,
      IdContact,
      IdContact,
      gAssos,
      gActionType,
      Observation,
    );
  }
  res.status(200);
});

export default router;
