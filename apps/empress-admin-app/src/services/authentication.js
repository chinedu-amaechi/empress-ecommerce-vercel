import backendUrl from "../utils/backendUrl";

export async function postLogin(data) {
  try {
    const response = await fetch(`${backendUrl}/api/auth/login/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function checkAuthentication(data) {
  try {
    const response = await fetch(`${backendUrl}/api/auth/check/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${data.token}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}
