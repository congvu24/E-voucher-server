import type {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { EventSubscriber } from 'typeorm';

import { CitizenEntity } from '../modules/citizen/citizen.entity';
import { UtilsProvider } from '../providers/utils.provider';

@EventSubscriber()
export class CitizenSubscriber
  implements EntitySubscriberInterface<CitizenEntity>
{
  listenTo(): typeof CitizenEntity {
    return CitizenEntity;
  }

  beforeInsert(event: InsertEvent<CitizenEntity>): void {
    if (event.entity.password) {
      event.entity.password = UtilsProvider.generateHash(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<CitizenEntity>): void {
    if (event.entity!.password !== event.databaseEntity.password) {
      event.entity!.password = UtilsProvider.generateHash(
        event.entity!.password,
      );
    }
  }
}
