import { expect, test } from 'vitest';
import { Semester } from '@backend/semester';
import { makeSubjectData, Subject } from '@backend/subject';
import { User } from '@backend/user';

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

    const subject1 = await Subject.create({
        name: 'Sieci komputerowe - Informatyka sem. V',
        semester: semester1,
        teachers: [user1],
        description: 'Opis',
        moodleCourseId: '1472',
        durationMinutes: 105,
        classRepeatWeeks: 1,
        studyMode: 'full-time',
        studyCycle: 'first-cycle',
        semesterNumber: 5,
    });

    expect(subject1).toHaveProperty('name', 'Sieci komputerowe - Informatyka sem. V');
    expect(subject1).toHaveProperty('semesterId', semester1.id);
    expect(subject1).toHaveProperty('slug', 'sieci-komputerowe---informatyka-sem.-v');
    expect(subject1).toHaveProperty('teacherIds', [user1.id]);
    expect(subject1).toHaveProperty('description', subject1.description);
    expect(subject1).toHaveProperty('moodleCourseId', subject1.moodleCourseId);
    expect(subject1).toHaveProperty('durationMinutes', subject1.durationMinutes);
    expect(subject1).toHaveProperty('classRepeatWeeks', subject1.classRepeatWeeks);
    expect(subject1).toHaveProperty('studyMode', subject1.studyMode);
    expect(subject1).toHaveProperty('studyCycle', subject1.studyCycle);
    expect(subject1).toHaveProperty('semesterNumber', subject1.semesterNumber);

    const subjectData1 = makeSubjectData(subject1, [user1]);

    expect(subjectData1).toStrictEqual({
        description: 'Opis',
        id: subject1.id,
        moodleCourseId: '1472',
        moodleCourseUrl: 'https://enauczanie.pg.edu.pl/2025/course/view.php?id=1472',
        name: 'Sieci komputerowe - Informatyka sem. V',
        semesterId: semester1.id,
        slug: 'sieci-komputerowe---informatyka-sem.-v',
        teachers: [
            {
                id: user1.id,
                name: 'Jan Kowalski',
                role: 'teacher',
            },
        ],
        durationMinutes: 105,
        classRepeatWeeks: 1,
        studyMode: 'full-time',
        studyCycle: 'first-cycle',
        semesterNumber: 5,
    });

    expect(await subject1.getTeachers()).toStrictEqual([user1]);

    expect(await Subject.fetch(subject1.id)).toStrictEqual(subject1);
    expect(await Subject.fetchAll()).toStrictEqual([subject1]);
    expect(await Subject.fetchAllFromSemester(semester1)).toStrictEqual([subject1]);
    expect(await Subject.fetchBySlug(semester1, 'sieci-komputerowe---informatyka-sem.-v')).toStrictEqual(subject1);

    expect(
        await Subject.fetchBySlug(semester1, 'zarządzanie-bezpieczeństwem-sieci---informatyka-sem.-vi'),
    ).toStrictEqual(null);

    expect(await Subject.fetchBySlug(semester2, 'sieci-komputerowe---informatyka-sem.-v')).toStrictEqual(null);

    await expect(
        Subject.create({
            name: 'Sieci komputerowe - Informatyka sem. V',
            semester: semester1,
            teachers: [user1],
            description: 'Opis',
            moodleCourseId: '1472',
            durationMinutes: 105,
            classRepeatWeeks: 1,
            studyMode: 'full-time',
            studyCycle: 'first-cycle',
            semesterNumber: 5,
        }),
    ).rejects.toThrow(Error);

    const subject2 = await Subject.create({
        name: 'Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI',
        semester: semester2,
        teachers: [user1, user2],
        description: '',
        moodleCourseId: '',
        durationMinutes: 165,
        classRepeatWeeks: 2,
        studyMode: 'full-time',
        studyCycle: 'first-cycle',
        semesterNumber: 6,
    });

    expect(subject2).toHaveProperty('name', 'Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI');
    expect(subject2).toHaveProperty('semesterId', semester2.id);
    expect(subject2).toHaveProperty('slug', 'zarządzanie-bezpieczeństwem-sieci---informatyka-sem.-vi');
    expect(subject2).toHaveProperty('teacherIds', [user1.id, user2.id]);
    expect(subject2).toHaveProperty('description', subject2.description);
    expect(subject2).toHaveProperty('moodleCourseId', subject2.moodleCourseId);
    expect(subject2).toHaveProperty('durationMinutes', subject2.durationMinutes);
    expect(subject2).toHaveProperty('classRepeatWeeks', subject2.classRepeatWeeks);
    expect(subject2).toHaveProperty('studyMode', subject2.studyMode);
    expect(subject2).toHaveProperty('studyCycle', subject2.studyCycle);
    expect(subject2).toHaveProperty('semesterNumber', subject2.semesterNumber);

    const subjectData2 = makeSubjectData(subject2, [user1, user2]);

    expect(subjectData2).toStrictEqual({
        description: '',
        id: subject2.id,
        moodleCourseId: '',
        moodleCourseUrl: '',
        name: 'Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI',
        semesterId: semester2.id,
        slug: 'zarządzanie-bezpieczeństwem-sieci---informatyka-sem.-vi',
        teachers: [
            {
                id: user1.id,
                name: 'Jan Kowalski',
                role: 'teacher',
            },
            {
                id: user2.id,
                name: 'Bogdan Nowak',
                role: 'teacher',
            },
        ],
        durationMinutes: 165,
        classRepeatWeeks: 2,
        studyMode: 'full-time',
        studyCycle: 'first-cycle',
        semesterNumber: 6,
    });

    expect(await subject2.getTeachers()).toStrictEqual([user1, user2]);

    expect(await Subject.fetch(subject2.id)).toStrictEqual(subject2);
    expect(await Subject.fetch(subject1.id)).toStrictEqual(subject1);
    expect(await Subject.fetchAll()).toStrictEqual([subject1, subject2]);
    expect(await Subject.fetchAllFromSemester(semester1)).toStrictEqual([subject1]);
    expect(await Subject.fetchAllFromSemester(semester2)).toStrictEqual([subject2]);
    expect(await Subject.fetchBySlug(semester1, 'sieci-komputerowe---informatyka-sem.-v')).toStrictEqual(subject1);

    expect(
        await Subject.fetchBySlug(semester1, 'zarządzanie-bezpieczeństwem-sieci---informatyka-sem.-vi'),
    ).toStrictEqual(null);

    expect(await Subject.fetchBySlug(semester2, 'sieci-komputerowe---informatyka-sem.-v')).toStrictEqual(null);

    expect(
        await Subject.fetchBySlug(semester2, 'zarządzanie-bezpieczeństwem-sieci---informatyka-sem.-vi'),
    ).toStrictEqual(subject2);

    await subject2.edit({
        name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI',
        semester: semester1,
        teachers: [user2],
        description: 'foo',
        moodleCourseId: '230',
        durationMinutes: 120,
        classRepeatWeeks: 1,
        studyMode: 'part-time',
        studyCycle: 'second-cycle',
        semesterNumber: 7,
    });

    expect(subject2).toHaveProperty('name', 'Lokalne sieci bezprzewodowe - Informatyka sem. VI');
    expect(subject2).toHaveProperty('semesterId', semester1.id);
    expect(subject2).toHaveProperty('slug', 'lokalne-sieci-bezprzewodowe---informatyka-sem.-vi');
    expect(subject2).toHaveProperty('teacherIds', [user2.id]);
    expect(subject2).toHaveProperty('description', subject2.description);
    expect(subject2).toHaveProperty('moodleCourseId', subject2.moodleCourseId);
    expect(subject2).toHaveProperty('durationMinutes', subject2.durationMinutes);
    expect(subject2).toHaveProperty('classRepeatWeeks', subject2.classRepeatWeeks);
    expect(subject2).toHaveProperty('studyMode', subject2.studyMode);
    expect(subject2).toHaveProperty('studyCycle', subject2.studyCycle);
    expect(subject2).toHaveProperty('semesterNumber', subject2.semesterNumber);

    expect(await subject2.getTeachers()).toStrictEqual([user2]);

    expect(subject1).toHaveProperty('name', 'Sieci komputerowe - Informatyka sem. V');
    expect(subject1).toHaveProperty('semesterId', semester1.id);
    expect(subject1).toHaveProperty('slug', 'sieci-komputerowe---informatyka-sem.-v');
    expect(subject1).toHaveProperty('teacherIds', [user1.id]);
    expect(subject1).toHaveProperty('description', subject1.description);
    expect(subject1).toHaveProperty('moodleCourseId', subject1.moodleCourseId);
    expect(subject1).toHaveProperty('durationMinutes', subject1.durationMinutes);
    expect(subject1).toHaveProperty('classRepeatWeeks', subject1.classRepeatWeeks);
    expect(subject1).toHaveProperty('studyMode', subject1.studyMode);
    expect(subject1).toHaveProperty('studyCycle', subject1.studyCycle);
    expect(subject1).toHaveProperty('semesterNumber', subject1.semesterNumber);

    expect(await subject1.getTeachers()).toStrictEqual([user1]);

    expect(await Subject.fetch(subject2.id)).toStrictEqual(subject2);
    expect(await Subject.fetch(subject1.id)).toStrictEqual(subject1);
    expect(await Subject.fetchAll()).toStrictEqual([subject2, subject1]);
    expect(await Subject.fetchAllFromSemester(semester1)).toStrictEqual([subject2, subject1]);
    expect(await Subject.fetchAllFromSemester(semester2)).toStrictEqual([]);
    expect(await Subject.fetchBySlug(semester1, '')).toStrictEqual(null);
    expect(await Subject.fetchBySlug(semester1, 'sieci-komputerowe---informatyka-sem.-v')).toStrictEqual(subject1);

    expect(
        await Subject.fetchBySlug(semester1, 'zarządzanie-bezpieczeństwem-sieci---informatyka-sem.-vi'),
    ).toStrictEqual(null);

    expect(await Subject.fetchBySlug(semester1, 'lokalne-sieci-bezprzewodowe---informatyka-sem.-vi')).toStrictEqual(
        subject2,
    );

    expect(await Subject.fetchBySlug(semester2, 'sieci-komputerowe---informatyka-sem.-v')).toStrictEqual(null);

    expect(await Subject.fetchBySlug(semester2, 'lokalne-sieci-bezprzewodowe---informatyka-sem.-vi')).toStrictEqual(
        null,
    );

    await subject2.delete();

    expect(await Subject.fetchAll()).toStrictEqual([subject1]);
});
