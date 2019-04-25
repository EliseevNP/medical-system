import models from '../src/models';
import log from '../src/logging/service';
import { errorToObject } from '../src/utils/routes';
import uuidv4 from 'uuidv4';
import dateAndTime from 'date-and-time';

// Функция добавляет к расписанию доктора с идентификатором doctorId свободную неделю.
// Добавляются свободные event'ы начиная с ближайшего понедельника, относительно переданной в параметре даты
async function addFreeWeekToDoctor(doctorId, date) {
  let mondey = date;
  let tuesday = new Date();
  let wednesday = new Date();
  let thursday = new Date();
  let friday = new Date();
  let saturday = new Date();

  if (mondey.getDay()) {
    // Сегодня не воскресенье
    mondey.setDate(mondey.getDate() + 8 - mondey.getDay());
  } else {
    // Сегодня воскресенье
    mondey.setDate(mondey.getDate() + 1);
  }

  tuesday = dateAndTime.addDays(mondey, 1);
  wednesday = dateAndTime.addDays(mondey, 2);
  thursday = dateAndTime.addDays(mondey, 3);
  friday = dateAndTime.addDays(mondey, 4);
  saturday = dateAndTime.addDays(mondey, 5);

  mondey.setHours(8, 0, 0, 0);
  tuesday.setHours(8, 0, 0, 0);
  wednesday.setHours(8, 0, 0, 0);
  thursday.setHours(8, 0, 0, 0);
  friday.setHours(8, 0, 0, 0);
  saturday.setHours(8, 0, 0, 0);

  let week = [mondey, tuesday, wednesday, thursday, friday, saturday];

  week.forEach(async (day) => {
    let events = [
      day,
      dateAndTime.addHours(new Date(day.toString()), 1),
      dateAndTime.addHours(new Date(day.toString()), 2),
      dateAndTime.addHours(new Date(day.toString()), 3),
      dateAndTime.addHours(new Date(day.toString()), 4),
      dateAndTime.addHours(new Date(day.toString()), 5),
      dateAndTime.addHours(new Date(day.toString()), 6),
      dateAndTime.addHours(new Date(day.toString()), 7),
      dateAndTime.addHours(new Date(day.toString()), 8)
    ].map((time) => {
      return {
        doctorId,
        status: 'free',
        date: time
      };
    });
    await models.event.bulkCreate(events);
  });
}

