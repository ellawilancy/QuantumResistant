import { sha256 } from 'crypto-hash'

class MockNet {
	private secrets: Map<number, any> = new Map()
	private shares: Map<string, any> = new Map()
	private nextSecretId: number = 0
	
	createClient() {
		return {
			createSecret: this.createSecret.bind(this),
			submitShare: this.submitShare.bind(this),
			reconstructSecret: this.reconstructSecret.bind(this),
			pqHash: this.pqHash.bind(this),
			pqEncrypt: this.pqEncrypt.bind(this),
			pqDecrypt: this.pqDecrypt.bind(this),
			pqSign: this.pqSign.bind(this),
			pqVerify: this.pqVerify.bind(this),
		}
	}
	
	async createSecret(threshold: number, totalShares: number) {
		if (threshold <= 0) return { success: false, error: 101 }
		if (totalShares < threshold) return { success: false, error: 102 }
		
		const secretId = this.nextSecretId++
		this.secrets.set(secretId, { threshold, totalShares, reconstructed: false })
		
		return { success: true, value: secretId }
	}
	
	async submitShare(secretId: number, shareIndex: number, share: string) {
		if (!this.secrets.has(secretId)) return { success: false, error: 104 }
		const secret = this.secrets.get(secretId)
		if (secret.reconstructed) return { success: false, error: 103 }
		if (shareIndex >= secret.totalShares) return { success: false, error: 102 }
		
		this.shares.set(`${secretId}-${shareIndex}`, share)
		return { success: true }
	}
	
	async reconstructSecret(secretId: number, submittedShares: string[]) {
		if (!this.secrets.has(secretId)) return { success: false, error: 104 }
		const secret = this.secrets.get(secretId)
		if (secret.reconstructed) return { success: false, error: 103 }
		if (submittedShares.length < secret.threshold) return { success: false, error: 105 }
		
		secret.reconstructed = true
		this.secrets.set(secretId, secret)
		return { success: true }
	}
	
	async pqHash(input: string) {
		const hash = await sha256(input)
		return { success: true, value: '0x' + hash }
	}
	
	async pqEncrypt(input: string, publicKey: string) {
		const result = await sha256(input + publicKey)
		return { success: true, value: '0x' + result }
	}
	
	async pqDecrypt(ciphertext: string, privateKey: string) {
		// In our mock, decryption just returns the ciphertext
		return { success: true, value: ciphertext }
	}
	
	async pqSign(message: string, privateKey: string) {
		const signature = await sha256(message + privateKey)
		return { success: true, value: '0x' + signature }
	}
	
	async pqVerify(message: string, signature: string, publicKey: string) {
		const expectedSignature = await sha256(message + publicKey)
		return { success: true, value: '0x' + signature === '0x' + expectedSignature }
	}
	
	private xor(a: string, b: string): string {
		const aBuf = Buffer.from(a.slice(2), 'hex')
		const bBuf = Buffer.from(b.slice(2), 'hex')
		const result = Buffer.alloc(Math.max(aBuf.length, bBuf.length))
		
		for (let i = 0; i < result.length; i++) {
			result[i] = (aBuf[i] || 0) ^ (bBuf[i] || 0)
		}
		
		return '0x' + result.toString('hex')
	}
}

export const mockNet = new MockNet()

