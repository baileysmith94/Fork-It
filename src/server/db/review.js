const db = require('./client'); 

const getAllReviews = async () => {
  try {
    const { rows } = await db.query(`
    SELECT * FROM reviews
    `);
    return rows
  } catch (err) {
    throw err;
  }
}

const createReview = async ({ user_id, restaurant_id, rating, review_text, image_url }, token) => {
  try {
    const { rows: [review] } = await db.query(`
      INSERT INTO reviews(user_id, restaurant_id, rating, review_text, image_url)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *`, [user_id, restaurant_id, rating, review_text, image_url]);

    return review;
  } catch (err) {
    throw err;
  }
}


const getReviewById = async (reviewId) => {
  try {
    const { rows: [review] } = await db.query(`
      SELECT * 
      FROM reviews
      WHERE id = $1;`, [reviewId]);

    return review;
  } catch (err) {
    throw err;
  }
}

const getReviewsByRestaurantId = async (restaurantId) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM reviews
      WHERE restaurant_id = $1;
    `, [restaurantId]);

    return rows;
  } catch (error) {
    throw error;
  }
}


const updateReview = async (reviewId) => {
  const {rating, review_text, type, image_url} = fields; 
    delete fields.rating;
    delete fields.review_text;
    delete fields.type;
    delete fields.image_url;

  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try{
    if (setString.length > 0) {
      await client.query(`
      UPDATE reviews
      SET ${ setString } 
      WHERE id= ${ reviewId }
      RETURNING *;
      `, Object.values(fields));
    }

    if (rating === undefined){
      return await getReviewById(reviewId);
    }
    if (review_text === undefined){
      return await getReviewById(reviewId);
    }
    if (type === undefined){
      return await getReviewById(reviewId);
    }
    if (image_url === undefined){
      return await getReviewById(reviewId);
    }
  
    return await getReviewById(reviewId);
  } catch (error) {
    throw error;
  }
}

async function destroyReview(id) {
  try {
    await client.query(`
    DELETE FROM reviews
    WHERE "reviewId" = $1;
    `, [id]);
    const {rows: [review]} = await client.query(`
      DELETE FROM reviews 
      WHERE id = $1
      RETURNING *
    `, [id]);
    return review;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllReviews,
  createReview,
  getReviewById,
  getReviewsByRestaurantId,
  updateReview, 
  destroyReview
};
