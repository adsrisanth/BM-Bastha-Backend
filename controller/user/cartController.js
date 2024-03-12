const db = require("../../config/MySQL_DB_Config");

async function addToCart(req, res) {
  try {
    const uid = req.payload.uid;
    const { iqu_id, units } = req.body;
    if (typeof units !== "number" || units < 1) {
      return res.json({ code: -1, message: "Invalid units input." });
    }
    let query = "insert into cart(uid , iqu_id , units) values(?,?,?)";
    const conn = await db.getConnection()
    await conn
      .query(query, [
        uid,
        iqu_id,
        units,
      ])
      .then((result) => {
        conn.release();
        if (result[0].affectedRows > 0)
          return res.json({ code: 1, message: "Added to cart" });
        else
          return res.json({ code: -1, message: "Failed to add item to cart" });
      })
      .catch((err) => {
        conn.release();
        if (err.sqlState == "23000") {
          return res.json({
            code: -1,
            message: "Invalid product to add into cart",
          });
        }
        return res.json({ code: -1, message: "Failed to add item to cart" });
      });
  } catch (err) {
    conn.release();
    console.log("Error to add item in cart: " + err.message);
    return res.json({ code: -1, message: "Failed to add item to cart" });
  }
}

async function getCartItems(req, res) {
  try {
    const uid = req.payload.uid;
    const query ="select c.uid , iqu.iqu_id , i.item_id , i.name , iqu.quantity , i.description , iqu.price , i.brand_id , i.images , iqu.units , c.units from cart c join item_quantity_units iqu on iqu.iqu_id = c.iqu_id join item i on i.item_id = iqu.item_id join brand b on i.brand_id=b.brand_id where c.uid = ?"
    const conn = await db.getConnection()
    await conn.query(query,
        [uid]
      )
      .then((result) => {
        conn.release();
        result = result[0];
        return res.json({
          code: 1,
          data: result,
          message: "Cart items fetched successfully",
        });
      })
      .catch((err) => {
        conn.release();
        return res.json({ code: 0, message: "Unable to fetch cart items" });
      });
  } catch (err) {
    console.log("Error to get items in cart: " + err.message);
    return res.json({ code: -1, message: "Failed to get items from cart" });
  }
}

async function removeItemFromCart(req, res) {
  try {
    const uid = req.payload.uid;
    const { iqu_id } = req.body;
    const query = "delete from cart where uid = ? and iqu_id = ?"
    const conn = await db.getConnection()
    await conn
      .query(query, [uid, iqu_id])
      .then((result) => {
        conn.release();
        result = result[0];
        if (result.affectedRows > 0)
          return res.json({ code: 1, message: "Item removed from cart." });
        else
          return res.json({ code: 0, message: "No matching item to delete." });
      })
      .catch((err) => {
        conn.release();
        return res.json({
          code: -1,
          message: "Failed to remove item from cart.",
        });
      });
  } catch (err) {
    console.log("Error in removing item from cart: " + err.message);
    return res.json({ code: -1, message: "Failed to remove item from cart." });
  }
}

async function updateCartItem(req, res) {
  try {
    const uid = req.payload.uid;
    const { iqu_id, units } = req.body;
    const query = "update cart set units = ? where uid = ? and iqu_id = ?"
    const conn = await db.getConnection()
    await conn
      .query(query, [
        units,
        uid,
        iqu_id,
      ])
      .then((result) => {
        conn.release();
        result = result[0];
        if (result.affectedRows > 0)
          return res.json({ code: 1, message: "Item updated in cart." });
        else
          return res.json({ code: 0, message: "No matching item to update." });
      })
      .catch((err) => {
        conn.release();
        return res.json({
          code: -1,
          message: "Failed to update item in cart.",
        });
      });
  } catch (err) {
    console.log("Error in updating item in cart: " + err.message);
    return res.json({ code: -1, message: "Failed to update item records" });
  }
}

module.exports = {
  addToCart,
  getCartItems,
  removeItemFromCart,
  updateCartItem,
};