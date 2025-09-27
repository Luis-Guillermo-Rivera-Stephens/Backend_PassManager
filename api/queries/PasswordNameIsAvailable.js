module.exports = `
    SELECT count(*) > 0 as exists
    FROM passwords 
    WHERE name = $1 AND account_id = $2
`;