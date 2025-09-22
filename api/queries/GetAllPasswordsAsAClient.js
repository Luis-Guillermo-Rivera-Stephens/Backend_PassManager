module.exports = `
    SELECT id, name, description
    FROM passwords
    WHERE account_id = $1 AND visibility = true
    OFFSET $2
    LIMIT $3
`