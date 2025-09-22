module.exports = `
    SELECT id, name, description, password, updateableByClient, visibility, account_id
    FROM passwords
    WHERE id = $1 AND account_id = $2 AND visibility = true
`;
