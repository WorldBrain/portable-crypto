import expect from 'expect'
import { NodeEncryptionFactory } from './node';
import { testAesGcm256 } from './index.tests';

describe('Node.js encryption factory', () => {
    it('should encrypt and decrypt AES-256-GCM using an imported key', async () => {
        const data = 'super secret data'
        const decrypted = await testAesGcm256({
            encryptionFactory: new NodeEncryptionFactory(),
            data
        })
        expect(decrypted).toEqual(data)
    })
})
