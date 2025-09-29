module.exports = `
    SELECT id, name, description
    FROM passwords
    WHERE account_id = $1 
    AND ($4 = '' OR LOWER(name) ILIKE '%' || LOWER($4) || '%')
    OFFSET $2
    LIMIT $3
`