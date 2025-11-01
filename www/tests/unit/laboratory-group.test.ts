import { expect, test } from 'vitest';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';

test('Laboratory groups', async () => {
    expect(await LaboratoryGroup.fetchAll()).toStrictEqual([]);
    expect(await LaboratoryGroup.fetch(crypto.randomUUID())).toStrictEqual(null);

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
        description: '',
        moodleCourseId: '',
        duration: 105,
        classRepeat: 1,
    });

    const subject2 = await Subject.create({
        name: 'Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI',
        semester: semester2,
        teachers: [user1, user2],
        description: '',
        moodleCourseId: '',
        duration: 165,
        classRepeat: 2,
    });

    const laboratoryGroup1 = await LaboratoryGroup.create({
        name: '1A',
        subject: subject1,
    });

    expect(laboratoryGroup1).toHaveProperty('name', '1A');
    expect(laboratoryGroup1).toHaveProperty('subjectId', subject1.id);

    expect(await LaboratoryGroup.fetch(laboratoryGroup1.id)).toStrictEqual(laboratoryGroup1);
    expect(await LaboratoryGroup.fetchAll()).toStrictEqual([laboratoryGroup1]);
    expect(await LaboratoryGroup.fetchAllFromSubject(subject1)).toStrictEqual([laboratoryGroup1]);

    const laboratoryGroup2 = await LaboratoryGroup.create({
        name: '2B',
        subject: subject2,
    });

    expect(laboratoryGroup2).toHaveProperty('name', '2B');
    expect(laboratoryGroup2).toHaveProperty('subjectId', subject2.id);

    expect(await LaboratoryGroup.fetch(laboratoryGroup2.id)).toStrictEqual(laboratoryGroup2);
    expect(await LaboratoryGroup.fetch(laboratoryGroup1.id)).toStrictEqual(laboratoryGroup1);

    expect(await LaboratoryGroup.fetchAll()).toStrictEqual(
        [laboratoryGroup1, laboratoryGroup2].toSorted((a, b) => a.subjectId.localeCompare(b.subjectId)),
    );

    expect(await LaboratoryGroup.fetchAllFromSubject(subject1)).toStrictEqual([laboratoryGroup1]);
    expect(await LaboratoryGroup.fetchAllFromSubject(subject2)).toStrictEqual([laboratoryGroup2]);

    expect(await LaboratoryGroup.fetchAllFromSubjects([subject1])).toStrictEqual([laboratoryGroup1]);
    expect(await LaboratoryGroup.fetchAllFromSubjects([subject2])).toStrictEqual([laboratoryGroup2]);

    expect(await LaboratoryGroup.fetchAllFromSubjects([subject1, subject2])).toStrictEqual(
        [laboratoryGroup1, laboratoryGroup2].toSorted((a, b) => a.subjectId.localeCompare(b.subjectId)),
    );

    await laboratoryGroup2.edit({
        name: '3B',
    });

    expect(laboratoryGroup2).toHaveProperty('name', '3B');
    expect(laboratoryGroup2).toHaveProperty('subjectId', subject2.id);

    expect(laboratoryGroup1).toHaveProperty('name', '1A');
    expect(laboratoryGroup1).toHaveProperty('subjectId', subject1.id);

    const laboratoryGroup3 = await LaboratoryGroup.create({
        name: '2B',
        subject: subject1,
    });

    expect(await LaboratoryGroup.fetch(laboratoryGroup2.id)).toStrictEqual(laboratoryGroup2);
    expect(await LaboratoryGroup.fetch(laboratoryGroup1.id)).toStrictEqual(laboratoryGroup1);

    expect(await LaboratoryGroup.fetchAll()).toStrictEqual(
        [laboratoryGroup1, laboratoryGroup2, laboratoryGroup3].toSorted((a, b) =>
            a.subjectId.localeCompare(b.subjectId),
        ),
    );

    expect(await LaboratoryGroup.fetchAllFromSubject(subject1)).toStrictEqual([laboratoryGroup1, laboratoryGroup3]);
    expect(await LaboratoryGroup.fetchAllFromSubject(subject2)).toStrictEqual([laboratoryGroup2]);

    expect(await LaboratoryGroup.fetchAllFromSubjects([subject1])).toStrictEqual([laboratoryGroup1, laboratoryGroup3]);
    expect(await LaboratoryGroup.fetchAllFromSubjects([subject2])).toStrictEqual([laboratoryGroup2]);

    expect(await LaboratoryGroup.fetchAllFromSubjects([subject1, subject2])).toStrictEqual(
        [laboratoryGroup1, laboratoryGroup3, laboratoryGroup2].toSorted((a, b) =>
            a.subjectId.localeCompare(b.subjectId),
        ),
    );

    await laboratoryGroup1.delete();
    await laboratoryGroup2.delete();

    expect(await LaboratoryGroup.fetchAll()).toStrictEqual([laboratoryGroup3]);
});
