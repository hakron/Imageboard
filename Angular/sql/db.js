var spicePg = require('spiced-pg');
var secrets = require('./secrets.json');
var dbUrl = process.env.DATABASE_URL ||`postgres:${secrets.dbUser}:${secrets.password}@localhost:5432/images`;
var db = spicePg(dbUrl);

// <========= fn insert the imgs in the db ==========>

function insertImgs(img, author, title, description){
  const q = `INSERT INTO images
  (image, username, title, description)
  VALUES ($1, $2, $3, $4) RETURNING *`
  ;
  const params = [
    img,
    author,
    title,
    description
  ];
  return db.query(q, params).then(function (results) {
    console.log(results, "results after insert the img");
    return results.rows;
  }).catch(function(err){
    console.log(err);
  });
}
function getImgs() {

  const q = `SELECT *
  FROM images`
  ;
  return db.query(q, []).then(function (results) {
    return results.rows;
  }).catch(function(err){
    console.log(err);
  });

}
function getSingleImg(id){
  const q =  `SELECT *
  FROM images WHERE id = $1`
  ;
  const params =[
    id
  ];
  return db.query(q, params).then(function(results){
    return results.rows[0];
  });

}
function insertComment(image_id, comments, name) {
  const q = `INSERT INTO comments
  (image_id, comments, name)
  VALUES ($1, $2, $3)`
  ;
  const params = [
    image_id,
    comments,
    name
  ];
  return db.query(q, params).then(function (results) {
    return results.rows;
  });
}
function getComments(id) {
  const q = `SELECT comments, name, created_at
  FROM comments
  WHERE image_id = $1`
  ;
  const params = [
    id
  ];
  return db.query(q, params).then(function(results){
    return results.rows;
  });
}
function deleteImg(id){
  const q = `DELETE FROM images
  WHERE id = $1`
  ;
  const params = [
    id
  ];
  return db.query(q, params).then(function(results){
    console.log(results.rows);
    return results.rows;
  });
}
exports.insertImgs = insertImgs;
exports.getImgs = getImgs;
exports.getSingleImg = getSingleImg;
exports.insertComment = insertComment;
exports.getComments = getComments;
exports.deleteImg = deleteImg;
