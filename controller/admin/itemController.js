const db = require('../../config/MySQL_DB_Config')
const {checkIsAdmin} = require('./helper')

async function addItem(request, response) {
    try {
        const isAdmin = checkIsAdmin(request.payload)
        if (isAdmin) { }
        else
            return response.status(401).json({code:-1 , message:"Unauthorized access"})
    }
    catch (err) {
        console.log("Error in adding item: " + err.message)
        return response.json({ code: -1, message: "Failed to add item" });
    }
}

async function removeItem(request, response) {
    try {
      const isAdmin = checkIsAdmin(request.payload);
      if (isAdmin) {
      } else
        return response
          .status(401)
          .json({ code: -1, message: "Unauthorized access" });
    } catch (err) {
      console.log("Error in removing item: " + err.message);
      return response.json({ code: -1, message: "Failed to remove item" });
    }
}

async function updateItem(request, response) {
    try {
      const isAdmin = checkIsAdmin(request.payload);
      if (isAdmin) {
      } else
        return response
          .status(401)
          .json({ code: -1, message: "Unauthorized access" });
    } catch (err) {
      console.log("Error in updating item: " + err.message);
      return response.json({ code: -1, message: "Failed to update item" });
    }
}

async function updateQuantity(request, response) {
    try {
      const isAdmin = checkIsAdmin(request.payload);
      if (isAdmin) {
      } else
        return response
          .status(401)
          .json({ code: -1, message: "Unauthorized access" });
    } catch (err) {
      console.log("Error in updating item quantity: " + err.message);
      return response.json({ code: -1, message: "Failed to update item quantity" });
    }
}

async function updatePrice(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
    } else
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
  } catch (err) {
    console.log("Error in updating item's price: " + err.message);
    return response.json({
      code: -1,
      message: "Failed to update item price",
    });
  }
}

async function getItem(request, response) {
    try {
      const isAdmin = checkIsAdmin(request.payload);
      if (isAdmin) {
      } else
        return response
          .status(401)
          .json({ code: -1, message: "Unauthorized access" });
    } catch (err) {
      console.log("Error in get items: " + err.message);
      return response.json({ code: -1, message: "Failed to return matching items" });
    }
}

async function addItemImage(request, response) {
    try {
      const isAdmin = checkIsAdmin(request.payload);
      if (isAdmin) {
      } else
        return response
          .status(401)
          .json({ code: -1, message: "Unauthorized access" });
    } catch (err) {
      console.log("Error in adding item image: " + err.message);
      return response.json({ code: -1, message: "Failed to add image to item" });
    }
}

async function removeItemImage(request, response) {
    try {
      const isAdmin = checkIsAdmin(request.payload);
      if (isAdmin) {
      } else
        return response
          .status(401)
          .json({ code: -1, message: "Unauthorized access" });
    } catch (err) {
      console.log("Error in removing item image: " + err.message);
      return response.json({ code: -1, message: "Failed to remove item image" });
    }
}

async function addTag(request, response) {
    try {
      const isAdmin = checkIsAdmin(request.payload);
      if (isAdmin) {
      } else
        return response
          .status(401)
          .json({ code: -1, message: "Unauthorized access" });
    } catch (err) {
      console.log("Error in adding item tag: " + err.message);
      return response.json({ code: -1, message: "Failed to add tag to item" });
    }
}

async function removeTag(request, response) {
    try {
      const isAdmin = checkIsAdmin(request.payload);
      if (isAdmin) {
      } else
        return response
          .status(401)
          .json({ code: -1, message: "Unauthorized access" });
    } catch (err) {
      console.log("Error in removing item's tag: " + err.message);
      return response.json({ code: -1, message: "Failed to remove item's tag" });
    }
}

module.exports = {
  addItem,
  removeItem,
  updateItem,
  updateQuantity,
  updatePrice,
  getItem,
  addItemImage,
  removeItemImage,
  addTag,
  removeTag
}