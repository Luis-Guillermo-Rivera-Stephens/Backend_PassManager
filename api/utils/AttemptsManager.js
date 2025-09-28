class Attempts {
    constructor(number, first_attempt_at) {
        this.number = number;
        this.first_attempt_at = first_attempt_at;
    }
}

class AttemptsManager {
    constructor() {
        this.attempts = null;
    }

    static initialize() {
        if (this.attempts) {
            return;
        }
        this.attempts = new Map();
    }

    static getAttempts(account_id) {
        return this.attempts.get(account_id);
    }

    static firstAttempt(account_id) {
        this.attempts.set(account_id, new Attempts(1, new Date()));
    }

    static incrementAttempt(account_id) {
        const currentAttempt = this.attempts.get(account_id);
        if (currentAttempt) {
            this.attempts.set(account_id, new Attempts(
                currentAttempt.number + 1, 
                currentAttempt.first_attempt_at
            ));
        }
        else {
            this.firstAttempt(account_id);
        }
    }
    static resetAttempt(account_id) {
        this.attempts.delete(account_id);
    }

    static validateNewAttempt(account_id) {
        let attempt_ = this.attempts.get(account_id);
        if (!attempt_) {
            return true;
        }
        
        // Si han pasado más de 1 hora desde el primer intento, resetear
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hora = 60 minutos
        if (attempt_.first_attempt_at < oneHourAgo) {
            this.resetAttempt(account_id);
            return true;
        }
        
        // Si tiene 5 o más intentos y no ha pasado 1 hora, bloquear
        if (attempt_.number > 5) {
            return false;
        }
        
        return true;
    }
}

module.exports = AttemptsManager;
