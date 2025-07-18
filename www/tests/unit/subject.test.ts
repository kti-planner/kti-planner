import { expect, test } from 'vitest';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';

test('Subjects', async () => {
    expect(await Subject.fetchAll()).toStrictEqual([]);
    expect(await Subject.fetch(crypto.randomUUID())).toStrictEqual(null);

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

    expect(subject1).toHaveProperty('name', 'Sieci komputerowe');
    expect(subject1).toHaveProperty('semesterId', semester1.id);
    expect(subject1).toHaveProperty('slug', 'sieci-komputerowe');

    expect(await Subject.fetch(subject1.id)).toStrictEqual(subject1);
    expect(await Subject.fetchAll()).toStrictEqual([subject1]);
    expect(await Subject.fetchAllFromSemester(semester1)).toStrictEqual([subject1]);
    expect(await Subject.fetchBySlug(semester1, 'sieci-komputerowe')).toStrictEqual(subject1);
    expect(await Subject.fetchBySlug(semester1, 'zarządzanie-bezpieczeństwem-sieci')).toStrictEqual(null);
    expect(await Subject.fetchBySlug(semester2, 'sieci-komputerowe')).toStrictEqual(null);

    const subject2 = await Subject.create({
        name: 'Zarządzanie bezpieczeństwem sieci',
        semester: semester2,
    });

    expect(subject2).toHaveProperty('name', 'Zarządzanie bezpieczeństwem sieci');
    expect(subject2).toHaveProperty('semesterId', semester2.id);
    expect(subject2).toHaveProperty('slug', 'zarządzanie-bezpieczeństwem-sieci');

    expect(await Subject.fetch(subject2.id)).toStrictEqual(subject2);
    expect(await Subject.fetch(subject1.id)).toStrictEqual(subject1);
    expect(await Subject.fetchAll()).toStrictEqual([subject1, subject2]);
    expect(await Subject.fetchAllFromSemester(semester1)).toStrictEqual([subject1]);
    expect(await Subject.fetchAllFromSemester(semester2)).toStrictEqual([subject2]);
    expect(await Subject.fetchBySlug(semester1, 'sieci-komputerowe')).toStrictEqual(subject1);
    expect(await Subject.fetchBySlug(semester1, 'zarządzanie-bezpieczeństwem-sieci')).toStrictEqual(null);
    expect(await Subject.fetchBySlug(semester2, 'sieci-komputerowe')).toStrictEqual(null);
    expect(await Subject.fetchBySlug(semester2, 'zarządzanie-bezpieczeństwem-sieci')).toStrictEqual(subject2);

    await subject2.edit({
        name: 'Lokalne sieci bezprzewodowe',
        semester: semester1,
    });

    expect(subject2).toHaveProperty('name', 'Lokalne sieci bezprzewodowe');
    expect(subject2).toHaveProperty('semesterId', semester1.id);
    expect(subject2).toHaveProperty('slug', 'lokalne-sieci-bezprzewodowe');

    expect(subject1).toHaveProperty('name', 'Sieci komputerowe');
    expect(subject1).toHaveProperty('semesterId', semester1.id);
    expect(subject1).toHaveProperty('slug', 'sieci-komputerowe');

    expect(await Subject.fetch(subject2.id)).toStrictEqual(subject2);
    expect(await Subject.fetch(subject1.id)).toStrictEqual(subject1);
    expect(await Subject.fetchAll()).toStrictEqual([subject2, subject1]);
    expect(await Subject.fetchAllFromSemester(semester1)).toStrictEqual([subject2, subject1]);
    expect(await Subject.fetchAllFromSemester(semester2)).toStrictEqual([]);
    expect(await Subject.fetchBySlug(semester1, '')).toStrictEqual(null);
    expect(await Subject.fetchBySlug(semester1, 'sieci-komputerowe')).toStrictEqual(subject1);
    expect(await Subject.fetchBySlug(semester1, 'zarządzanie-bezpieczeństwem-sieci')).toStrictEqual(null);
    expect(await Subject.fetchBySlug(semester1, 'lokalne-sieci-bezprzewodowe')).toStrictEqual(subject2);
    expect(await Subject.fetchBySlug(semester2, 'sieci-komputerowe')).toStrictEqual(null);
    expect(await Subject.fetchBySlug(semester2, 'lokalne-sieci-bezprzewodowe')).toStrictEqual(null);
});
