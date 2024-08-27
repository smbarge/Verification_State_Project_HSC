// import { writable } from "svelte/store";
// import { browser } from "$app/environment";

// // Define writable stores
// export const isLoggedIn = writable(false);
// export const token = writable("");
// export const enabledOptions = writable([]);
// export const divisionMaster = writable([]);
// export const loginName = writable("");
// export const roles = writable("");
// export const divisionCode = writable("");
// export const keycloak = writable(null);

// // Conditionally update stores if running in the browser
// if (browser) {
//   // Retrieve token from local storage
//   const storedToken = localStorage.getItem("token");
//   if (storedToken) {
//     token.set(storedToken);
//     isLoggedIn.set(true);
//   }

//   // Retrieve other data from local storage
//   const storedLoginName = localStorage.getItem("loginName");
//   if (storedLoginName) {
//     loginName.set(storedLoginName);
//   }

//   const storedRoles = localStorage.getItem("roles");
//   if (storedRoles) {
//     roles.set(storedRoles);
//   }

//   const storedDivisionCode = localStorage.getItem("divisionCode");
//   if (storedDivisionCode) {
//     divisionCode.set(storedDivisionCode);
//   }

//   // Retrieve and parse divisionMaster from local storage
//   const storedDivisionMaster = localStorage.getItem("divisionMaster");
//   if (storedDivisionMaster) {
//     try {
//       divisionMaster.set(JSON.parse(storedDivisionMaster));
//     } catch (e) {
//       console.error("Error parsing divisionMaster from localStorage", e);
//     }
//   }

//   // Listen for changes and update local storage
//   token.subscribe((value) => {
//     if (value) {
//       localStorage.setItem("token", value);
//     } else {
//       localStorage.removeItem("token");
//     }
//   });

//   loginName.subscribe((value) => {
//     if (value) {
//       localStorage.setItem("loginName", value);
//     } else {
//       localStorage.removeItem("loginName");
//     }
//   });

//   roles.subscribe((value) => {
//     if (value) {
//       localStorage.setItem("roles", value);
//     } else {
//       localStorage.removeItem("roles");
//     }
//   });

//   divisionCode.subscribe((value) => {
//     if (value) {
//       localStorage.setItem("divisionCode", value);
//     } else {
//       localStorage.removeItem("divisionCode");
//     }
//   });

//   divisionMaster.subscribe((value) => {
//     if (value.length) {
//       localStorage.setItem("divisionMaster", JSON.stringify(value));
//     } else {
//       localStorage.removeItem("divisionMaster");
//     }
//   });
// }

import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

// Define writable stores
export const isLoggedIn = writable(false);
export const token = writable("");
export const enabledOptions = writable([]);
export const divisionMaster = writable([]);
export const loginName = writable("");
export const roles = writable("");
export const divisionCode = writable("");
export const keycloak1 = writable({});
export const keycloakInstance = writable(null);
// Conditionally update stores if running in the browser
if (browser) {
  // Retrieve token from local storage
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    token.set(storedToken);
    isLoggedIn.set(true);
  }

  const storedKeycloak = localStorage.getItem("keycloak1");
  if (storedKeycloak) {
    const storedkeycloak1 = JSON.parse(storedKeycloak);
    keycloak1.set(storedkeycloak1);
  }

  // Retrieve other data from local storage
  const storedLoginName = localStorage.getItem("loginName");
  if (storedLoginName) {
    loginName.set(storedLoginName);
  }

  const storedRoles = localStorage.getItem("roles");
  if (storedRoles) {
    roles.set(storedRoles);
  }

  const storedDivisionCode = localStorage.getItem("divisionCode");
  if (storedDivisionCode) {
    divisionCode.set(storedDivisionCode);
  }

  // Retrieve and parse divisionMaster from local storage
  const storedDivisionMaster = localStorage.getItem("divisionMaster");
  if (storedDivisionMaster) {
    try {
      divisionMaster.set(JSON.parse(storedDivisionMaster));
    } catch (e) {
      console.error("Error parsing divisionMaster from localStorage", e);
    }
  }

  // Listen for changes and update local storage
  token.subscribe((value) => {
    if (value) {
      localStorage.setItem("token", value);
    } else {
      localStorage.removeItem("token");
    }
  });

  loginName.subscribe((value) => {
    if (value) {
      localStorage.setItem("loginName", value);
    } else {
      localStorage.removeItem("loginName");
    }
  });

  roles.subscribe((value) => {
    if (value) {
      localStorage.setItem("roles", value);
    } else {
      localStorage.removeItem("roles");
    }
  });

  divisionCode.subscribe((value) => {
    if (value) {
      localStorage.setItem("divisionCode", value);
    } else {
      localStorage.removeItem("divisionCode");
    }
  });

  divisionMaster.subscribe((value) => {
    if (value.length) {
      localStorage.setItem("divisionMaster", JSON.stringify(value));
    } else {
      localStorage.removeItem("divisionMaster");
    }
  });
}

// Define logout function
export const logout = async () => {
  // console.log("Keycloak issss", keycloak1);
  const instance = get(keycloak1);
  if (instance) {
    instance
      .logout({ redirectUri: "https://hsc_verificationstate.mahahsscboard.in" })
      .then(() => {
        // Clear any relevant stores or session data
        isLoggedIn.set(false);
        token.set(null);
        divisionCode.set("");
        loginName.set("");
        roles.set("");
        divisionMaster.set([]);
        // Redirect to login or home page
        goto("https://hsc_verificationstate.mahahsscboard.in");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  } else {
    console.error("No Keycloak instance available");
  }
};
