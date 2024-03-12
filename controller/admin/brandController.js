const db = require("../../config/MySQL_DB_Config");
const { checkIsAdmin } = require("./helper");

async function addBrand(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const name = req.body.name;
      const images = req.body.images || "[]";
      if (!name || !images) {
        return response.json({ code: 0, message: "Invalid data" });
      }
      const query = "insert into brand (name , image) values (? , ?)";
      const conn = await db.getConnection();
      await conn
        .query(query, [
          name,
          images,
        ])
        .then((result) => {
          conn.release();
          result = result[0];
          if (result.affectedRows > 0) {
            return response
              .status(200)
              .json({ code: 1, message: "Brand added successfully" });
          } else {
            return response.json({ code: 0, message: "Failed to add brand" });
          }
        })
        .catch((err) => {
          conn.release();
          console.log("Caught error at adding new brand due to " + err);
          return response.json({ code: 0, message: "Failed to add brand" });
        });
    } else {
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
    }
  } catch (err) {
    console.log("Error in adding brand: " + err.message);
    return response.json({ code: -1, message: "Failed to brand" });
  }
}

async function removeBrand(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const brand_id = req.body.brand_id;
      if (!brand_id) {
        return response.json({ code: 0, message: "Invalid data" });
      }
      const query = "delete from brand where brand_id = ?";
      const conn = await db.getConnection();
      const result = await conn.query(query, [
        brand_id,
      ]);
      conn.release();
      if (result[0].affectedRows > 0) {
        return response
          .status(200)
          .json({ code: 1, message: "Brand removed successfully" });
      } else {
        return response.json({ code: 0, message: "Failed to remove brand" });
      }
    } else
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
  } catch (err) {
    console.log("Error in removing brand: " + err.message);
    return response.json({ code: -1, message: "Failed to remove brand" });
  }
}

async function getAllBrands(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const query = "SELECT *from brand";
      const conn = await db.getConnection();
      await conn
        .query(query)
        .then((result) => {
          conn.release();
          result = result[0];
          return response.json({
            code: 1,
            message: `${result.length} ${result.length == 1 ? "item" : "items"
              } found`,
            data: result,
          });
        })
        .catch((err) => {
          conn.release();
          response.json({ code: 0, message: "Failed to fetch brands list" });
        });
    } else {
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
    }
  } catch (err) {
    console.log("Error in fetching all brands: " + err.message);
    return response.json({ code: -1, message: "Failed to fetch brands list" });
  }
}

async function getBrandItems(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const brand_id = request.params.brand_id;
      if (!brand_id) return response.json({ code: 0, message: "Invalid data" });
      else {
        const query = "select b.brand_id as brand_id , i.item_id as item_id , b.name as brand_name , i.name as item_name , b.image as brand_images , i.images as item_image , i.category , iqu.iqu_id , iqu.price , iqu.quantity from item i join brand b on b.brand_id=i.brand_id join item_quantity_units iqu on iqu.item_id=i.item_id where i.brand_id=?"
        const conn = await db.getConnection();
        await conn
          .query(
            query,
            [brand_id]
          )
          .then((result) => {
            conn.release();
            result = result[0];
            return response.json({
              code: 1,
              message: `${result.length} ${
                result.length == 1 ? "item" : "items"
              } found`,
              data: result,
            });
          })
          .catch((err) => {
            conn.release();
            response.json({ code: 0, message: "Failed to fetch brands list" });
          });
      }
    } else
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
  } catch (err) {
    console.log("Error in getting items of a brand: " + err.message);
    return response.json({
      code: -1,
      message: "Failed to list items of requested brand",
    });
  }
}

async function updateBrand(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const {brand_id , name, image } = request.body;
      if (!brand_id || !name || !image)
        return response.json({
          code: 0,
          message: 'Invalid data'
        });
      const query = "update brand set name=? , image=? where brand_id=?";
      const conn = await db.getConnection();
      await conn
        .query(query, [
          name,
          image,
          brand_id,
        ])
        .then((result) => {
          conn.release();
          result = result[0];
          if (result.affectedRows > 0) {
            return response
              .status(200)
              .json({ code: 1, message: "Brand updated successfully" });
          } else {
            return response.json({ code: 0, message: "Failed to update brand details" });
          }
        })
        .catch((err) => {
          conn.release();
          console.log("Caught error at updating brand details due to " + err);
          return response.json({ code: 0, message: "Failed to update brand" });
        });
        
    } else
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
  } catch (err) {
    console.log("Error in update brand: " + err.message);
    return response.json({
      code: -1,
      message: "Failed to update brand details",
    });
  }
}

module.exports = {
  addBrand,
  removeBrand,
  getAllBrands,
  getBrandItems,
  updateBrand,
};
