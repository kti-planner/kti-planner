import { expect, test } from 'vitest';
import { Exercise } from '@backend/exercise';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';

test('Exercises', async () => {
    expect(await Exercise.fetchAll()).toStrictEqual([]);
    expect(await Exercise.fetch(crypto.randomUUID())).toStrictEqual(null);

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

    const subject1 = await Subject.create({
        name: 'Sieci komputerowe',
        semester: semester1,
    });

    const subject2 = await Subject.create({
        name: 'Zarządzanie bezpieczeństwem sieci',
        semester: semester2,
    });

    const exercise1 = await Exercise.create({
        name: 'Diagnostyka sieci IP',
        subject: subject1,
        exerciseNumber: 1,
    });

    expect(exercise1).toHaveProperty('name', 'Diagnostyka sieci IP');
    expect(exercise1).toHaveProperty('subjectId', subject1.id);
    expect(exercise1).toHaveProperty('exerciseNumber', 1);

    expect(await Exercise.fetch(exercise1.id)).toStrictEqual(exercise1);
    expect(await Exercise.fetchAll()).toStrictEqual([exercise1]);
    expect(await Exercise.fetchAllFromSubject(subject1)).toStrictEqual([exercise1]);
    expect(await Exercise.fetchByNumber(subject1, 1)).toStrictEqual(exercise1);
    expect(await Exercise.fetchByNumber(subject1, 2)).toStrictEqual(null);

    const exercise2 = await Exercise.create({
        name: 'Firewall',
        subject: subject2,
        exerciseNumber: 2,
    });

    expect(exercise2).toHaveProperty('name', 'Firewall');
    expect(exercise2).toHaveProperty('subjectId', subject2.id);
    expect(exercise2).toHaveProperty('exerciseNumber', 2);

    expect(await Exercise.fetch(exercise2.id)).toStrictEqual(exercise2);
    expect(await Exercise.fetch(exercise1.id)).toStrictEqual(exercise1);
    expect(await Exercise.fetchAll()).toStrictEqual(
        [exercise1, exercise2].toSorted((a, b) => a.subjectId.localeCompare(b.subjectId)),
    );
    expect(await Exercise.fetchAllFromSubject(subject1)).toStrictEqual([exercise1]);
    expect(await Exercise.fetchAllFromSubject(subject2)).toStrictEqual([exercise2]);
    expect(await Exercise.fetchByNumber(subject1, 1)).toStrictEqual(exercise1);
    expect(await Exercise.fetchByNumber(subject1, 2)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject2, 1)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject2, 2)).toStrictEqual(exercise2);

    await exercise2.edit({
        name: 'IPv6',
        subject: subject1,
        exerciseNumber: 4,
    });

    expect(exercise2).toHaveProperty('name', 'IPv6');
    expect(exercise2).toHaveProperty('subjectId', subject1.id);
    expect(exercise2).toHaveProperty('exerciseNumber', 4);

    expect(exercise1).toHaveProperty('name', 'Diagnostyka sieci IP');
    expect(exercise1).toHaveProperty('subjectId', subject1.id);
    expect(exercise1).toHaveProperty('exerciseNumber', 1);

    expect(await Exercise.fetch(exercise2.id)).toStrictEqual(exercise2);
    expect(await Exercise.fetch(exercise1.id)).toStrictEqual(exercise1);
    expect(await Exercise.fetchAll()).toStrictEqual([exercise1, exercise2]);
    expect(await Exercise.fetchAllFromSubject(subject1)).toStrictEqual([exercise1, exercise2]);
    expect(await Exercise.fetchAllFromSubject(subject2)).toStrictEqual([]);
    expect(await Exercise.fetchByNumber(subject1, 1)).toStrictEqual(exercise1);
    expect(await Exercise.fetchByNumber(subject1, 2)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject1, 4)).toStrictEqual(exercise2);
    expect(await Exercise.fetchByNumber(subject2, 1)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject2, 2)).toStrictEqual(null);
});
