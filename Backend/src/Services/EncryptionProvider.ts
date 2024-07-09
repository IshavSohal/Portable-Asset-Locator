const crypto = require('crypto');

export class EncryptionProvider{

    // Encrypt a string
    public Encrypt(input: string): string {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // Encryption is aes-256-cbc
        const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM, key, iv);
        let encrypted = cipher.update(input, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
}