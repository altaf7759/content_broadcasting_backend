import pool from "../config/db.js"

export const User = {
      findByEmail: async (email) => {
            const query = 'SELECT * FROM users WHERE email = $1;'
            const result = await pool.query(query, [email])
            return result.rows[0]
      },

      create: async (name, email, password_hash = hashedPassword, role) => {
            const query = `
                  INSERT INTO users (name, email, password_hash, role)
                  VALUES ($1, $2, $3, $4)
                  RETURNING id, name, email, role;
            `

            const values = [name, email, password_hash, role]
            const result = await pool.query(query, values)

            return result.rows[0]
      }
}

