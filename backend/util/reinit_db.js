import models from '../src/models';
import log from '../src/logging/service';
import { errorToObject } from '../src/utils/routes';

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
    await models.organization.bulkCreate([
      {
        title: 'Г. Пенза Государственное бюджетное учреждение здравоохранения "Городская поликлиника"',
        address: '440000, РОССИЯ, ПЕНЗЕНСКАЯ ОБЛ, Г ПЕНЗА, ВОЛОДАРСКОГО УЛ, д 34',
        site: 'http://penzagorpol.ru/',
        phone: '(8412) 99-87-12'
      },
      {
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
  } catch(err) {
    log.critical('REINIT DATABASE', errorToObject(err));
  }
}

main();