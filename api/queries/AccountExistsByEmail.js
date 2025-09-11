module.exports = `
    SELECT id, type, verified
    FROM accounts 
    WHERE email = $1
`;