import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass, makeLaboratoryClassData } from '@backend/laboratory-class';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';

export const GET: APIRoute = async ({ params }) => {
    const { semesterSlug } = params;

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const subjects = await Subject.fetchAllFromSemester(semester);
    const classes = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const groups = await LaboratoryGroup.fetchAllFromSubjects(subjects);
    const users = await User.fetchAll();
    const classrooms = await Classroom.fetchAll();
    const exercises = await Exercise.fetchAllFromSubjects(subjects);

    return Response.json(
        classes.map<LaboratoryClassData>(laboratoryClass => {
            const exercise = exercises.find(e => e.id === laboratoryClass.exerciseId);
            assert(exercise);

            const group = groups.find(g => g.id === laboratoryClass.laboratoryGroupId);
            assert(group);

            const classTeacher = users.find(u => u.id === laboratoryClass.teacherId);
            assert(classTeacher);

            const exerciseClassroom = classrooms.find(c => c.id === exercise.classroomId);
            assert(exerciseClassroom);

            const exerciseTeacher = users.find(u => u.id === exercise.teacherId);
            assert(exerciseTeacher);

            return makeLaboratoryClassData(
                laboratoryClass,
                exercise,
                exerciseClassroom,
                exerciseTeacher,
                group,
                classTeacher,
            );
        }) satisfies LaboratoryClassData[],
        { status: 200 },
    );
};
