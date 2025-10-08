module.exports = `
    SELECT salt, email FROM accounts WHERE id = $1;
`;