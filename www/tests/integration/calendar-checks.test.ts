import { expect, test } from 'vitest';
import { checkForEventConflicts } from '@backend/calendar-checks';
import { CalendarEvent } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { type ScheduleChange, Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';

test('Detects event conflicts', async () => {
    const semester = await Semester.create({
        year: 2025,
        type: 'winter',
        startDate: new Date('2025-10-01T00:00:00'),
        endDate: new Date('2026-01-30T00:00:00'),
    });

    const changes: ScheduleChange[] = [
        { date: new Date('2025-10-31T00:00:00'), type: 'holiday' },
        { date: new Date('2025-11-07T00:00:00'), type: 'holiday' },
        { date: new Date('2025-11-11T00:00:00'), type: 'holiday' },
        { date: new Date('2025-12-20T00:00:00'), type: 'holiday' },
    ];

    await semester.setScheduleChanges(changes);

    const user = await User.create({
        name: 'Jan Kowalski',
        email: 'jan@kowalski.pl',
        password: null,
        role: 'teacher',
    });

    const subject = await Subject.create({
        name: 'Sieci komputerowe - Informatyka',
        semester: semester,
        teachers: [user],
        description: 'Opis',
        moodleCourseId: '1472',
        durationMinutes: 105,
        classRepeatWeeks: 1,
        studyMode: 'full-time',
        studyCycle: 'first-cycle',
        semesterNumber: 5,
        color: '#3F8366',
    });

    const classroom1 = await Classroom.create({
        name: 'EA 142',
    });

    const classroom2 = await Classroom.create({
        name: 'EA 204',
    });

    const exercise1 = await Exercise.create({
        name: 'Diagnostyka sieci IP',
        subject: subject,
        exerciseNumber: 1,
        classroom: classroom1,
        teacher: user,
    });

    const exercise2 = await Exercise.create({
        name: 'Diagnostyka sieci IPv6',
        subject: subject,
        exerciseNumber: 2,
        classroom: classroom1,
        teacher: user,
    });

    const laboratoryGroup = await LaboratoryGroup.create({
        name: '1A',
        subject,
    });

    const laboratoryClass1 = await LaboratoryClass.create({
        exercise: exercise1,
        laboratoryGroup,
        startDate: new Date('2025-10-23T09:15'),
        endDate: new Date('2025-10-23T11:00'),
        teacher: user,
    });

    const calendarEvent1 = await CalendarEvent.create({
        name: 'event1',
        semester: semester,
        classroom: classroom1,
        user: user,
        startDate: new Date('2025-11-05T11:15'),
        endDate: new Date('2025-11-05T13:00'),
        type: 'class-reservation',
        color: '#198754',
    });

    expect(
        checkForEventConflicts(
            [
                {
                    id: null,
                    classroomId: classroom1.id,
                    startDate: new Date('2025-10-31T13:15'),
                    endDate: new Date('2025-10-31T15:00'),
                },
            ],
            semester,
            changes,
            [laboratoryClass1],
            [exercise1, exercise2],
            [calendarEvent1],
        ),
    ).toStrictEqual([
        {
            type: 'holiday',
            startDate: '2025-10-31T13:15',
            endDate: '2025-10-31T15:00',
        },
    ]);

    expect(
        checkForEventConflicts(
            [
                {
                    id: null,
                    classroomId: classroom1.id,
                    startDate: new Date('2025-10-23T09:15'),
                    endDate: new Date('2025-10-23T11:00'),
                },
                {
                    id: null,
                    classroomId: classroom1.id,
                    startDate: new Date('2025-11-05T11:15'),
                    endDate: new Date('2025-11-05T13:00'),
                },
            ],
            semester,
            changes,
            [laboratoryClass1],
            [exercise1, exercise2],
            [calendarEvent1],
        ),
    ).toStrictEqual([
        {
            type: 'other-event',
            startDate: '2025-10-23T09:15',
            endDate: '2025-10-23T11:00',
        },
        {
            type: 'other-event',
            startDate: '2025-11-05T11:15',
            endDate: '2025-11-05T13:00',
        },
    ]);

    expect(
        checkForEventConflicts(
            [
                {
                    id: null,
                    classroomId: classroom2.id,
                    startDate: new Date('2025-10-23T09:15'),
                    endDate: new Date('2025-10-23T11:00'),
                },
                {
                    id: null,
                    classroomId: classroom2.id,
                    startDate: new Date('2025-11-05T11:15'),
                    endDate: new Date('2025-11-05T13:00'),
                },
            ],
            semester,
            changes,
            [laboratoryClass1],
            [exercise1, exercise2],
            [calendarEvent1],
        ),
    ).toStrictEqual([]);

    expect(
        checkForEventConflicts(
            [
                {
                    id: null,
                    classroomId: null,
                    startDate: new Date('2025-10-23T09:15'),
                    endDate: new Date('2025-10-23T11:00'),
                },
                {
                    id: null,
                    classroomId: classroom1.id,
                    startDate: new Date('2025-11-05T11:15'),
                    endDate: new Date('2025-11-05T13:00'),
                },
            ],
            semester,
            changes,
            [laboratoryClass1],
            [exercise1, exercise2],
            [calendarEvent1],
        ),
    ).toStrictEqual([
        {
            type: 'other-event',
            startDate: '2025-11-05T11:15',
            endDate: '2025-11-05T13:00',
        },
    ]);

    expect(
        checkForEventConflicts(
            [
                {
                    id: laboratoryClass1.id,
                    classroomId: classroom1.id,
                    startDate: new Date('2025-10-23T09:15'),
                    endDate: new Date('2025-10-23T11:00'),
                },
                {
                    id: calendarEvent1.id,
                    classroomId: classroom1.id,
                    startDate: new Date('2025-11-05T11:15'),
                    endDate: new Date('2025-11-05T13:00'),
                },
            ],
            semester,
            changes,
            [laboratoryClass1],
            [exercise1, exercise2],
            [calendarEvent1],
        ),
    ).toStrictEqual([]);

    expect(
        checkForEventConflicts(
            [
                {
                    id: laboratoryClass1.id,
                    classroomId: classroom1.id,
                    startDate: new Date('2026-02-02T09:15'),
                    endDate: new Date('2026-02-02T11:00'),
                },
            ],
            semester,
            changes,
            [laboratoryClass1],
            [exercise1, exercise2],
            [calendarEvent1],
        ),
    ).toMatchInlineSnapshot(`
      [
        {
          "endDate": "2026-02-02T11:00",
          "startDate": "2026-02-02T09:15",
          "type": "outside-of-semester",
        },
      ]
    `);
});
