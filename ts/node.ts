import * as crypto from 'crypto'
import { EncryptionFactory, EncryptionKey, SymmetricEncryption, ExportedKey, ExportedKeyFormat } from "./types";

export type SupportedAlgorithms = 'aes-256-gcm'

type SymmetricKeyOptions<Algorithm extends SupportedAlgorithms> = { key : EncryptionKey<Algorithm> }

interface NodeSecretKey<Algorithm extends SupportedAlgorithms> extends EncryptionKey<Algorithm> {
    data: Buffer
}

export class NodeEncryptionFactory implements EncryptionFactory<{ algorithms: SupportedAlgorithms }> {
    async generateKey<Algorithm extends SupportedAlgorithms>(options : { algorithm : Algorithm }) : Promise<NodeSecretKey<Algorithm>> {
        return this.importKey({ algorithm: options.algorithm, key: { format: 'raw', data: crypto.randomBytes(32).toString('hex') }})
    }

    async importKey<Algorithm extends SupportedAlgorithms>(options: { algorithm: Algorithm, key: ExportedKey }) : Promise<NodeSecretKey<Algorithm>> {
        return {
            algorithm: options.algorithm,
            data: Buffer.from(options.key.data, 'hex'),
        }
    }

    async exportKey<Algorithm extends SupportedAlgorithms>(options: { key : EncryptionKey<Algorithm>, format : ExportedKeyFormat }) : Promise<ExportedKey> {
        return { data: (options.key as NodeSecretKey<Algorithm>).data.toString('hex'), format: 'raw' }
    }

    symmetricEncryption<Algorithm extends SupportedAlgorithms>(options : SymmetricKeyOptions<Algorithm>) : SymmetricEncryption<Algorithm> {
        return new NodeSymmetricEncryption<Algorithm>(options.key as NodeSecretKey<Algorithm>)
    }
}

class NodeSymmetricEncryption<Algorithm extends SupportedAlgorithms> implements SymmetricEncryption<Algorithm> {
    public algorithm : Algorithm

    constructor(private key : NodeSecretKey<Algorithm>) {
        this.algorithm = key.algorithm
    }

    async encrypt(decrypted : { data : string }) : Promise<{ cipherText : string, nonce : string, authTag? : string }> {
        const nonce = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv(this.algorithm, this.key.data, nonce)
        const cipherText = cipher.update(decrypted.data, 'utf8')
        cipher.final()
        
        return { cipherText: cipherText.toString('hex'), nonce: nonce.toString('hex') }
    }

    async decrypt(encrypted : { cipherText : string, nonce : string, authTag? : string }) : Promise<{data: string}> {
        const nonce = Buffer.from(encrypted.nonce, 'hex')
        const decipher = crypto.createDecipheriv(this.algorithm, this.key.data, nonce)
        const dataBuffer = Buffer.from(encrypted.cipherText, 'hex')
        
        const data = decipher.update(dataBuffer, null as any, 'utf8')
        return { data }
    }
}
