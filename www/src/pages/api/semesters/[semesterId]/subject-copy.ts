import type { APIRoute } from 'astro';
import { Classroom } from '@backend/classroom';
import { Exercise, type ExerciseCreateData } from '@backend/exercise';
import { LaboratoryGroup, type LaboratoryGroupCreateData } from '@backend/laboratory-group';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { subjectCopyFromPreviousSemesterApiSchema } from '@components/subjects/types';

export const POST: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const currentSemester = await Semester.fetch(params.semesterId ?? '');

    if (!currentSemester) {
        return Response.json(null, { status: 404 });
    }

    const data = subjectCopyFromPreviousSemesterApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const semesterToCopyFrom = await Semester.fetch(data.semesterId);

    if (!semesterToCopyFrom) {
        return Response.json(null, { status: 404 });
    }

    const subjectToBeCopied = await Subject.fetch(data.subjectId);

    if (!subjectToBeCopied) {
        return Response.json(null, { status: 404 });
    }

    const existingSubject = await Subject.fetchBySlug(currentSemester, subjectToBeCopied.slug);

    if (existingSubject) {
        return Response.json(false, { status: 200 });
    }

    const newSubject = await Subject.create({
        namePl: subjectToBeCopied.namePl,
        nameEn: subjectToBeCopied.nameEn,
        semester: currentSemester,
        teachers: await subjectToBeCopied.getTeachers(),
        description: subjectToBeCopied.description,
        moodleCourseId: '', // Course id is not copied
        durationMinutes: subjectToBeCopied.durationMinutes,
        classRepeatWeeks: subjectToBeCopied.classRepeatWeeks,
        studyMode: subjectToBeCopied.studyMode,
        studyCycle: subjectToBeCopied.studyCycle,
        semesterNumber: subjectToBeCopied.semesterNumber,
        color: subjectToBeCopied.color,
    });

    // Copy exercises
    const exercisesToBeCopied = await Exercise.fetchAllFromSubject(subjectToBeCopied);
    const exercisesCreateData: ExerciseCreateData[] = [];
    for (const exercise of exercisesToBeCopied) {
        const classroom = exercise.classroomId === null ? null : await Classroom.fetch(exercise.classroomId);
        const teacher = await exercise.getTeacher();

        exercisesCreateData.push({
            name: exercise.name,
            exerciseNumber: exercise.exerciseNumber,
            subject: newSubject,
            classroom: classroom,
            teacher: teacher,
        });
    }

    await Promise.all(exercisesCreateData.map(createData => Exercise.create(createData)));

    // Copy laboratory groups
    const laboratoryGroupsToBeCopied = await LaboratoryGroup.fetchAllFromSubject(subjectToBeCopied);
    const laboratoryGroupCreateData: LaboratoryGroupCreateData[] = [];
    for (const group of laboratoryGroupsToBeCopied) {
        laboratoryGroupCreateData.push({
            name: group.name,
            subject: newSubject,
        });
    }

    await Promise.all(laboratoryGroupCreateData.map(createData => LaboratoryGroup.create(createData)));

    return Response.json(true, { status: 201 });
};
