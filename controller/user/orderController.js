const db = require("../../config/MySQL_DB_Config");

//TODO: Payment mode and method should be added
async function placeOrder(req, res) {
  try {
    const uid = req.payload.uid;
    const { iqu_id, item_id, units, delivery_address, price } = req.body; //Have to send price to each_item
    if (!iqu_id || !units || !delivery_address || !price || !item_id) {
      return res.json({ code: 0, message: "Failed to place order. Try again" });
    } else {
      const query =
        "insert into orders(uid , iqu_id , item_id , units , delivery_address , price) values (? , ? , ? , ? , ? , ?)";
      const conn = await db.getConnection()
      await conn
        .query(
          query,
          [
            uid,
            iqu_id,
            item_id,
            units,
            delivery_address,
            (units * price).toFixed(3),
          ]
        )
        .then((result) => {
          conn.release();
          if (result[0].affectedRows > 0) {
            return res.json({
              code: 1,
              message: "Order placed successfully",
            });
          } else
            return res.json({
              code: 0,
              message: "Failed to place order. Try again",
            });
        })
        .catch((err) => {
          conn.release();
          console.log(
            "Failed to place order inside database due to " + err.message
          );
          if (err.sqlState == "45000")
            return res.json({
              code: 0,
              message:
                "Oops! The quantity requested exceeds available stock.Please adjust your order. Thank you!",
            });
          return res.json({
            code: -1,
            message: "Failed to place order. Try again",
          });
        });
    }
  } catch (err) {
    console.log("Error in placing order due to " + err.message);
    return res.json({ code: -1, message: "Failed to place order" });
  }
}

async function cancelOrder(req, res) {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return res.json({ code: 0, message: "Failed to cancel order" });
    } else {
      const query =
        "update orders set order_status='cancellation_waiting' where order_id=? and order_status in ('waiting' , 'confirmed', 'order_placed' ,'shipped' , 'out-for-delivery')";
      const conn = await db.getConnection()
      await conn
        .query(
          query,
          [order_id]
        )
        .then((result) => {
          conn.release();
          if (result[0].affectedRows > 0) {
            return res.json({
              code: 1,
              message:
                "Cancellation request sent. Our team will contact you shortly.",
            });
          } else
            return res.json({
              code: 0,
              message: "Failed to cancel order. Try again",
            });
        })
        .catch((err) => {
          conn.release();
          console.log(
            "Error in cancellation of order in DB due to " + err.message
          );
          return res.json({
            code: 0,
            message: "Failed to cancel order. Try again",
          });
        });
    }
  } catch (err) {
    console.log("Error in cancelling order due to " + err.message);
    return res.json({ code: -1, message: "Failed to cancel order" });
  }
}

async function getOrderList(req, res) {
  try {
    const uid = req.payload.uid;
    const query = "select o.order_id , o.iqu_id, o.item_id , i.name , iqu.quantity , o.price , o.units , o.order_status , i.images from orders o JOIN item_quantity_units iqu on iqu.iqu_id=o.iqu_id join item i on i.item_id=o.item_id where o.uid=?"
    const conn = await db.getConnection()
    await conn.query(
        query,
        [uid]
      )
      .then((result) => {
        conn.release();
        result = result[0];
        return res.json({
          code: 1,
          data: result,
          message: `${result.length} ${
            result.length > 1 ? "items" : "item"
          } found.`,
        });
      })
      .catch((err) => {
        conn.release();
        console.log("Error in fetching order list in DB due to " + err.message);
      });
  } catch (err) {
    console.log("Error in order list due to " + err.message);
    return res.json({ code: -1, message: "Failed to get order list" });
  }
}

async function getOrderDetails(req, res) {
  try {
    const order_id = req.query.order_id;
    const query = "select o.order_id , o.item_id , i.name as item_name , b.name as brand_name , o.price , o.units , iqu.quantity , o.order_status , i.images , o.delivery_address , o.ordered_date , o.payment_done , o.payment_mode from orders o join item_quantity_units iqu on iqu.iqu_id=o.iqu_id join item i on i.item_id=iqu.item_id join brand b on b.brand_id=i.item_id where o.order_id=?"
    const conn = await db.getConnection()
    await conn
      .query(
        query,
        [order_id]
      )
      .then((result) => {
        conn.release();
        result = result[0];
        return res.json({
          code: 1,
          data: result,
          message: "Order details fetched successfully",
        });
      })
      .catch((err) => {
        conn.release();
        console.log(
          "Error in fetching order details in DB due to " + err.message
        );
        return res.json({ code: -1, message: "Failed to get order details" });
      });
  } catch (err) {
    console.log("Error in order item details due to " + err.message);
    return res.json({ code: -1, message: "Failed to get order details" });
  }
}

async function submitReviewRating(req, res) {
  try {
    const uid = req.payload.uid;
    const { item_id, rating, review } = req.body;
    const images = req.body.images || "[]";
    if (!item_id || !rating || !review)
      return res.json({
        code: 0,
        message: "Invalid data. Failed to submit review",
      });
    const query =
      "insert into item_rating_review (uid , item_id , rating , review , images) values (? , ? , ? , ? , ?)";
    const conn = await db.getConnection()
    await conn
      .query(
        query,
        [uid, item_id, rating, review, images]
      )
      .then((result) => {
        conn.release();
        if (result[0].affectedRows > 0)
          return res.json({
            code: 1,
            message: "Review submitted successfully",
          });
        else
          return res.json({
            code: 0,
            message: "Failed to submit review. Try again",
          });
      })
      .catch((err) => {
        conn.release();
        console.log("Caught error while adding review due to " + err);
        if (err.sqlState == 45000) {
          return res.json({
            code: 0,
            message: "Please purchase the item before reviewing. Thank you!",
          });
        }
        return res.json({
          code: 0,
          message: "Failed to submit review. Try again",
        });
      });
  } catch (err) {
    console.log("Error in order item details due to " + err.message);
    return res.json({ code: -1, message: "Failed to get order details" });
  }
}

module.exports = {
  placeOrder,
  cancelOrder,
  getOrderDetails,
  getOrderList,
  submitReviewRating,
};
