import backendUrl from "../utils/backendUrl";

export async function postNewCollection(data) {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("image", data.image[0]);

    const response = await fetch(`${backendUrl}/api/admin/collection/new`, {
      method: "POST",
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
      body: formData,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating new collection: ", error);
  }
}

export async function updateCollection(data) {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("isVisible", data.isVisible);

    formData.append("image", data.image[0]);

    const response = await fetch(
      `${backendUrl}/api/admin/collection/update/${data.id}`,
      {
        method: "PUT",
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
        body: formData,
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating collection: ", error);
  }
}

export async function fetchAllCollections() {
  try {
    const response = await fetch(`${backendUrl}/api/admin/collections`);
    const result = await response.json();
    if (result) {
      return result.data;
    } else {
      throw new Error("Error fetching collections");
    }
  } catch (error) {
    console.error("Error fetching collections: ", error);
    return null;
  }
}

export async function fetchCollection(collectionId) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/collection/${collectionId}`
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching collection: ", error);
  }
}

export async function deleteCollection(collectionId) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/collection/delete/${collectionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
      }
    );
    const result = await response.json();
    console.log(collectionId);
    
    return result;
  } catch (error) {
    console.error("Error deleting collection: ", error);
  }
}
export async function addToCollection(data) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/collection/add-product/${data.collectionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ productId: data.productId }),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding product to collection: ", error);
  }
}

export async function deleteProductFromCollection({ collectionId, productId }) {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/collection/remove-product/${collectionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ productId }),
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting product from collection: ", error);
  }
}
