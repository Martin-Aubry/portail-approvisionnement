import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import TopBar from "./components/TopBar";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Accueil from "./components/Accueil";
import Dashboard from "./components/Dashboard";
import Param from "./components/Param";
import Stats from "./components/Stats";
import Users from "./components/Users";
import GestionAO from "./components/GestionAO";
import MesDemandes from "./components/MesDemandes";
import FormulaireReq from "./components/FormulaireReq";
import Config from "./components/Config";
import Login from "./components/Login";
import AffectationDemandes from "./components/AffectationDemandes";
import CollabSA from "./components/CollabSA";
import AdminContrat from "./components/AdminContrat";
import SEAO from "./components/SEAO";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(""); // valeur par défaut
  const [utilisateur, setUtilisateur] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [sidebarLoading, setSidebarLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <BrowserRouter>
      {!utilisateur ? (
        <Routes>
          <Route path="/" element={<Login onLogin={setUtilisateur} />} />
          <Route path="*" element={<Login onLogin={setUtilisateur} />} />
        </Routes>
      ) : (
        <div className="d-flex flex-column min-vh-100">
          <TopBar
            userRole={userRole}
            setUserRole={setUserRole}
            utilisateur={utilisateur}
            setUtilisateur={setUtilisateur}
            selectedRoleId={selectedRoleId}
            setSelectedRoleId={setSelectedRoleId}
            setSidebarLoading={setSidebarLoading}
          />

          <div className="d-flex flex-grow-1">
            <Sidebar
              isCollapsed={sidebarCollapsed}
              toggleSidebar={toggleSidebar}
              utilisateur={utilisateur}
              selectedRoleId={selectedRoleId}
              sidebarLoading={sidebarLoading}
            />
            <main
              className="flex-grow-1 p-0"
              style={{ backgroundColor: "#f5f5fc", minHeight: "90vh" }}
            >
              <div className="container-fluid mt-4">
                <Routes>
                  <Route path="/" element={<Accueil />} />
                  <Route
                    path="/mesdemandes"
                    element={
                      <MesDemandes
                        userRole={userRole}
                        utilisateur={utilisateur}
                      />
                    }
                  />

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route
                    path="/formulaire/:id"
                    element={<FormulaireReq utilisateur={utilisateur} />}
                  />
                  <Route
                    path="/formulaire"
                    element={<FormulaireReq utilisateur={utilisateur} />}
                  />

                  <Route path="/stats" element={<Stats />} />
                  <Route path="/collabSA" element={<CollabSA />} />
                  <Route path="/adminContrat" element={<AdminContrat />} />
                  <Route path="/seao" element={<SEAO />} />
                  <Route path="/config" element={<Config />} />
                  <Route
                    path="/affectationDemandes"
                    element={<AffectationDemandes />}
                  />
                  <Route path="/param" element={<Param />} />
                  <Route path="/gestionAO" element={<GestionAO />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
