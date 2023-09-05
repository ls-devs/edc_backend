export type Adherent = {
  DocumentElement: {
    Adherent: [
      {
        IdContact: [string];
        IdAdhesion: [string];
        NumAdhesion: [string];
        DateAdhesion: [string];
        Civilite: [string];
        Nom: [string];
        Prenom: [string];
        Adresse1: [string];
        Adresse2: [string];
        Adresse3: [string];
        Npai_bool: [string];
        CodePostal: [string];
        Ville: [string];
        PAYS: [string];
        Email: [string];
        DateNaissance: [string];
        TypePaiement: [string];
      }
    ];
  };
};

export type Fiche = {
  DocumentElement: {
    fiche: [
      {
        FicheId: [string];
        FicheRef: [string];
        DatePriseEnCompte: [string];
        Domaine: [string];
        Gestionnaire: [string];
        NomGestionnaire: [string];
        ServiceGestion: [string];
        emailService: [string];
        Statut: [string];
        DateDerniereAction: [string];
        lib_statut: [string];
        lib_histo: [string];
        Programme?: [string];
        SousDomaine?: [string];
        DateCloture?: [string];
        Lot?: [string];
      }
    ];
  };
};

export type FmtFiche = {
  FicheId: string;
  FicheRef: string;
  DatePriseEnCompte: string;
  Domaine: string;
  Gestionnaire: string;
  Statut: string;
  DateDerniereAction: string;
  lib_statut: string;
  lib_histo: string;
  Lot?: string;
  Programme?: string;
  SousDomaine?: string;
  DateCloture?: string;
};

export type Paiement = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  Numero: string;
  Montant: string;
  DateAppelCotisation: string;
  IdCotisationAnnee: string;
  MessageAccueil: string;
  MessagePaiement: string;
};

export type AllFiches = {
  DocumentElement: {
    Fiches: [
      {
        FicheId: [string];
        FicheRef: [string];
        DatePriseEnCompte: [string];
        Domaine: [string];
        Gestionnaire: [string];
        Statut: [string];
        DateDerniereAction: [string];
        lib_statut: [string];
        lib_histo: [string];
        Lot?: [string];
        Programme?: [string];
        SousDomaine?: [string];
        DateCloture?: [string];
      }
    ];
  };
};

export type ListeActions = {
  DocumentElement: {
    Actions: [
      {
        Observations: [string];
        DateCreation: [string];
        Type: [string];
        Expediteur: [
          {
            exp: string;
          }
        ];
        ExpediteurIntitule: [string];
        Createur: [string];
        NomCreateur: [string];
        Gestionnaire: [string];
        ReponseWeb_bool: [string];
      }
    ];
  };
};

export type Actions = {
  Observations?: string;
  DateCreation: string;
  Type: string;
  Expediteur?: Expediteur[];
  ExpediteurIntitule?: string;
  Createur: string;
  NomCreateur: string;
  Gestionnaire: string;
  ReponseWeb_bool: string;
};

export type Expediteur = {
  exp: string;
};

export type FmtListeActions = {
  Actions: Actions[];
};

export type Telephones = {
  DocumentElement: {
    Telephones: [
      {
        IdContactTelephone: [string];
        Numero: [string];
        IdTelephoneType: [string];
        type: [string];
      }
    ];
  };
};

export type FmtTelephones = {
  IdContactTelephone: string;
  Numero: string;
  IdTelephoneType: string;
  type: string;
};

export type Investissements = {
  DocumentElement: {
    Invest: [
      {
        IdProgramme: [string];
        DateProcuration?: [string];
        Banque?: [string];
        Nom: [string];
        Adresse: [string];
        NombreLotResidence: [string];
        Ville: [string];
        CodePostal: [string];
        Pays: [string];
        DateLivraisonReelle: [string];
        DateLivraisonPrevisionnelle: [string];
        DateLivraisonPrevisionnelleInitiale: [string];
        Promoteur: [string];
        ADBPROG: [string];
        ConseillerVendeur: [string];
        Syndic: [string];
        IdInvestissement: [string];
        DateActe: [string];
        DateLivraison: [string];
        DateSignature: [string];
        LoiFiscale: [string];
        RefNum: [string];
        NbPb: [string];
      }
    ];
  };
};

export type FmtInvestissements = {
  Banque?: string;
  DateProcuration?: string;
  IdProgramme: string;
  Nom: string;
  Adresse: string;
  NombreLotResidence?: string;
  Ville: string;
  CodePostal: string;
  Pays: string;
  DateLivraisonReelle?: string;
  DateLivraisonPrevisionnelle?: string;
  DateLivraisonPrevisionnelleInitiale?: string;
  Promoteur?: string;
  ADBPROG?: string;
  ConseillerVendeur?: string;
  Syndic?: string;
  IdInvestissement: string;
  DateLivraison: string;
  DateSignature: string;
  LoiFiscale: string;
  RefNum: string;
  NbPb: string;
  lien_photo: string;
};

