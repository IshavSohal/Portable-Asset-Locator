const crypto = require('crypto');

export class EncryptionProvider{
    readonly keyValue = 33
    readonly ivValue = 16

    // Encrypt a string
    public Encrypt(input: string): [string, Buffer] {
        const iv = crypto.randomBytes(this.ivValue);

        // Encryption is aes-256-cbc
        const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM, process.env.ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(input, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return [encrypted, iv];
    }

    public Decrypt(input: string, iv:Buffer): string {
        const decipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGORITHM, process.env.ENCRYPTION_KEY, iv);

        let decrypted = decipher.update(input, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    public EncryptionComparison(encryptedString: string, comparison:string, iv:Buffer): boolean {
        var decrypted = this.Decrypt(encryptedString, iv);
        return decrypted == comparison;
    }
}