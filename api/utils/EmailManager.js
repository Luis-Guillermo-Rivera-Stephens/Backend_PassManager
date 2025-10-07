class EmailManager {

    static getVerificationEmailTemplate(verificationEndpoint) {
        return `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <tr>
                    <td style="padding: 30px;">
                        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
                            ¡Gracias por registrarte en <span style="color: #3f51b5;">ReservAI</span>!
                        </h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                            Para finalizar tu registro y activar tu cuenta, haz clic en el siguiente enlace:
                        </p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                                <td align="center">
                                    <a href="${verificationEndpoint}" 
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       style="display: inline-block; 
                                              background-color: #3f51b5; 
                                              color: #ffffff; 
                                              text-decoration: none; 
                                              padding: 15px 30px; 
                                              font-size: 16px; 
                                              font-weight: bold;
                                              border: 2px solid #3f51b5;
                                              mso-padding-alt: 0;">
                                        VERIFICAR MI CUENTA
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #f8f9fa;">
                            <tr>
                                <td style="padding: 15px; text-align: center;">
                                    <p style="font-size: 12px; color: #666; margin: 0 0 10px 0;">
                                        <strong>¿El botón no funciona?</strong> Copia y pega este enlace en tu navegador:
                                    </p>
                                    <p style="font-size: 12px; color: #3f51b5; word-break: break-all; margin: 0; padding: 10px; background-color: white; border: 1px solid #ddd;">
                                        ${verificationEndpoint}
                                    </p>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="color: #999; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0;">
                            Si tú no realizaste esta solicitud de registro, puedes ignorar este mensaje con total seguridad.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
                            <strong>ReservAI</strong> automatiza la interacción con clientes a través de WhatsApp y llamadas telefónicas, simplificando la comunicación y mejorando la experiencia del cliente.
                        </p>
                        
                        <p style="color: #ccc; font-size: 12px; text-align: center; margin: 0;">
                            <a href="https://reservailanding.vercel.app" style="color: #3f51b5; text-decoration: none;">reservailanding.vercel.app</a>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;
    }

    static ValidateEmail(email) { 
        console.log('ValidateEmail: starting...');
        if (!email || typeof email !== 'string') return false;
        let _email = null;
        try {
            _email = email.trim();
        } catch (error) {
            console.log('ValidateEmail: error', error);
            return false;
        }
        if (!_email) return false;
        if (typeof _email !== 'string') return false;
        if (_email.length < 3 || _email.length > 254) return false;
    
        const regex = /[a-zA-Z0-9\._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        return regex.test(_email);
    }

    static SanitizeEmail(email) {
        return email.trim();
    }

    static async sendVerificationEmail(email, token) {
        try {
            const nodemailer = require('nodemailer');
            
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
                throw new Error('EMAIL_USER or EMAIL_PASSWORD environment variables are not set');
            }
            
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            let host = process.env.HOST || 'http://localhost:3000';
            const verificationEndpoint = `${host}/verification/${token}`;
            console.log('✅ EmailManager: sending verification email to:', email);
            const htmlTemplate = this.getVerificationEmailTemplate(verificationEndpoint);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verificación de Email - ReservAI',
                html: htmlTemplate,
                text: `Por favor haz clic en el siguiente enlace para verificar tu email: ${verificationEndpoint}`
            };

            await transporter.sendMail(mailOptions);
            console.log('✅ EmailManager: verification email sent successfully to:', email);
            return {
                success: true
            }
        } catch (error) {
            console.log('❌ EmailManager: error sending verification email:', error);
            return {
                error: error.message,
                success: false
            }
        }
    }

}

module.exports = EmailManager;