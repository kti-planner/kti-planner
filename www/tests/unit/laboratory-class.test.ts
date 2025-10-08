import { expect, test } from 'vitest';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';

test('Laboratory classes', async () => {
    expect(await LaboratoryClass.fetchAll()).toStrictEqual([]);
    expect(await LaboratoryClass.fetch(crypto.randomUUID())).toStrictEqual(null);

    const semester1 = await Semester.create({
        year: 2024,
        type: 'winter',
        startDate: new Date('2024-10-01T00:00:00'),
        endDate: new Date('2025-01-30T00:00:00'),
    });

    const semester2 = await Semester.create({
        year: 2024,
        type: 'summer',
        startDate: new Date('2025-02-24T00:00:00'),
        endDate: new Date('2025-06-15T00:00:00'),
    });

    const user1 = await User.create({
        name: 'Jan Kowalski',
        email: 'jan@kowalski.pl',
        password: null,
        role: 'teacher',
    });

    const user2 = await User.create({
        name: 'Bogdan Nowak',
        email: 'bogdan@nowak.pl',
        password: null,
        role: 'teacher',
    });

    const classroom1 = await Classroom.create({
        name: 'EA 142',
    });

    const classroom2 = await Classroom.create({
        name: 'EA 204',
    });

    const subject1 = await Subject.create({
        name: 'Sieci komputerowe - Informatyka sem. V',
        semester: semester1,
        teachers: [user1],
        description: '',
    });

    const subject2 = await Subject.create({
        name: 'Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI',
        semester: semester2,
        teachers: [user1, user2],
        description: '',
    });

    const exercise1 = await Exercise.create({
        name: 'Diagnostyka sieci IP',
        subject: subject1,
        exerciseNumber: 1,
        classroom: classroom1,
        teacher: user1,
    });

    const exercise2 = await Exercise.create({
        name: 'Firewall',
        subject: subject2,
        exerciseNumber: 2,
        classroom: classroom2,
        teacher: user2,
    });

    const laboratoryGroup1 = await LaboratoryGroup.create({
        name: '1A',
        subject: subject1,
    });

    const laboratoryGroup2 = await LaboratoryGroup.create({
        name: '2B',
        subject: subject2,
    });

    const laboratoryClass1 = await LaboratoryClass.create({
        exercise: exercise1,
        laboratoryGroup: laboratoryGroup1,
        startDate: new Date('2024-10-23T11:00:00'),
        endDate: new Date('2024-10-23T13:00:00'),
        teacher: user1,
    });

    expect(laboratoryClass1).toHaveProperty('exerciseId', exercise1.id);
    expect(laboratoryClass1).toHaveProperty('laboratoryGroupId', laboratoryGroup1.id);
    expect(laboratoryClass1).toHaveProperty('startDate', new Date('2024-10-23T11:00:00'));
    expect(laboratoryClass1).toHaveProperty('endDate', new Date('2024-10-23T13:00:00'));
    expect(laboratoryClass1).toHaveProperty('teacherId', user1.id);

    expect(await LaboratoryClass.fetch(laboratoryClass1.id)).toStrictEqual(laboratoryClass1);
    expect(await LaboratoryClass.fetchAll()).toStrictEqual([laboratoryClass1]);
    expect(await LaboratoryClass.fetchAllFromSubject(subject1)).toStrictEqual([laboratoryClass1]);

    const laboratoryClass2 = await LaboratoryClass.create({
        exercise: exercise2,
        laboratoryGroup: laboratoryGroup2,
        startDate: new Date('2025-03-11T13:00:00'),
        endDate: new Date('2025-03-11T15:00:00'),
        teacher: user1,
    });

    expect(laboratoryClass2).toHaveProperty('exerciseId', exercise2.id);
    expect(laboratoryClass2).toHaveProperty('laboratoryGroupId', laboratoryGroup2.id);
    expect(laboratoryClass2).toHaveProperty('startDate', new Date('2025-03-11T13:00:00'));
    expect(laboratoryClass2).toHaveProperty('endDate', new Date('2025-03-11T15:00:00'));
    expect(laboratoryClass2).toHaveProperty('teacherId', user1.id);

    expect(await LaboratoryClass.fetch(laboratoryClass2.id)).toStrictEqual(laboratoryClass2);
    expect(await LaboratoryClass.fetch(laboratoryClass1.id)).toStrictEqual(laboratoryClass1);

    expect(await LaboratoryClass.fetchAll()).toStrictEqual([laboratoryClass1, laboratoryClass2]);

    expect(await LaboratoryClass.fetchAllFromSubject(subject1)).toStrictEqual([laboratoryClass1]);
    expect(await LaboratoryClass.fetchAllFromSubject(subject2)).toStrictEqual([laboratoryClass2]);

    expect(await LaboratoryClass.fetchAllFromSubjects([subject1])).toStrictEqual([laboratoryClass1]);
    expect(await LaboratoryClass.fetchAllFromSubjects([subject2])).toStrictEqual([laboratoryClass2]);

    expect(await LaboratoryClass.fetchAllFromSubjects([subject1, subject2])).toStrictEqual([
        laboratoryClass1,
        laboratoryClass2,
    ]);

    await laboratoryClass2.edit({
        startDate: new Date('2025-03-12T09:00:00'),
        endDate: new Date('2025-03-12T11:00:00'),
        teacher: user2,
    });

    expect(laboratoryClass2).toHaveProperty('exerciseId', exercise2.id);
    expect(laboratoryClass2).toHaveProperty('laboratoryGroupId', laboratoryGroup2.id);
    expect(laboratoryClass2).toHaveProperty('startDate', new Date('2025-03-12T09:00:00'));
    expect(laboratoryClass2).toHaveProperty('endDate', new Date('2025-03-12T11:00:00'));
    expect(laboratoryClass2).toHaveProperty('teacherId', user2.id);

    expect(laboratoryClass1).toHaveProperty('exerciseId', exercise1.id);
    expect(laboratoryClass1).toHaveProperty('laboratoryGroupId', laboratoryGroup1.id);
    expect(laboratoryClass1).toHaveProperty('startDate', new Date('2024-10-23T11:00:00'));
    expect(laboratoryClass1).toHaveProperty('endDate', new Date('2024-10-23T13:00:00'));
    expect(laboratoryClass1).toHaveProperty('teacherId', user1.id);

    const laboratoryClass3 = await LaboratoryClass.create({
        exercise: exercise1,
        laboratoryGroup: laboratoryGroup1,
        startDate: new Date('2024-10-30T11:00:00'),
        endDate: new Date('2024-10-30T13:00:00'),
        teacher: user1,
    });

    expect(await LaboratoryClass.fetch(laboratoryClass2.id)).toStrictEqual(laboratoryClass2);
    expect(await LaboratoryClass.fetch(laboratoryClass1.id)).toStrictEqual(laboratoryClass1);

    expect(await LaboratoryClass.fetchAll()).toStrictEqual([laboratoryClass1, laboratoryClass3, laboratoryClass2]);

    expect(await LaboratoryClass.fetchAllFromSubject(subject1)).toStrictEqual([laboratoryClass1, laboratoryClass3]);
    expect(await LaboratoryClass.fetchAllFromSubject(subject2)).toStrictEqual([laboratoryClass2]);

    expect(await LaboratoryClass.fetchAllFromSubjects([subject1])).toStrictEqual([laboratoryClass1, laboratoryClass3]);
    expect(await LaboratoryClass.fetchAllFromSubjects([subject2])).toStrictEqual([laboratoryClass2]);

    expect(await LaboratoryClass.fetchAllFromSubjects([subject1, subject2])).toStrictEqual([
        laboratoryClass1,
        laboratoryClass3,
        laboratoryClass2,
    ]);
});
