module.exports = `
    INSERT INTO accounts (id, name, email, password, created_at, verified, type) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)
`;