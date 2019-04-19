import models from '../src/models';
import log from '../src/logging/service';
import { errorToObject } from '../src/utils/routes';
import uuidv4 from 'uuidv4';

async function main () {
  try {
    log.trace('SEQUELIZE', { message: 'Sync all defined models...', isShort: true });
    await models.sequelize.sync();

    log.trace('SEQUELIZE', { message: 'Delete all data from all tables...', isShort: true });
    await models.sequelize.truncate({ cascade: true });

    log.trace('SEQUELIZE', { message: 'Add users...', isShort: true });
    await models.user.bulkCreate([
      {
        name: 'Владислав',
        secondName: 'Бурлин',
        patronymic: 'Вячеславович',
        role: 'patient',
        username: 'burlin',
        password: 'burlin'
      }
    ]);

    log.trace('SEQUELIZE', { message: 'Add organizations...', isShort: true });
    let organizationId1 = uuidv4();
    let organizationId2 = uuidv4();
    await models.organization.bulkCreate([
      {
        id: organizationId1,
        title: 'Г. Пенза Государственное бюджетное учреждение здравоохранения "Городская поликлиника"',
        address: '440000, РОССИЯ, ПЕНЗЕНСКАЯ ОБЛ, Г ПЕНЗА, ВОЛОДАРСКОГО УЛ, д 34',
        site: 'http://penzagorpol.ru/',
        phone: '(8412) 99-87-12'
      },
      {
        id: organizationId2,
        title: 'Государственное автономное учреждение здравоохранения Пензенской области "Пензенская стоматологическая поликлиника"',
        address: 'РОССИЯ, ПЕНЗЕНСКАЯ ОБЛ, Г ПЕНЗА, ВОЛОДАРСКОГО УЛ, д 69',
        site: 'http://www.penzastom.ru',
        phone: '(8412) 46-97-02'
      },
      {
        title: 'Государственное бюджетное учреждение здравоохранения "Башмаковская районная больница"',
        address: '442060, РОССИЯ, ПЕНЗЕНСКАЯ ОБЛ, БАШМАКОВСКИЙ Р-Н, БАШМАКОВО РП, СТРОИТЕЛЕЙ УЛ, д 22',
        site: 'http://башмаковская-рб.рф',
        phone: '(8414) 34-12-44'
      },
      {
        title: 'Государственное бюджетное учреждение здравоохранения "Белинская районная больница"',
        address: '442250, РОССИЯ, ПЕНЗЕНСКАЯ ОБЛ, БЕЛИНСКИЙ Р-Н, Г БЕЛИНСКИЙ, ТУРИСТИЧЕСКАЯ УЛ, д 2',
        site: 'http://belinskaybolnica.ru/',
        phone: '(8415) 32-12-44'
      },
      {
        title: 'Государственное бюджетное учреждение здравоохранения "Бессоновская районная больница"',
        address: '442780, РОССИЯ, ПЕНЗЕНСКАЯ ОБЛ, БЕССОНОВСКИЙ Р-Н, СЕЛО БЕССОНОВКА, УЛИЦА ЦЕНТРАЛЬНАЯ, ДОМ 206',
        site: 'http://www.bess-crb.ru',
        phone: '(8412) 67-73-26'
      }
    ]);

    log.trace('SEQUELIZE', { message: 'Add departments...', isShort: true });
    await models.department.bulkCreate([
      {
        organizationId: organizationId1,
        title: 'Амбулатория воп (5-й виноградный пр-д, 22)',
        address: 'г Пенза, Кронштадтская ул, д. 12',
        phone: '(8412) 98-22-66, контакт-центр (8412) 999-130'
      },
      {
        organizationId: organizationId1,
        title: 'Амбулатория воп (пр-т строителей, 1)',
        address: 'г Пенза, Стасова ул, д. 7',
        phone: '(8412) 98-33-90, контакт-центр (8412) 999-130'
      },
      {
        organizationId: organizationId1,
        title: 'Амбулатория воп (ул. антонова, 14б)',
        address: 'г Пенза, Парковая ул, д. 3',
        phone: '(8412) 69-75-68, контакт-центр (8412) 999-130'
      },
      {
        organizationId: organizationId1,
        title: 'Амбулатория воп (ул. бийская, 9)',
        address: 'г Пенза, Краснова ул, д. 60',
        phone: '(8412) 33-98-99, контакт-центр (8412) 999-130'
      },
      {
        organizationId: organizationId2,
        title: 'Отделение № 10',
        address: 'г Пенза, Луначарского ул, д. 40',
        phone: '(8412) 46-97-39'
      },
      {
        organizationId: organizationId2,
        title: 'Отделение № 11 с. кондоль',
        address: 'Пензенский р-н, Кондоль С, Мира ул, д. 1',
        phone: '(8414) 75-50-23'
      },
      {
        organizationId: organizationId2,
        title: 'Отделение № 12 каменка',
        address: 'Каменский р-н, г Каменка, Белинская ул, д. 5',
        phone: '(8415) 65-51-93'
      },
      {
        organizationId: organizationId2,
        title: 'Отделение № 1а калинина, 1',
        address: 'г Пенза, Калинина ул, д. 1а',
        phone: '(8412) 46-97-28'
      }
    ]);
  } catch(err) {
    log.critical('REINIT DATABASE', errorToObject(err));
  }
}

main();