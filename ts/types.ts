export interface EncryptionFactory<Options extends { algorithms : string }> {
    generateKey? : <Algorithm extends Options['algorithms']>(options : { algorithm : Algorithm }) => Promise<EncryptionKey<Algorithm>>
    importKey : <Algorithm extends Options['algorithms']>(options : { algorithm : Algorithm, key : ExportedKey }) => Promise<EncryptionKey<Algorithm>>
    exportKey? : <Algorithm extends Options['algorithms']>(options : { key : EncryptionKey<Algorithm>, format : ExportedKeyFormat }) => Promise<ExportedKey>
    symmetricEncryption : <Algorithm extends Options['algorithms']>(options : { key : EncryptionKey<Algorithm> }) => SymmetricEncryption<Algorithm>
}

export type SymmetricEncryptionFromKey<Algorithm extends string> = (key : EncryptionKey<Algorithm>) => SymmetricEncryption<Algorithm>

export interface EncryptionKey<Algorithm extends string> {
    algorithm : Algorithm
}

export interface ExportedKey {
    data : string
    format : ExportedKeyFormat
}
export type ExportedKeyFormat = 'raw'

export interface SymmetricEncryption<Algorithm extends string> {
    algorithm : Algorithm
    encrypt(decrypted : { data : string }) : Promise<{ cipherText : string, nonce : string, authTag? : string }>
    decrypt(encrypted : { cipherText : string, nonce : string, authTag? : string }) : Promise<{data: string}>
}
