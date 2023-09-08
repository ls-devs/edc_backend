import express from "express";
import cors from "cors";
import Users from "./routes/users";
import Adherents from "./routes/adherents";
import Fiche from "./routes/fiche";
import Documents from "./routes/documents";
import Cotisations from "./routes/cotisations";
import ListeActions from "./routes/listeAction";
import Telephone from "./routes/telephone";
import Impots from "./routes/impots";
import Investissements from "./routes/investissements";
import Actions from "./routes/actions";
import Email from "./routes/email";
import Pays from "./routes/pays";
import Adresse from "./routes/adresse";
import Suivi from "./routes/suvi";
import Villes from "./routes/villes";
import Changes from "./routes/changes";
import Comments from "./routes/comments";

const app = express();
const port = 3000;
app.use(cors());

app.use("/users", Users);
app.use("/villes", Villes);
app.use("/pays", Pays);
app.use("/suivi", Suivi);
app.use("adresse", Adresse);
app.use("/email", Email);
app.use("/adherents", Adherents);
app.use("/fiche", Fiche);
app.use("/documents", Documents);
app.use("/listeActions", ListeActions);
app.use("/cotisations", Cotisations);
app.use("/telephone", Telephone);
app.use("/impots", Impots);
app.use("/investissements", Investissements);
app.use("/actions", Actions);
app.use("/changes", Changes);
app.use("/comments", Comments);

app.listen(port, () => {
  console.log(`Server listenning at http://localhost:${port} 🚀`);
});
