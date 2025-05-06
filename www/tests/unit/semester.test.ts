import { expect, test } from 'vitest';
import { Semester } from '@backend/semester';

test('Semesters', async () => {
    expect(await Semester.fetchAll()).toStrictEqual([]);
    expect(await Semester.fetch(crypto.randomUUID())).toStrictEqual(null);

    const semester1 = await Semester.create({
        year: 2024,
        type: 'winter',
        startDate: new Date('2024-10-01T00:00:00'),
        endDate: new Date('2025-01-30T00:00:00'),
    });

    expect(semester1).toHaveProperty('year', 2024);
    expect(semester1).toHaveProperty('type', 'winter');
    expect(semester1).toHaveProperty('startDate', new Date('2024-10-01T00:00:00'));
    expect(semester1.startDate.getFullYear()).toBe(2024);
    expect(semester1.startDate.getMonth()).toBe(9);
    expect(semester1.startDate.getDate()).toBe(1);
    expect(semester1).toHaveProperty('endDate', new Date('2025-01-30T00:00:00'));
    expect(semester1.endDate.getFullYear()).toBe(2025);
    expect(semester1.endDate.getMonth()).toBe(0);
    expect(semester1.endDate.getDate()).toBe(30);

    expect(await Semester.fetch(semester1.id)).toStrictEqual(semester1);
    expect(await Semester.fetchAll()).toStrictEqual([semester1]);
    expect(await Semester.fetchByYearAndType(2024, 'winter')).toStrictEqual(semester1);
    expect(await Semester.fetchByYearAndType(2024, 'summer')).toStrictEqual(null);
    expect(await Semester.fetchByYearAndType(2025, 'winter')).toStrictEqual(null);

    const semester2 = await Semester.create({
        year: 2024,
        type: 'summer',
        startDate: new Date('2025-02-24T00:00:00'),
        endDate: new Date('2025-06-15T00:00:00'),
    });

    expect(semester2).toHaveProperty('year', 2024);
    expect(semester2).toHaveProperty('type', 'summer');
    expect(semester2).toHaveProperty('startDate', new Date('2025-02-24T00:00:00'));
    expect(semester2.startDate.getFullYear()).toBe(2025);
    expect(semester2.startDate.getMonth()).toBe(1);
    expect(semester2.startDate.getDate()).toBe(24);
    expect(semester2).toHaveProperty('endDate', new Date('2025-06-15T00:00:00'));
    expect(semester2.endDate.getFullYear()).toBe(2025);
    expect(semester2.endDate.getMonth()).toBe(5);
    expect(semester2.endDate.getDate()).toBe(15);

    expect(await Semester.fetch(semester2.id)).toStrictEqual(semester2);
    expect(await Semester.fetch(semester1.id)).toStrictEqual(semester1);
    expect(await Semester.fetchAll()).toStrictEqual([semester1, semester2]);
    expect(await Semester.fetchByYearAndType(2024, 'winter')).toStrictEqual(semester1);
    expect(await Semester.fetchByYearAndType(2024, 'summer')).toStrictEqual(semester2);
    expect(await Semester.fetchByYearAndType(2025, 'winter')).toStrictEqual(null);

    await semester2.edit({
        year: 2025,
        type: 'winter',
        startDate: new Date('2025-01-02T00:00:00'),
        endDate: new Date('2026-03-04T00:00:00'),
    });

    expect(semester2).toHaveProperty('year', 2025);
    expect(semester2).toHaveProperty('type', 'winter');
    expect(semester2).toHaveProperty('startDate', new Date('2025-01-02T00:00:00'));
    expect(semester2.startDate.getFullYear()).toBe(2025);
    expect(semester2.startDate.getMonth()).toBe(0);
    expect(semester2.startDate.getDate()).toBe(2);
    expect(semester2).toHaveProperty('endDate', new Date('2026-03-04T00:00:00'));
    expect(semester2.endDate.getFullYear()).toBe(2026);
    expect(semester2.endDate.getMonth()).toBe(2);
    expect(semester2.endDate.getDate()).toBe(4);

    expect(semester1).toHaveProperty('year', 2024);
    expect(semester1).toHaveProperty('type', 'winter');
    expect(semester1).toHaveProperty('startDate', new Date('2024-10-01T00:00:00'));
    expect(semester1.startDate.getFullYear()).toBe(2024);
    expect(semester1.startDate.getMonth()).toBe(9);
    expect(semester1.startDate.getDate()).toBe(1);
    expect(semester1).toHaveProperty('endDate', new Date('2025-01-30T00:00:00'));
    expect(semester1.endDate.getFullYear()).toBe(2025);
    expect(semester1.endDate.getMonth()).toBe(0);
    expect(semester1.endDate.getDate()).toBe(30);

    expect(await Semester.fetch(semester2.id)).toStrictEqual(semester2);
    expect(await Semester.fetch(semester1.id)).toStrictEqual(semester1);
    expect(await Semester.fetchAll()).toStrictEqual([semester1, semester2]);
    expect(await Semester.fetchByYearAndType(2024, 'winter')).toStrictEqual(semester1);
    expect(await Semester.fetchByYearAndType(2024, 'summer')).toStrictEqual(null);
    expect(await Semester.fetchByYearAndType(2025, 'winter')).toStrictEqual(semester2);
});
