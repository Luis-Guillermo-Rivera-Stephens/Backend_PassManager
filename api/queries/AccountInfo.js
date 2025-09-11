module.exports = `
    SELECT id, email, password
    FROM accounts
    WHERE id = $1
`;