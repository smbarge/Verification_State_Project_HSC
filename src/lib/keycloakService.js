// src/lib/keycloakService.js
import Keycloak from "keycloak-js";
import { api } from "../api/api";
import { keycloak1 } from "../stores/stores";
let redirectUri = import.meta.env.VITE_LOGOUT_URL;
import {
  isLoggedIn,
  token,
  divisionCode,
  loginName,
  roles,
  divisionMaster,
  keycloakInstance,
} from "../stores/stores";
import { goto } from "$app/navigation";

export async function initKeycloak() {
  try {
    // console.log("Initializing Keycloak...");
    const keycloak = new Keycloak({
      url: "https://keycloak.mahahsscboard.in",
      realm: "board-users",
      clientId: "state-hsc-verification-app",
    });

    const authenticated = await keycloak.init({
      onLoad: "login-required",
      checkLoginIframe: false,
    });

    if (authenticated) {
      // console.log("Keycloak instance:", keycloak);
      keycloakInstance.set(keycloak);
      localStorage.setItem("keycloak1", JSON.stringify(keycloak));
      isLoggedIn.set(true);
      console.log("Tokesss", keycloak.token);
      token.set(keycloak.token);

      const decodedToken = JSON.parse(atob(keycloak.token.split(".")[1]));

      // Check roles in the decoded token
      const clientRoles =
        decodedToken.resource_access["state-hsc-verification-app"]?.roles; // For client roles
      console.log("clientRoles: ", clientRoles);
      if (clientRoles) {
        const foundValidRole = clientRoles.find((e) => {
          if (e == "verification-state-admin") return true;
          return false;
        });
        if (!foundValidRole) {
          keycloak.logout({
            redirectUri,
          });
        }
      } else {
        console.log("clientRoles", clientRoles);
        keycloak.logout({
          redirectUri,
        });
      }

      console.log("clientRoles: ", clientRoles);

      const tokenParsed = keycloak.tokenParsed || {};
      loginName.set(tokenParsed.name || "");
      roles.set(
        tokenParsed?.resource_access["state-hsc-verification-app"]?.roles || []
      );

      const { error, divisionMaster: lDivisionMaster } =
        await api.getDivisionMaster({});
      if (!error) {
        divisionMaster.set(lDivisionMaster);
      }

      return true;
    } else {
      console.error("User is not authenticated");
      return false;
    }
  } catch (error) {
    console.error("Failed to initialize Keycloak:", error);
    return false;
  }
}

export async function logout() {
  try {
    let keycloak;

    keycloakInstance.subscribe((value) => {
      keycloak = value;
    });

    if (keycloak) {
      keycloak
        .logout({
          redirectUri,
          // redirectUri: "http://localhost:5173",
        })
        .then(() => {
          isLoggedIn.set(false);
          token.set(null);
          // console.log("Token is",token);
          divisionCode.set("");
          loginName.set("");
          roles.set("");
          divisionMaster.set([]);
          // Perform any additional cleanup if necessary
          // console.log("Logged out successfully");
          goto("https://hsc_verificationstaff.mahahsscboard.in");
          // goto("http://localhost:5173");
        })
        .catch((err) => {
          console.error("Failed to log out:", err);
        });
    } else {
      console.error("Keycloak instance is not available");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
