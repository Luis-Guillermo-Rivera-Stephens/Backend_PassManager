class EmailManager {


    static ValidateEmail(email) { 
        let _email = null;
        try {
            _email = trim(email);
        } catch (error) {
            return false;
        }
        if (!_email) return false;
        if (typeof _email !== 'string') return false;
        if (_email.length < 3 || _email.length > 254) return false;
    
        const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        return regex.test(_email);
    }

    static SanitizeEmail(email) {
        return email.trim();
    }

    static async sendVerificationEmail(email) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification from ReservAI',
                text: 'Please click the link below to verify your email: ' + process.env.EMAIL_VERIFICATION_URL + this.email
            };

            await transporter.sendMail(mailOptions);
            return {
                success: true
            }
        } catch (error) {
            return {
                error: error.message,
                success: false
            }
        }
    }

}