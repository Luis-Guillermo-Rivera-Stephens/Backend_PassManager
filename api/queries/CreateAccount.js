module.exports = `
    INSERT INTO accounts (id, email, password, createdAt, verified, type) 
    VALUES ($1, $2, $3, $4, $5, $6)
`;