import { EncryptionFactory, EncryptionKey, SymmetricEncryption, ExportedKey, ExportedKeyFormat } from "./types";

export type SupportedAlgorithms = 'aes-256-gcm'

type SymmetricKeyOptions<Algorithm extends SupportedAlgorithms> = { key : EncryptionKey<Algorithm> }

interface WebSecretKey<Algorithm extends SupportedAlgorithms> extends EncryptionKey<Algorithm> {
    // data: Buffer
}

export class WebEncryptionFactory implements EncryptionFactory<{ algorithms: SupportedAlgorithms }> {
    async generateKey<Algorithm extends SupportedAlgorithms>(options : { algorithm : Algorithm }) : Promise<WebSecretKey<Algorithm>> {
        return this.importKey({ algorithm: options.algorithm, key: { format: 'raw', data: '' }})
    }

    async importKey<Algorithm extends SupportedAlgorithms>(options: { algorithm: Algorithm, key: ExportedKey }) : Promise<WebSecretKey<Algorithm>> {
        return {
            algorithm: options.algorithm,
            // data: Buffer.from(options.key.data, 'ascii'),
        }
    }

    async exportKey<Algorithm extends SupportedAlgorithms>(options: { key : EncryptionKey<Algorithm>, format : ExportedKeyFormat }) : Promise<ExportedKey> {
        return { data: '', format: 'raw' }
    }

    symmetricEncryption<Algorithm extends SupportedAlgorithms>(options : SymmetricKeyOptions<Algorithm>) : SymmetricEncryption<Algorithm> {
        return new WebSymmetricEncryption<Algorithm>(options.key as WebSecretKey<Algorithm>)
    }
}

class WebSymmetricEncryption<Algorithm extends SupportedAlgorithms> implements SymmetricEncryption<Algorithm> {
    public algorithm : Algorithm

    constructor(private key : WebSecretKey<Algorithm>) {
        this.algorithm = key.algorithm
    }

    async encrypt(decrypted : { data : string }) : Promise<{ cipherText : string, nonce : string, authTag? : string }> {
        return { cipherText: '', nonce: '' }
    }

    async decrypt(encrypted : { cipherText : string, nonce : string, authTag? : string }) : Promise<{data: string}> {
        return { data: '' }
    }
}
