module.exports = `  
    INSERT INTO passwords (id, name, description, password, updateablebyclient, visibility, account_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
`;