import backendUrl from "../utils/backendUrl";

export async function postNewProduct(data) {
  try {
    const response = await fetch(`${backendUrl}/api/admin/product/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: sessionStorage.getItem("token"),
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

export async function fetchAllProducts() {
  try {
    const response = await fetch(`${backendUrl}/api/admin/products`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(`${backendUrl}/api/admin/product/${id}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function updateProduct(data) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/product/update/${data.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/product/delete/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        method: "DELETE",
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function switchVisibility(id) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/product/visibility/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        method: "PUT",
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function addMaterialToProduct(data) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/product/add-material/${data.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function removeMaterialFromProduct(data) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/product/remove-material/${data.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        method: "DELETE",
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function addProductImage(data) {
  try {
    const formData = new FormData();

    data.images.forEach((d) => {
      formData.append("images", d);
    });

    const response = await fetch(
      `${backendUrl}/api/admin/product/add-images/${data.id}`,
      {
        method: "PUT",
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
        body: formData,
      },
    );
    const result = await response.json();
    console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}

export async function removeProductImage(data) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/product/remove-image/${data.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        method: "DELETE",
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}


export async function addProductToCollection(data) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/product/add-to-collection/${data.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return error.data;
  }
}