async function main () {
  try {
    log.trace('SEQUELIZE', { message: 'Sync all defined models...', isShort: true });
    await models.sequelize.sync();

    log.trace('SEQUELIZE', { message: 'Delete all data from all tables...', isShort: true });
    await models.sequelize.truncate({ cascade: true });

    log.trace('SEQUELIZE', { message: 'Add users...', isShort: true });
    let userId1 = uuidv4();
    let userId2 = uuidv4();
    let userId3 = uuidv4();
    let userId4 = uuidv4();
    let userId5 = uuidv4();
    let userId6 = uuidv4();
    let userId7 = uuidv4();
    let userId8 = uuidv4();
    let userId9 = uuidv4();
    let userId10 = uuidv4();
    let userId11 = uuidv4();
    let userId12 = uuidv4();
    let userId13 = uuidv4();
    let userId14 = uuidv4();
    await models.user.bulkCreate([
      {
        name: 'Владислав',
        secondName: 'Бурлин',
        patronymic: 'Вячеславович',
        role: 'patient',
        username: 'burlin',
        password: 'burlin'
      },
      {
        id: userId1,
        name: 'Людмила',
        secondName: 'Бирюзова',
        patronymic: 'Ивановна',
        role: 'doctor',
        username: 'doctor1',
        password: 'doctor1'
      },
      {
        id: userId2,
        name: 'Артур',
        secondName: 'Костиков',
        patronymic: 'Павлович',
        role: 'doctor',
        username: 'doctor2',
        password: 'doctor2'
      },
      {
        id: userId3,
        name: 'Юлия',
        secondName: 'Баландина',
        patronymic: 'Сергеевна',
        role: 'doctor',
        username: 'doctor3',
        password: 'doctor3'
      },
      {
        id: userId4,
        name: 'Фаина',
        secondName: 'Горкер',
        patronymic: 'Львовна',
        role: 'doctor',
        username: 'doctor4',
        password: 'doctor4'
      },
      {
        id: userId5,
        name: 'Татьяна',
        secondName: 'Галкина',
        patronymic: 'Валерьевна',
        role: 'doctor',
        username: 'doctor5',
        password: 'doctor5'
      },
      {
        id: userId6,
        name: 'Наталия',
        secondName: 'Боброва',
        patronymic: 'Алексеевна',
        role: 'doctor',
        username: 'doctor6',
        password: 'doctor6'
      },
      {
        id: userId7,
        name: 'Екатерина',
        secondName: 'Абраменкова',
        patronymic: 'Михайловна',
        role: 'doctor',
        username: 'doctor7',
        password: 'doctor7'
      },
      {
        id: userId8,
        name: 'Ольга',
        secondName: 'Ананьева',
        patronymic: 'Сергеевна',
        role: 'doctor',
        username: 'doctord8',
        password: 'doctord8'
      },
      {
        id: userId9,
        name: 'Олеся',
        secondName: 'Андреева',
        patronymic: 'Александровна',
        role: 'doctor',
        username: 'doctord9',
        password: 'doctord9'
      },
      {
        id: userId10,
        name: 'Алексей',
        secondName: 'Расходчиков',
        patronymic: 'Викторович',
        role: 'doctor',
        username: 'doctor10',
        password: 'doctor10'
      },
      {
        id: userId11,
        name: 'Елена',
        secondName: 'Михалкина',
        patronymic: 'Александровна',
        role: 'doctor',
        username: 'doctor11',
        password: 'doctor11'
      },
      {
        id: userId12,
        name: 'Юлия',
        secondName: 'Артемьева',
        patronymic: 'Александровна',
        role: 'doctor',
        username: 'doctor12',
        password: 'doctor12'
      },
      {
        id: userId13,
        name: 'Ирина',
        secondName: 'Горюнова',
        patronymic: 'Вячеславовна',
        role: 'doctor',
        username: 'doctor13',
        password: 'doctor13'
      },
      {
        id: userId14,
        name: 'Борис',
        secondName: 'Надейкин',
        patronymic: 'Анатольевич',
        role: 'doctor',
        username: 'doctor14',
        password: 'doctor14'
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
    let departmentId1 = uuidv4();
    let departmentId2 = uuidv4();
    let departmentId3 = uuidv4();
    let departmentId4 = uuidv4();
    await models.department.bulkCreate([
      {
        id: departmentId1,
        organizationId: organizationId1,
        title: 'Амбулатория воп (5-й виноградный пр-д, 22)',
        address: 'г Пенза, Кронштадтская ул, д. 12',
        phone: '(8412) 98-22-66, контакт-центр (8412) 999-130'
      },
      {
        id: departmentId2,
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
        id: departmentId3,
        organizationId: organizationId2,
        title: 'Отделение № 10',
        address: 'г Пенза, Луначарского ул, д. 40',
        phone: '(8412) 46-97-39'
      },
      {
        id: departmentId4,
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

    log.trace('SEQUELIZE', { message: 'Add doctors...', isShort: true });
    let doctorId1 = uuidv4();
    let doctorId2 = uuidv4();
    let doctorId3 = uuidv4();
    let doctorId4 = uuidv4();
    let doctorId5 = uuidv4();
    let doctorId6 = uuidv4();
    let doctorId7 = uuidv4();
    let doctorId8 = uuidv4();
    let doctorId9 = uuidv4();
    let doctorId10 = uuidv4();
    let doctorId11 = uuidv4();
    let doctorId12 = uuidv4();
    let doctorId13 = uuidv4();
    let doctorId14 = uuidv4();
    await models.doctor.bulkCreate([
      {
        id: doctorId1,
        userId: userId1,
        organizationId: organizationId1,
        departmentId: departmentId1,
        specialty: 'Аллерголог',
        category: 'higher',
        position: 'Врач-аллерголог-иммунолог'
      },
      {
        id: doctorId2,
        userId: userId2,
        organizationId: organizationId1,
        departmentId: departmentId1,
        specialty: 'Аллерголог',
        category: 'first',
        position: 'Врач-аллерголог-иммунолог'
      },
      {
        id: doctorId3,
        userId: userId3,
        organizationId: organizationId1,
        departmentId: departmentId1,
        specialty: 'Гастроэнтеролог',
        category: 'higher',
        position: 'Врач-гастроэнтеролог'
      },
      {
        id: doctorId4,
        userId: userId4,
        organizationId: organizationId1,
        departmentId: departmentId1,
        specialty: 'Гастроэнтеролог',
        category: 'second',
        position: 'Врач-гастроэнтеролог'
      },
      {
        id: doctorId5,
        userId: userId5,
        organizationId: organizationId1,
        departmentId: departmentId2,
        specialty: 'Дерматолог',
        category: 'first',
        position: 'Врач-дерматовенеролог'
      },
      {
        id: doctorId6,
        userId: userId6,
        organizationId: organizationId1,
        departmentId: departmentId2,
        specialty: 'Инфекционист',
        category: 'higher',
        position: 'Врач-инфекционист'
      },
      {
        id: doctorId7,
        userId: userId7,
        organizationId: organizationId1,
        departmentId: departmentId2,
        specialty: 'Кардиолог',
        category: 'second',
        position: 'Врач-кардиолог'
      },
      {
        id: doctorId8,
        userId: userId8,
        organizationId: organizationId2,
        departmentId: departmentId3,
        specialty: 'Детский стоматолог',
        category: 'second',
        position: 'Врач-стоматолог'
      },
      {
        id: doctorId9,
        userId: userId9,
        organizationId: organizationId2,
        departmentId: departmentId3,
        specialty: 'Детский стоматолог',
        category: 'first',
        position: 'Врач-стоматолог'
      },
      {
        id: doctorId10,
        userId: userId10,
        organizationId: organizationId2,
        departmentId: departmentId3,
        specialty: 'Ортодонт',
        category: 'higher',
        position: 'Врач-ортодонт'
      },
      {
        id: doctorId11,
        userId: userId11,
        organizationId: organizationId2,
        departmentId: departmentId4,
        specialty: 'Ортодонт',
        category: 'first',
        position: 'Врач-ортодонт'
      },
      {
        id: doctorId12,
        userId: userId12,
        organizationId: organizationId2,
        departmentId: departmentId4,
        specialty: 'Стоматологии общей практики',
        category: 'higher',
        position: 'Врач-стоматолог'
      },
      {
        id: doctorId13,
        userId: userId13,
        organizationId: organizationId2,
        departmentId: departmentId4,
        specialty: 'Стоматолог',
        category: 'second',
        position: 'Врач-стоматолог'
      },
      {
        id: doctorId14,
        userId: userId14,
        organizationId: organizationId2,
        departmentId: departmentId4,
        specialty: 'Стоматолог хирург',
        category: 'higher',
        position: 'Врач-стоматолог-хирург'
      }
    ]);

    log.trace('SEQUELIZE', { message: 'Add events...', isShort: true });
    let date = new Date();
    for (let i = 0; i < 2; i ++) {
      addFreeWeekToDoctor(doctorId1, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId2, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId3, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId4, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId5, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId6, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId7, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId8, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId9, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId10, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId11, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId12, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId13, new Date(date.toString()));
      addFreeWeekToDoctor(doctorId14, new Date(date.toString()));
      date = dateAndTime.addDays(date, 7);
    }
  } catch(err) {
    log.critical('REINIT DATABASE', errorToObject(err));
  }
}

main();