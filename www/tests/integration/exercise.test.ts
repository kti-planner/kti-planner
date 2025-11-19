import { expect, test } from 'vitest';
import { Classroom } from '@backend/classroom';
import { Exercise, makeExerciseData } from '@backend/exercise';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';

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
        name: 'Sieci komputerowe - Informatyka',
        semester: semester1,
        teachers: [user1],
        description: '',
        moodleCourseId: '',
        durationMinutes: 105,
        classRepeatWeeks: 1,
        studyMode: 'full-time',
        studyCycle: 'first-cycle',
        semesterNumber: 5,
        color: '#3F8366',
    });

    const subject2 = await Subject.create({
        name: 'Zarządzanie bezpieczeństwem sieci - Informatyka',
        semester: semester2,
        teachers: [user1, user2],
        description: '',
        moodleCourseId: '',
        durationMinutes: 165,
        classRepeatWeeks: 2,
        studyMode: 'full-time',
        studyCycle: 'first-cycle',
        semesterNumber: 6,
        color: '#A5674F',
    });

    const exercise1 = await Exercise.create({
        name: 'Diagnostyka sieci IP',
        subject: subject1,
        exerciseNumber: 1,
        classroom: classroom1,
        teacher: user1,
    });

    expect(exercise1).toHaveProperty('name', 'Diagnostyka sieci IP');
    expect(exercise1).toHaveProperty('subjectId', subject1.id);
    expect(exercise1).toHaveProperty('exerciseNumber', 1);
    expect(exercise1).toHaveProperty('classroomId', classroom1.id);
    expect(exercise1).toHaveProperty('teacherId', user1.id);
    expect(await exercise1.getTeacher()).toStrictEqual(user1);

    const exerciseData1 = makeExerciseData(exercise1, classroom1, user1);

    expect(exerciseData1).toStrictEqual({
        classroom: {
            id: classroom1.id,
            name: 'EA 142',
        },
        exerciseNumber: 1,
        id: exercise1.id,
        name: 'Diagnostyka sieci IP',
        subjectId: subject1.id,
        teacher: {
            id: user1.id,
            name: 'Jan Kowalski',
            role: 'teacher',
        },
    });

    expect(await Exercise.fetch(exercise1.id)).toStrictEqual(exercise1);
    expect(await Exercise.fetchAll()).toStrictEqual([exercise1]);
    expect(await Exercise.fetchAllFromSubject(subject1)).toStrictEqual([exercise1]);
    expect(await Exercise.fetchByNumber(subject1, 1)).toStrictEqual(exercise1);
    expect(await Exercise.fetchByNumber(subject1, 2)).toStrictEqual(null);

    const exercise2 = await Exercise.create({
        name: 'Firewall',
        subject: subject2,
        exerciseNumber: 2,
        classroom: classroom2,
        teacher: null,
    });

    expect(exercise2).toHaveProperty('name', 'Firewall');
    expect(exercise2).toHaveProperty('subjectId', subject2.id);
    expect(exercise2).toHaveProperty('exerciseNumber', 2);
    expect(exercise2).toHaveProperty('classroomId', classroom2.id);
    expect(exercise2).toHaveProperty('teacherId', null);
    expect(await exercise2.getTeacher()).toStrictEqual(null);

    expect(await Exercise.fetch(exercise2.id)).toStrictEqual(exercise2);
    expect(await Exercise.fetch(exercise1.id)).toStrictEqual(exercise1);

    expect(await Exercise.fetchAll()).toStrictEqual(
        [exercise1, exercise2].toSorted((a, b) => a.subjectId.localeCompare(b.subjectId)),
    );

    expect(await Exercise.fetchAllFromSubject(subject1)).toStrictEqual([exercise1]);
    expect(await Exercise.fetchAllFromSubject(subject2)).toStrictEqual([exercise2]);

    expect(await Exercise.fetchAllFromSubjects([subject1])).toStrictEqual([exercise1]);
    expect(await Exercise.fetchAllFromSubjects([subject2])).toStrictEqual([exercise2]);

    expect(await Exercise.fetchAllFromSubjects([subject1, subject2])).toStrictEqual(
        [exercise1, exercise2].toSorted((a, b) => a.subjectId.localeCompare(b.subjectId)),
    );

    expect(await Exercise.fetchByNumber(subject1, 1)).toStrictEqual(exercise1);
    expect(await Exercise.fetchByNumber(subject1, 2)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject2, 1)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject2, 2)).toStrictEqual(exercise2);

    await exercise2.edit({
        name: 'IPv6',
        exerciseNumber: 4,
        classroom: classroom1,
        teacher: user2,
    });

    expect(exercise2).toHaveProperty('name', 'IPv6');
    expect(exercise2).toHaveProperty('subjectId', subject2.id);
    expect(exercise2).toHaveProperty('exerciseNumber', 4);
    expect(exercise2).toHaveProperty('classroomId', classroom1.id);
    expect(exercise2).toHaveProperty('teacherId', user2.id);
    expect(await exercise2.getTeacher()).toStrictEqual(user2);

    expect(exercise1).toHaveProperty('name', 'Diagnostyka sieci IP');
    expect(exercise1).toHaveProperty('subjectId', subject1.id);
    expect(exercise1).toHaveProperty('exerciseNumber', 1);
    expect(exercise1).toHaveProperty('classroomId', classroom1.id);
    expect(exercise1).toHaveProperty('teacherId', user1.id);
    expect(await exercise1.getTeacher()).toStrictEqual(user1);

    const exercise3 = await Exercise.create({
        name: 'Firewall',
        subject: subject1,
        exerciseNumber: 2,
        classroom: null,
        teacher: user1,
    });

    await exercise3.edit({
        classroom: null,
        teacher: null,
    });

    expect(exercise3).toHaveProperty('classroomId', null);
    expect(exercise3).toHaveProperty('teacherId', null);

    const exerciseData3 = makeExerciseData(exercise3, null, null);

    expect(exerciseData3).toStrictEqual({
        classroom: null,
        exerciseNumber: 2,
        id: exercise3.id,
        name: 'Firewall',
        subjectId: subject1.id,
        teacher: null,
    });

    expect(await Exercise.fetch(exercise2.id)).toStrictEqual(exercise2);
    expect(await Exercise.fetch(exercise1.id)).toStrictEqual(exercise1);

    expect(await Exercise.fetchAll()).toStrictEqual(
        [exercise1, exercise2, exercise3].toSorted((a, b) => a.subjectId.localeCompare(b.subjectId)),
    );

    expect(await Exercise.fetchAllFromSubject(subject1)).toStrictEqual([exercise1, exercise3]);
    expect(await Exercise.fetchAllFromSubject(subject2)).toStrictEqual([exercise2]);

    expect(await Exercise.fetchAllFromSubjects([subject1])).toStrictEqual([exercise1, exercise3]);
    expect(await Exercise.fetchAllFromSubjects([subject2])).toStrictEqual([exercise2]);

    expect(await Exercise.fetchAllFromSubjects([subject1, subject2])).toStrictEqual(
        [exercise1, exercise3, exercise2].toSorted((a, b) => a.subjectId.localeCompare(b.subjectId)),
    );

    expect(await Exercise.fetchByNumber(subject1, 1)).toStrictEqual(exercise1);
    expect(await Exercise.fetchByNumber(subject1, 2)).toStrictEqual(exercise3);
    expect(await Exercise.fetchByNumber(subject1, 4)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject2, 1)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject2, 2)).toStrictEqual(null);
    expect(await Exercise.fetchByNumber(subject2, 4)).toStrictEqual(exercise2);

    await exercise2.delete();

    expect(await Exercise.fetch(exercise1.id)).toStrictEqual(exercise1);
    expect(await Exercise.fetch(exercise2.id)).toStrictEqual(null);

    expect(await Exercise.fetchAll()).toStrictEqual([exercise1, exercise3]);

    await subject1.delete();

    expect(await Exercise.fetchAll()).toStrictEqual([]);
    expect(await Subject.fetchAll()).toStrictEqual([subject2]);
});
