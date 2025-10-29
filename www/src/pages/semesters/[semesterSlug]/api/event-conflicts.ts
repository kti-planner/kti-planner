import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { CalendarEvent } from '@backend/calendar-events';
import { Classroom, makeClassroomData } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { type EventConflictData, eventConflictsApiSchema } from '@components/calendar/types';
import { formatDateLocalYyyyMmDdHhMm } from '@components/utils';

export const POST: APIRoute = async ({ params, locals }) => {
    const { jsonData, user } = locals;
    const { semesterSlug } = params;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const data = eventConflictsApiSchema.nullable().catch(null).parse(jsonData);
    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const subjects = await Subject.fetchAllFromSemester(semester);
    const classes = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const exercises = await Exercise.fetchAllFromSubjects(subjects);
    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);
    const classrooms = await Classroom.fetchAll();

    const conflictingClasses = classes.filter(laboratoryClass => {
        const exercise = exercises.find(e => e.id === laboratoryClass.exerciseId);
        assert(exercise);

        return data.some(
            slot =>
                slot.classroomId === exercise.classroomId &&
                slot.start.getTime() < laboratoryClass.endDate.getTime() &&
                slot.end.getTime() > laboratoryClass.startDate.getTime(),
        );
    });

    const classConflictsData = conflictingClasses.map<EventConflictData>(laboratoryClass => {
        const exercise = exercises.find(e => e.id === laboratoryClass.exerciseId);
        assert(exercise);

        const classroom = classrooms.find(c => c.id === exercise.classroomId) ?? null;

        return {
            classroom: classroom ? makeClassroomData(classroom) : null,
            startDate: formatDateLocalYyyyMmDdHhMm(laboratoryClass.startDate),
            endDate: formatDateLocalYyyyMmDdHhMm(laboratoryClass.endDate),
        };
    });

    const conflictingCalendarEvents = calendarEvents.filter(event =>
        data.some(
            slot =>
                slot.classroomId === event.classroomId &&
                slot.start.getTime() < event.endDate.getTime() &&
                slot.end.getTime() > event.startDate.getTime(),
        ),
    );

    const calendarEventsConflictData = conflictingCalendarEvents.map<EventConflictData>(event => {
        const classroom = classrooms.find(c => c.id === event.classroomId) ?? null;

        return {
            classroom: classroom ? makeClassroomData(classroom) : null,
            startDate: formatDateLocalYyyyMmDdHhMm(event.startDate),
            endDate: formatDateLocalYyyyMmDdHhMm(event.endDate),
        };
    });

    return Response.json([...classConflictsData, ...calendarEventsConflictData] satisfies EventConflictData[]);
};
