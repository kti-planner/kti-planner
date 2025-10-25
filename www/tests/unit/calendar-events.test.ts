import { expect, test } from 'vitest';
import { CalendarEvent, makeCalendarEventData } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Semester } from '@backend/semester';
import { User } from '@backend/user';

test('Calendar events', async () => {
    expect(await CalendarEvent.fetchAll()).toStrictEqual([]);
    expect(await CalendarEvent.fetch(crypto.randomUUID())).toStrictEqual(null);

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

    const calendarEvent1 = await CalendarEvent.create({
        name: 'event1',
        semester: semester1,
        classroom: classroom1,
        user: user1,
        startDate: new Date('2024-10-23T11:00:00'),
        endDate: new Date('2024-10-23T13:00:00'),
    });

    expect(calendarEvent1).toHaveProperty('name', calendarEvent1.name);
    expect(calendarEvent1).toHaveProperty('userId', user1.id);
    expect(calendarEvent1).toHaveProperty('classroomId', classroom1.id);
    expect(calendarEvent1).toHaveProperty('semesterId', semester1.id);
    expect(calendarEvent1).toHaveProperty('startDate', new Date('2024-10-23T11:00:00'));
    expect(calendarEvent1).toHaveProperty('endDate', new Date('2024-10-23T13:00:00'));

    const calendarEventData1 = makeCalendarEventData(calendarEvent1, user1, classroom1, semester1);

    expect(calendarEventData1).toStrictEqual({
        classroom: {
            id: classroom1.id,
            name: 'EA 142',
        },
        endDate: '2024-10-23T13:00',
        id: calendarEvent1.id,
        name: 'event1',
        semester: {
            endDate: '2025-01-30',
            id: semester1.id,
            slug: '2024-winter',
            startDate: '2024-10-01',
            type: 'winter',
            year: 2024,
        },
        startDate: '2024-10-23T11:00',
        user: {
            id: user1.id,
            name: 'Jan Kowalski',
            role: 'teacher',
        },
    });

    expect(await CalendarEvent.fetch(calendarEvent1.id)).toStrictEqual(calendarEvent1);
    expect(await CalendarEvent.fetchAll()).toStrictEqual([calendarEvent1]);
    expect(await CalendarEvent.fetchAllFromSemester(semester1)).toStrictEqual([calendarEvent1]);

    const calendarEvent2 = await CalendarEvent.create({
        name: 'event2',
        semester: semester2,
        classroom: classroom2,
        user: user2,
        startDate: new Date('2025-03-11T13:00:00'),
        endDate: new Date('2025-03-11T15:00:00'),
    });

    expect(calendarEvent2).toHaveProperty('name', calendarEvent2.name);
    expect(calendarEvent2).toHaveProperty('userId', user2.id);
    expect(calendarEvent2).toHaveProperty('classroomId', classroom2.id);
    expect(calendarEvent2).toHaveProperty('semesterId', semester2.id);
    expect(calendarEvent2).toHaveProperty('startDate', new Date('2025-03-11T13:00:00'));
    expect(calendarEvent2).toHaveProperty('endDate', new Date('2025-03-11T15:00:00'));

    expect(await CalendarEvent.fetch(calendarEvent2.id)).toStrictEqual(calendarEvent2);
    expect(await CalendarEvent.fetch(calendarEvent1.id)).toStrictEqual(calendarEvent1);

    expect(await CalendarEvent.fetchAll()).toStrictEqual([calendarEvent1, calendarEvent2]);

    expect(await CalendarEvent.fetchAllFromSemester(semester1)).toStrictEqual([calendarEvent1]);
    expect(await CalendarEvent.fetchAllFromSemester(semester2)).toStrictEqual([calendarEvent2]);

    await calendarEvent2.edit({
        startDate: new Date('2025-03-12T09:00:00'),
        endDate: new Date('2025-03-12T11:00:00'),
        classroom: classroom1,
        name: 'event2 v2',
    });

    expect(calendarEvent2).toHaveProperty('name', calendarEvent2.name);
    expect(calendarEvent2).toHaveProperty('userId', user2.id);
    expect(calendarEvent2).toHaveProperty('classroomId', classroom1.id);
    expect(calendarEvent2).toHaveProperty('semesterId', semester2.id);
    expect(calendarEvent2).toHaveProperty('startDate', new Date('2025-03-12T09:00:00'));
    expect(calendarEvent2).toHaveProperty('endDate', new Date('2025-03-12T11:00:00'));

    expect(calendarEvent1).toHaveProperty('name', calendarEvent1.name);
    expect(calendarEvent1).toHaveProperty('userId', user1.id);
    expect(calendarEvent1).toHaveProperty('classroomId', classroom1.id);
    expect(calendarEvent1).toHaveProperty('semesterId', semester1.id);
    expect(calendarEvent1).toHaveProperty('startDate', new Date('2024-10-23T11:00:00'));
    expect(calendarEvent1).toHaveProperty('endDate', new Date('2024-10-23T13:00:00'));

    const calendarEvent3 = await CalendarEvent.create({
        name: 'event3',
        semester: semester1,
        classroom: classroom2,
        user: user1,
        startDate: new Date('2024-10-30T11:00:00'),
        endDate: new Date('2024-10-30T13:00:00'),
    });

    expect(await CalendarEvent.fetch(calendarEvent1.id)).toStrictEqual(calendarEvent1);
    expect(await CalendarEvent.fetch(calendarEvent2.id)).toStrictEqual(calendarEvent2);
    expect(await CalendarEvent.fetch(calendarEvent3.id)).toStrictEqual(calendarEvent3);

    expect(await CalendarEvent.fetchAll()).toStrictEqual([calendarEvent1, calendarEvent3, calendarEvent2]);

    expect(await CalendarEvent.fetchAllFromSemester(semester1)).toStrictEqual([calendarEvent1, calendarEvent3]);
    expect(await CalendarEvent.fetchAllFromSemester(semester2)).toStrictEqual([calendarEvent2]);
});
