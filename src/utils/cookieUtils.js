// // Función para configurar una cookie
// export const setCookie = (name, value, options = {}) => {
//     const cookieOptions = {
//       path: "/",
//       ...options,
//     };
  
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
    const cookieOptions = {
      path: "/",
      sameSite: "strict", // Configura la política SameSite según tus necesidades
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
  