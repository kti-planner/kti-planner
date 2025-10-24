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
    });

    expect(subject1).toHaveProperty('name', 'Sieci komputerowe - Informatyka sem. V');
    expect(subject1).toHaveProperty('semesterId', semester1.id);
    expect(subject1).toHaveProperty('slug', 'sieci-komputerowe---informatyka-sem.-v');
    expect(subject1).toHaveProperty('teacherIds', [user1.id]);
    expect(subject1).toHaveProperty('description', subject1.description);
    expect(subject1).toHaveProperty('moodleCourseId', subject1.moodleCourseId);

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

    const subject2 = await Subject.create({
        name: 'Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI',
        semester: semester2,
        teachers: [user1, user2],
        description: '',
        moodleCourseId: '',
    });

    expect(subject2).toHaveProperty('name', 'Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI');
    expect(subject2).toHaveProperty('semesterId', semester2.id);
    expect(subject2).toHaveProperty('slug', 'zarządzanie-bezpieczeństwem-sieci---informatyka-sem.-vi');
    expect(subject2).toHaveProperty('teacherIds', [user1.id, user2.id]);
    expect(subject2).toHaveProperty('description', subject2.description);
    expect(subject2).toHaveProperty('moodleCourseId', subject2.moodleCourseId);

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
    });

    expect(subject2).toHaveProperty('name', 'Lokalne sieci bezprzewodowe - Informatyka sem. VI');
    expect(subject2).toHaveProperty('semesterId', semester1.id);
    expect(subject2).toHaveProperty('slug', 'lokalne-sieci-bezprzewodowe---informatyka-sem.-vi');
    expect(subject2).toHaveProperty('teacherIds', [user2.id]);
    expect(subject2).toHaveProperty('description', subject2.description);
    expect(subject2).toHaveProperty('moodleCourseId', subject2.moodleCourseId);

    expect(await subject2.getTeachers()).toStrictEqual([user2]);

    expect(subject1).toHaveProperty('name', 'Sieci komputerowe - Informatyka sem. V');
    expect(subject1).toHaveProperty('semesterId', semester1.id);
    expect(subject1).toHaveProperty('slug', 'sieci-komputerowe---informatyka-sem.-v');
    expect(subject1).toHaveProperty('teacherIds', [user1.id]);
    expect(subject1).toHaveProperty('description', subject1.description);
    expect(subject1).toHaveProperty('moodleCourseId', subject1.moodleCourseId);

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
});
