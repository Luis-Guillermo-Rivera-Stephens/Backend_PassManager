module.exports = `
    SELECT id, updateablebyclient, visibility
    FROM passwords
    WHERE id = $1 AND account_id = $2
`;
