import { TOKEN, USER_LOGIN } from "./constant/settingSystem";

export const saveLocalStore = (key, data) => {
  const dataString = JSON.stringify(data);
  localStorage.setItem(key, dataString);
};

export const isLoggedIn = () => {
	return (localStorage.getItem(TOKEN) !== null && localStorage.getItem(USER_LOGIN) !== null);
};