module.exports = `
    SELECT count(*) > 0
    FROM accounts 
    WHERE name = $1
`;