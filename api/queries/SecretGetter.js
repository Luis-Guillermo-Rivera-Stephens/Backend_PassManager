module.exports = `
    SELECT secret FROM two_factor_authentication WHERE account_id = $1
`;