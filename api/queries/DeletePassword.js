module.exports = `
    DELETE FROM passwords
    WHERE id = $1 AND account_id = $2
`;