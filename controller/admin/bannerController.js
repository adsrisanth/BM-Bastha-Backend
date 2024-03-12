const db = require("../../config/MySQL_DB_Config");
const { checkIsAdmin } = require("./helper");

async function getAllBanners(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const query = "select * from admin_banner";
      const conn = await db.getConnection()
      await conn
        .query(query)
        .then((result) => {
          result = result[0];
          conn.release();
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
          console.log("Error in fetching list of all banners list: " + err);
          return response.json({
            code: 0,
            message: "Failed to fetch list of all banners",
          });
        });
    } else {
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
    }
  } catch (err) {
    console.log("Error in fetching list of all banners list: " + err);
    return response.json({
      code: -1,
      message: "Failed to fetch list of all banners",
    });
  }
}

async function getActiveBanners(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const query = "select * from admin_banner where isactive=true";
      const conn = await db.getConnection();
      await conn
        .query(query)
        .then((result) => {
          conn.release();
          result = result[0];
          return response.json({
            code: 1,
            message: `${result.length} active ${
              result.length == 1 ? "item" : "items"
            } found`,
            data: result,
          });
        })
        .catch((err) => {
          conn.release();
          console.log("Error in fetching list of active banners list: " + err);
          return response.json({
            code: 0,
            message: "Failed to fetch list of active banners",
          });
        });
    } else {
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
    }
  } catch (err) {
    console.log("Error in fetching list of active banners list: " + err);
    return response.json({
      code: -1,
      message: "Failed to fetch list of active banners",
    });
  }
}

async function addNewBanner(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const title = request.body.title;
      const banner_image = request.body.banner_image;
      const isActive = request.body.isActive || true;
      const link = request.body.link || "";

      if (title.length == 0 || banner_image.length == 0)
        return response.json({
          code: -1,
          message: "Incompatible Title or Image URL. Failed to add banner.",
        });
      const query =
        "insert into admin_banner (title , banner_image , isactive , link) values (?,?,?,?)";
      const conn = await db.getConnection();
      await conn
        .query(
          query,
          [title, banner_image, isActive, link]
        )
        .then((result) => {
          conn.release();
          result = result[0];
          if (result.affectedRows > 0)
            return response.json({
              code: 1,
              message: "Banner added successfully",
            });
          else
            return response.json({ code: 0, message: "Failed to add banner" });
        });
    } else {
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
    }
  } catch (err) {
    console.log("Error in adding new banner: " + err);
    return response.json({
      code: -1,
      message: "Failed to add new banner",
    });
  }
}

async function updateBanner(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const { banner_id, title, banner_image, isactive, link } = request.body;
      if (!banner_id || !title || !banner_image || !link)
        return response.json({
          code: 0,
          message: "Incomplete data. Failed to update banner",
        });
      const query =
        "update admin_banner set title=?, banner_image=? , isactive=?,link=? where banner_id=?";
      const conn = await db.getConnection();
      await conn
        .query(
          query,
          [title, banner_image, isactive, link, banner_id]
        )
        .then((result) => {
          conn.release();
          result = result[0];
          if (result.affectedRows > 0) {
            return response.json({
              code: 1,
              message: "Banner updated successfully",
            });
          } else
            return response.json({
              code: 0,
              message: "Failed to update banner",
            });
        })
        .catch((err) => {
          conn.release();
          console.log("Error in updating banner: " + err);
          return response.json({ code: 0, message: "Failed to update banner" });
        });
    } else {
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
    }
  } catch (err) {
    console.log("Error in update banner: " + err);
    return response.json({
      code: -1,
      message: "Failed to update banner",
    });
  }
}

async function removeBanner(request, response) {
  try {
    const isAdmin = checkIsAdmin(request.payload);
    if (isAdmin) {
      const banner_id = parseInt(request.params.banner_id);
      if (!banner_id)
        return response.json({
          code: 0,
          message: "No banner data is provided to remove.",
        });
      if (banner_id < 0)
        return response.json({
          code: 0,
          message: "No matching banner found to remove.",
        });
      const query = "delete from admin_banner where banner_id=?";
      const conn = await db.getConnection();
      await conn
        .query(query, [banner_id])
        .then((result) => {
          conn.release();
          if (result[0].affectedRows > 0)
            return response.json({
              code: 1,
              message: "Banner removed successfully.",
            });
          else
            return response.json({
              code: 0,
              message: "No matching banner found to remove.",
            });
        })
        .catch((err) => {
          conn.release();
          console.log("Error in removing banner: " + err);
          return response.json({ code: 0, message: "Failed to delete banner" });
        });
    } else {
      return response
        .status(401)
        .json({ code: -1, message: "Unauthorized access" });
    }
  } catch (err) {
    console.log("Error in remove banner: " + err);
    return response.json({
      code: -1,
      message: "Failed to remove banner",
    });
  }
}

module.exports = {
  getAllBanners,
  getActiveBanners,
  addNewBanner,
  updateBanner,
  removeBanner,
};
