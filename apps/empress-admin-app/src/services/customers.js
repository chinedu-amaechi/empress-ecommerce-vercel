import backendUrl from "../utils/backendUrl";

export async function fetchAllCustomers() {
  try {
    const response = await fetch(`${backendUrl}/api/admin/customers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${sessionStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function fetchCustomer(customerId) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/customer/${customerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deleteCustomer(customerId) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/customer/delete/${customerId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting customer: ", error);
  }
}
