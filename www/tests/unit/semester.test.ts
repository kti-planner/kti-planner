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
    expect(semester1).toHaveProperty('slug', '2024-winter');

    expect(await Semester.fetch(semester1.id)).toStrictEqual(semester1);
    expect(await Semester.fetchAll()).toStrictEqual([semester1]);
    expect(await Semester.fetchByYearAndType(2024, 'winter')).toStrictEqual(semester1);
    expect(await Semester.fetchByYearAndType(2024, 'summer')).toStrictEqual(null);
    expect(await Semester.fetchByYearAndType(2025, 'winter')).toStrictEqual(null);
    expect(await Semester.fetchBySlug('2024-winter')).toStrictEqual(semester1);
    expect(await Semester.fetchBySlug('2024-summer')).toStrictEqual(null);

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
    expect(semester2).toHaveProperty('slug', '2024-summer');

    expect(await Semester.fetch(semester2.id)).toStrictEqual(semester2);
    expect(await Semester.fetch(semester1.id)).toStrictEqual(semester1);
    expect(await Semester.fetchAll()).toStrictEqual([semester2, semester1]);
    expect(await Semester.fetchByYearAndType(2024, 'winter')).toStrictEqual(semester1);
    expect(await Semester.fetchByYearAndType(2024, 'summer')).toStrictEqual(semester2);
    expect(await Semester.fetchByYearAndType(2025, 'winter')).toStrictEqual(null);
    expect(await Semester.fetchBySlug('2024-winter')).toStrictEqual(semester1);
    expect(await Semester.fetchBySlug('2024-summer')).toStrictEqual(semester2);
    expect(await Semester.fetchBySlug('2025-winter')).toStrictEqual(null);
    expect(await Semester.fetchBySlug('2025-summer')).toStrictEqual(null);

    await semester2.edit({
        year: 2025,
        type: 'winter',
        startDate: new Date('2025-03-02T00:00:00'),
        endDate: new Date('2026-09-10T00:00:00'),
    });

    expect(semester2).toHaveProperty('year', 2025);
    expect(semester2).toHaveProperty('type', 'winter');
    expect(semester2).toHaveProperty('startDate', new Date('2025-03-02T00:00:00'));
    expect(semester2.startDate.getFullYear()).toBe(2025);
    expect(semester2.startDate.getMonth()).toBe(2);
    expect(semester2.startDate.getDate()).toBe(2);
    expect(semester2).toHaveProperty('endDate', new Date('2026-09-10T00:00:00'));
    expect(semester2.endDate.getFullYear()).toBe(2026);
    expect(semester2.endDate.getMonth()).toBe(8);
    expect(semester2.endDate.getDate()).toBe(10);
    expect(semester2).toHaveProperty('slug', '2025-winter');

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
    expect(semester1).toHaveProperty('slug', '2024-winter');

    expect(await Semester.fetch(semester2.id)).toStrictEqual(semester2);
    expect(await Semester.fetch(semester1.id)).toStrictEqual(semester1);
    expect(await Semester.fetchAll()).toStrictEqual([semester2, semester1]);
    expect(await Semester.fetchByYearAndType(2024, 'winter')).toStrictEqual(semester1);
    expect(await Semester.fetchByYearAndType(2024, 'summer')).toStrictEqual(null);
    expect(await Semester.fetchByYearAndType(2025, 'winter')).toStrictEqual(semester2);
    expect(await Semester.fetchBySlug('2024-winter')).toStrictEqual(semester1);
    expect(await Semester.fetchBySlug('2024-summer')).toStrictEqual(null);
    expect(await Semester.fetchBySlug('2025-winter')).toStrictEqual(semester2);
    expect(await Semester.fetchBySlug('2025-summer')).toStrictEqual(null);

    expect(await Semester.fetchByDate(new Date('2024-10-01T00:00:00'))).toStrictEqual(semester1);
    expect(await Semester.fetchByDate(new Date('2024-12-04T00:00:00'))).toStrictEqual(semester1);
    expect(await Semester.fetchByDate(new Date('2025-01-30T00:00:00'))).toStrictEqual(semester1);
    expect(await Semester.fetchByDate(new Date('2024-09-30T00:00:00'))).toStrictEqual(null);
    expect(await Semester.fetchByDate(new Date('2025-01-31T00:00:00'))).toStrictEqual(null);
    expect(await Semester.fetchByDate(new Date('2025-03-01T00:00:00'))).toStrictEqual(null);
    expect(await Semester.fetchByDate(new Date('2025-03-02T00:00:00'))).toStrictEqual(semester2);
    expect(await Semester.fetchByDate(new Date('2026-04-30T00:00:00'))).toStrictEqual(semester2);
    expect(await Semester.fetchByDate(new Date('2026-09-10T00:00:00'))).toStrictEqual(semester2);
    expect(await Semester.fetchByDate(new Date('2026-09-11T00:00:00'))).toStrictEqual(null);
});

test('Schedule changes', async () => {
    expect(await Semester.getAllScheduleChanges()).toStrictEqual([]);

    await Semester.setScheduleChange(new Date('2025-04-18T00:00:00'), 'holiday');
    await Semester.setScheduleChange(new Date('2025-04-19T00:00:00'), 'holiday');
    await Semester.setScheduleChange(new Date('2025-04-20T00:00:00'), 'holiday');
    await Semester.setScheduleChange(new Date('2025-01-08T00:00:00'), 'friday');
    await Semester.setScheduleChange(new Date('2024-11-12T00:00:00'), 'monday');

    expect(await Semester.getAllScheduleChanges()).toStrictEqual([
        { date: new Date('2024-11-12T00:00:00'), type: 'monday' },
        { date: new Date('2025-01-08T00:00:00'), type: 'friday' },
        { date: new Date('2025-04-18T00:00:00'), type: 'holiday' },
        { date: new Date('2025-04-19T00:00:00'), type: 'holiday' },
        { date: new Date('2025-04-20T00:00:00'), type: 'holiday' },
    ]);

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

    expect(await semester1.getScheduleChanges()).toStrictEqual([
        { date: new Date('2024-11-12T00:00:00'), type: 'monday' },
        { date: new Date('2025-01-08T00:00:00'), type: 'friday' },
    ]);

    expect(await semester2.getScheduleChanges()).toStrictEqual([
        { date: new Date('2025-04-18T00:00:00'), type: 'holiday' },
        { date: new Date('2025-04-19T00:00:00'), type: 'holiday' },
        { date: new Date('2025-04-20T00:00:00'), type: 'holiday' },
    ]);

    await Semester.setScheduleChange(new Date('2025-04-19T00:00:00'), 'monday');

    expect(await semester2.getScheduleChanges()).toStrictEqual([
        { date: new Date('2025-04-18T00:00:00'), type: 'holiday' },
        { date: new Date('2025-04-19T00:00:00'), type: 'monday' },
        { date: new Date('2025-04-20T00:00:00'), type: 'holiday' },
    ]);

    await Semester.setScheduleChange(new Date('2025-04-19T00:00:00'), null);

    expect(await semester2.getScheduleChanges()).toStrictEqual([
        { date: new Date('2025-04-18T00:00:00'), type: 'holiday' },
        { date: new Date('2025-04-20T00:00:00'), type: 'holiday' },
    ]);
});
