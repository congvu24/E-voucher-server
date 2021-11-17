import { InternalServerErrorException } from '@nestjs/common';

export class LedgerNotReadyExption extends InternalServerErrorException {
  constructor(error?: string) {
    super('error.ledger_not_ready', error);
  }
}
