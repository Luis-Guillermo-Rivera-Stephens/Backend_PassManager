module.exports = `
    SELECT count(*) > 0 as exists
    FROM accounts 
    WHERE name = $1
`;