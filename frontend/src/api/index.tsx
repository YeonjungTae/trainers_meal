import axios from "axios";

// export const apiClient = async () => {

//   function getCookie(name: string | any[]) {
//       let cookieValue = null;
//       if (document.cookie && document.cookie !== '') {
//           const cookies = document.cookie.split(';');
//           for (let i = 0; i < cookies.length; i++) {
//               const cookie = cookies[i].trim();
//               // Does this cookie string begin with the name we want?
//               if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                   cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                   break;
//               }
//           }
//       }
//       return cookieValue;
//   }

//   let csrftoken = getCookie('csrftoken');

//   const api = axios.create({
//     baseURL: import.meta.env.VITE_BASE_URL,
//     headers: {
//       'X-CSRFToken': csrftoken,
//     },
//   });
//   return api
// }

function getCookie(name: string | any[]) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

let csrftoken = getCookie('csrftoken');

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'X-CSRFToken': csrftoken,
  }
  // headers: {
  //   "Content-Type": `application/json;charset=UTF-8`,
  //   "Accept": "application/json",
  
  //   // 추가  
  //   // "Access-Control-Allow-Origin": `http://3.37.154.71:3000`,
  //   // 'Access-Control-Allow-Credentials':"true",
  // },
  // withCredentials: true
});
