module.exports = `
    SELECT id, email, password, twofaenabled
    FROM accounts
    WHERE id = $1
`;