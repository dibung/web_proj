const db = require('../db');
const bcrypt = require('bcrypt');

exports.createUser = async ({ email, password, username, admin = false }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    `INSERT INTO user (email, password, username, admin) VALUES (?, ?, ?, ?)`,
    [email, hashedPassword, username, admin]
  );

  return { id: result.insertId, email, username, admin };
};

exports.getUserById = async (id) => {
  const [rows] = await db.query(`SELECT id, email, username, admin, created_at, updated_at FROM user WHERE id = ? AND deleted_at IS NULL`, [id]);
  return rows[0];
};

exports.getUsers = async () => {
  const [rows] = await db.query(`SELECT id, email, username, admin, created_at, updated_at FROM user WHERE deleted_at IS NULL`);
  return rows;
};

exports.updateUser = async (id, { username, admin }) => {
  await db.query(`UPDATE user SET username = ?, admin = ?, updated_at = NOW() WHERE id = ?`, [username, admin, id]);
  return this.getUserById(id);
};

exports.deactivateUser = async (id) => {
  await db.query(`UPDATE user SET deleted_at = NOW() WHERE id = ?`, [id]);
  return { id };
};
