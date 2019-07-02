import expect from 'expect'
import { testAesGcm256 } from './index.tests';
import { WebEncryptionFactory } from './web';

describe('Web encryption factory', () => {
    it('should encrypt and decrypt AES-256-GCM using an imported key', async () => {
        const data = 'super secret data'
        const decrypted = await testAesGcm256({
            encryptionFactory: new WebEncryptionFactory(),
            data
        })
        expect(decrypted).toEqual(data)
    })
})
