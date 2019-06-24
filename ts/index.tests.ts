import { EncryptionFactory, ExportedKey } from "./types";

export const EXAMPLE_KEY : ExportedKey = {
    format: 'raw',
    data: 'bc3c9959dcd099d408b138938c8cd1d6f7075d0b34d2160f07ce0a4db07025db'
}

export async function testAesGcm256(options : {
    encryptionFactory : EncryptionFactory<{algorithms: 'aes-256-gcm'}>,
    data : string,
}) {
    const { encryptionFactory } = options
    const key = await encryptionFactory.importKey({ algorithm: 'aes-256-gcm', key: EXAMPLE_KEY })
    const symmetricEncrytpion = encryptionFactory.symmetricEncryption({ key })
    const encrypted = await symmetricEncrytpion.encrypt({ data: options.data })
    const decrypted = await symmetricEncrytpion.decrypt(encrypted)
    return decrypted.data
}
