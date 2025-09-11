module.exports = `
    UPDATE accounts 
    SET verified = true 
    WHERE id = $1
`