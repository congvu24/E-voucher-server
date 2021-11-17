import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';

@Injectable()
export class QrcodeService {
  async createQRCode(input: any): Promise<string> {
    return QRCode.toDataURL(JSON.stringify(input), { width: 300 });
  }
}
