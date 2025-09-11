module.exports = `
    SELECT id, type, verified
    FROM accounts 
    WHERE id = $1
`;