import { expect, test } from 'vitest';
import { Classroom } from '@backend/classroom';

test('Classrooms', async () => {
    expect(await Classroom.fetchAll()).toStrictEqual([]);
    expect(await Classroom.fetch(crypto.randomUUID())).toStrictEqual(null);

    const classroom1 = await Classroom.create({
        name: 'EA 142',
    });

    expect(classroom1).toHaveProperty('name', 'EA 142');

    expect(await Classroom.fetch(classroom1.id)).toStrictEqual(classroom1);
    expect(await Classroom.fetchAll()).toStrictEqual([classroom1]);

    const classroom2 = await Classroom.create({
        name: 'EA 204',
    });

    expect(classroom2).toHaveProperty('name', 'EA 204');

    expect(await Classroom.fetch(classroom2.id)).toStrictEqual(classroom2);
    expect(await Classroom.fetch(classroom1.id)).toStrictEqual(classroom1);
    expect(await Classroom.fetchAll()).toStrictEqual([classroom1, classroom2]);

    await classroom2.edit({
        name: 'EA 205',
    });

    expect(classroom2).toHaveProperty('name', 'EA 205');

    expect(classroom1).toHaveProperty('name', 'EA 142');

    expect(await Classroom.fetch(classroom2.id)).toStrictEqual(classroom2);
    expect(await Classroom.fetch(classroom1.id)).toStrictEqual(classroom1);
    expect(await Classroom.fetchAll()).toStrictEqual([classroom1, classroom2]);

    await classroom1.delete();

    expect(await Classroom.fetch(classroom2.id)).toStrictEqual(classroom2);
    expect(await Classroom.fetch(classroom1.id)).toStrictEqual(null);
    expect(await Classroom.fetchAll()).toStrictEqual([classroom2]);

    await classroom2.delete();

    expect(await Classroom.fetch(classroom2.id)).toStrictEqual(null);
    expect(await Classroom.fetch(classroom1.id)).toStrictEqual(null);
    expect(await Classroom.fetchAll()).toStrictEqual([]);
});
