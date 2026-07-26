import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

/**
 * Field-level encryption service using AES via CryptoJS.
 *
 * This encrypts specific sensitive fields (dateOfBirth, address, phone)
 * before they hit the wire. This is an ADDITIONAL layer on top of TLS
 * and JWT auth — TLS already protects the transport. This control is
 * about not having sensitive values sit in plaintext in request/response
 * logs, browser dev tools network tab captures, or database columns.
 *
 * IMPORTANT: This does NOT replace authentication or authorization.
 * A compromised JWT still grants a legitimate-looking authenticated
 * request that can ask the backend to decrypt and return these fields.
 * This is about data-at-rest and log/transport-adjacent exposure,
 * not about access control.
 */
@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private readonly secret = environment.encryptionSecret;

  encrypt(value: string): string {
    if (!value) return value;
    return CryptoJS.AES.encrypt(value, this.secret).toString();
  }

  decrypt(encryptedValue: string): string {
    if (!encryptedValue) return encryptedValue;
    const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Encrypt specific sensitive fields on an object before sending to API.
   * Only encrypts: dateOfBirth, address, phone.
   * Does NOT encrypt entire payloads — that breaks server-side validation.
   */
  encryptSensitiveFields(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = { ...obj };
    if (result['dateOfBirth']) {
      result['dateOfBirth'] = this.encrypt(String(result['dateOfBirth']));
    }
    if (result['address']) {
      result['address'] = this.encrypt(String(result['address']));
    }
    if (result['phone']) {
      result['phone'] = this.encrypt(String(result['phone']));
    }
    return result;
  }

  /**
   * Decrypt specific sensitive fields on a response object from API.
   */
  decryptSensitiveFields(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = { ...obj };
    if (result['dateOfBirth']) {
      result['dateOfBirth'] = this.decrypt(String(result['dateOfBirth']));
    }
    if (result['address']) {
      result['address'] = this.decrypt(String(result['address']));
    }
    if (result['phone']) {
      result['phone'] = this.decrypt(String(result['phone']));
    }
    return result;
  }
}
