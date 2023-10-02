// // Función para configurar una cookie
// export const setCookie = (name, value, options = {}) => {
//     const cookieOptions = {
//       path: "/",
//       ...options,
//     };

import { COOKIE_PATH } from "./cookieConfig";
  
//     if (cookieOptions.expires instanceof Date) {
//       cookieOptions.expires = cookieOptions.expires.toUTCString();
//     }
  
//     let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
//     for (const optionKey in cookieOptions) {
//       if (!cookieOptions[optionKey]) {
//         continue;
//       }
//       cookie += `; ${optionKey}`;
//       if (cookieOptions[optionKey] !== true) {
//         cookie += `=${cookieOptions[optionKey]}`;
//       }
//     }
  
//     document.cookie = cookie;
//   };
  
//   // Función para obtener el valor de una cookie
//   export const getCookie = (name) => {
//     const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
//     for (const cookie of cookies) {
//       if (cookie.startsWith(`${name}=`)) {
//         return decodeURIComponent(cookie.substring(name.length + 1));
//       }
//     }
//     return null;
//   };
  
//   // Función para eliminar una cookie
//   export const deleteCookie = (name) => {
//     setCookie(name, "", { expires: new Date(0) });
//   };
  

// cookieUtils.js


// Función para configurar una cookie
export const setCookie = (name, value, options = {}) => {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000); // Caduca en 1 hora
  const cookieOptions = {
    path: COOKIE_PATH,
    sameSite: "strict",
    secure: true,
    // httpOnly: true,
    expires: oneHourFromNow.toUTCString(), // Establece la fecha de vencimiento como una cadena UTC
    ...options,
  };
  // const jsonData = JSON.stringify(value);
  // const encryptedValue = CryptoJS.AES.encrypt(jsonData, COOKIE_SEC).toString();

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  for (const optionKey in cookieOptions) {
    if (!cookieOptions[optionKey]) {
      continue;
    }
    cookie += `; ${optionKey}`;
    if (cookieOptions[optionKey] !== true) {
      cookie += `=${cookieOptions[optionKey]}`;
    }
  }

  document.cookie = cookie;
};

  
  // Función para obtener el valor de una cookie
  // export const getCookie = (name) => {
  //   const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  //   for (const cookie of cookies) {
  //     // if (cookie.startsWith(`${name}=`)) {
  //     //   return decodeURIComponent(cookie.substring(name.length + 1));
  //     // }
  //     if (cookie.startsWith(`${name}=`)) {
  //       // Obtiene el valor cifrado de la cookie
  //       const encryptedValue = cookie.substring(name.length + 1);
  //       try {
  //         const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, COOKIE_SEC);
  //         const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
  //         return decryptedValue;
  //       } catch (error) {
  //         console.error('Error al descifrar la cookie:', error);
  //         return null; 
  //       }
  //     }
  //     }
  // };
  export const getCookie = (name) => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${name}=`)) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  };
  
  // Función para eliminar una cookie
  export const deleteCookie = (name) => {
    setCookie(name, "", { expires: new Date(0) });
  };

  //token

  export const setToken = (name, value, options = {}) => {
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const cookieOptions = {
      path: COOKIE_PATH,
      sameSite: "strict",
      secure: true,
      // httpOnly: true,
      expires: oneHourFromNow.toUTCString(), // Establece la fecha de vencimiento como una cadena UTC
      ...options,
    };
  
    if (cookieOptions.expires instanceof Date) {
      cookieOptions.expires = cookieOptions.expires.toUTCString();
    }
  
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
    for (const optionKey in cookieOptions) {
      if (!cookieOptions[optionKey]) {
        continue;
      }
      cookie += `; ${optionKey}`;
      if (cookieOptions[optionKey] !== true) {
        cookie += `=${cookieOptions[optionKey]}`;
      }
    }
  
    document.cookie = cookie;
  };
  
  // Función para obtener el valor de una cookie
  export const getToken = (name) => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${name}=`)) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  };
  
  // Función para eliminar una cookie
  export const deleteToken = (name) => {
    setCookie(name, "", { expires: new Date(0) });
  };
  