export type ActionsProgramme = {
  DocumentElement: {
    WebPgm: [
      {
        Observations: [string];
        DateCreation: [string];
        type_action: [string];
      }
    ];
  };
};

export type FmtActionsProgramme = {
  Observations: string;
  DateCreation: string;
  type_action: string;
};

export type DetailsInvestissement = {
  DocumentElement: {
    Invest: [
      {
        DateActe?: [string];
        LotNature?: [string];
        LotType?: [string];
        DateProcuration?: [string];
        RefNum: [string];
        DateSignature: [string];
        DateLivraisonPrevisionnelle: [string];
        DateLivraisonReelle: [string];
        DateLocationInitiale: [string];
        InvestissementProduit: [string];
        Programme: [string];
        SurfaceHabitable: [string];
        SurfaceAnnexe: [string];
        MontantTTCLogement: [string];
        MontantTTCParking: [string];
        LoyerMensuelLogement: [string];
        LoyerMensuelParking: [string];
        H2Envoye_bool: [string];
      }
    ];
  };
};

export type FmtDetailsInvestissement = {
  RefNum: string;
  LotType?: string;
  LotNature?: string;
  DateActe?: string;
  DateProcuration?: string;
  DateSignature: string;
  DateLivraisonPrevisionnelle: string;
  DateLivraisonReelle: string;
  DateLocationInitiale: string;
  InvestissementProduit: string;
  Programme: string;
  SurfaceHabitable: string;
  SurfaceAnnexe: string;
  MontantTTCLogement: string;
  MontantTTCParking: string;
  LoyerMensuelLogement: string;
  LoyerMensuelParking: string;
  H2Envoye_bool: string;
};

export type ADFInvestissement = {
  DocumentElement: {
    adf: [{}];
  };
};

export type IInterInvestissement = {
  DocumentElement: {
    iinter: [
      {
        DateEnvoiPromoteur: [string];
        DateEnvoiPromoteurBanque: [string];
        Montant: [string];
      }
    ];
  };
};

export type FmtIInterInverstissement = {
  DateEnvoiPromoteur: string;
  DateEnvoiPromoteurBanque: string;
  Montant: string;
};

export type ListePays = {
  DocumentElement: {
    Pays: [
      {
        IdPays: [string];
        Pays: [string];
      }
    ];
  };
};

export type FmtListePays = {
  IdPays: string;
  Pays: string;
};

export type FicheSuivi = {
  DocumentElement: {
    IdFicheSuiviAdhesion: [
      {
        IdFiche: [string];
      }
    ];
  };
};

export type NewFiche = {
  DocumentElement: {
    CreateIdFiche: [
      {
        IdFiche: [string];
      }
    ];
  };
};

export type NewDomaine = {
  DocumentElement: {
    Domaine: [
      {
        IdDomaine: [string];
      }
    ];
  };
};

export type NewSerice = {
  DocumentElement: {
    ServiceEDC: [
      {
        IdServiceEDC: [string];
      }
    ];
  };
};

export type NewAssoc = {
  DocumentElement: {
    ContactAssociationEDC: [
      {
        IdContact: [string];
      }
    ];
  };
};

export type NewStatut = {
  DocumentElement: {
    FicheStatut: [
      {
        IdFicheStatut: [string];
      }
    ];
  };
};

export type NewValideur = {
  DocumentElement: {
    ContactValideur: [
      {
        IdContact: [string];
      }
    ];
  };
};

export type NewInsertFiche = {
  DocumentElement: {};
};

export type NewStatutUp = {
  DocumentElement: {};
};

export type NewIdAction = {
  DocumentElement: {
    CreateIdAction: [
      {
        IdAction: [string];
      }
    ];
  };
};

export type NewIdActionType = {
  DocumentElement: {
    IdActionType: [
      {
        IdActionType: [string];
      }
    ];
  };
};

export type ChangementCoord = {
  DocumentElement: {
    IdFicheChangementCoordonnes: [
      {
        IdFiche: [string];
      }
    ];
  };
};

export type SousDomaine = {
  DocumentElement: {
    SousDomaine: [
      {
        IdSousDomaine: [string];
      }
    ];
  };
};

export type ListeVilles = {
  DocumentElement: {
    Ville: [
      {
        IdCommune: [string];
        Ville: [string];
        CodePostal: [string];
      }
    ];
  };
};

export type FmtVilles = {
  IdCommune?: string;
  Ville?: string;
  CodePostal?: string;
};
