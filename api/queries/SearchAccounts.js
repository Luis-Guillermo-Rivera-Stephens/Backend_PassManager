module.exports = `
    SELECT id, name, email
    FROM accounts
    WHERE type = 'client' AND ($1 = '' OR LOWER(name) ILIKE '%' || LOWER($1) || '%' OR LOWER(email) ILIKE '%' || LOWER($1) || '%')
    ORDER BY name DESC
    OFFSET $2
    LIMIT $3
`;