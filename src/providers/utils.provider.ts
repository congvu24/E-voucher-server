/* eslint-disable @typescript-eslint/ban-types */
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import nodemailer from 'nodemailer';

import type { Optional } from '../types';

export class UtilsProvider {
  /**
   * generate hash from password or string
   * @param {string} password
   * @returns {string}
   */
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * generate random string
   * @param length
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length));
  }

  /**
   * validate text with hash
   * @param {string} password
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  static validateHash(
    password: string,
    hash: Optional<string>,
  ): Promise<boolean> {
    if (!password || !hash) {
      return Promise.resolve(false);
    }

    return bcrypt.compare(password, hash);
  }

  /**
   * encrypt data
   * @param data
   * @param {string} secret
   * @returns {string}
   */
  static encryptData(data: unknown, secret: string): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
  }

  /**
   * decrypt data
   * @param data
   * @param {string} secret
   * @returns {string}
   */
  static decryptData(value: string, secret: string): Object {
    const raw = CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8);

    if (raw) {
      return JSON.parse(
        CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8),
      );
    }

    throw new UnauthorizedException();
  }

  static async sendMailActivate(email: string, content: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER, // sender address
        to: email, // list of receivers
        subject: 'Activate your account', // Subject line
        text: content, // plain text body
      });
    } catch (error) {
      console.log(error);
      throw new Error(
        'Hệ thống không thể gửi mail xác nhận, liên hệ admin để xử lí!',
      );
    }
  }
}
