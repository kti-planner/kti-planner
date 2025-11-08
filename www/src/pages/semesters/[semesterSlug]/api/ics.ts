import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { createEvents, type EventAttributes } from 'ics';
import { CalendarEvent } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { isLangId } from '@backend/lang';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';

const translations = {
    'en': {
        'Group': 'Group',
        'Teacher': 'Teacher',
        'Classroom': 'Classroom',
    },
    'pl': {
        'Group': 'Grupa',
        'Teacher': 'Prowadzący',
        'Classroom': 'Sala',
    },
};

// Calendar applications use WebCal HTTP methods like PROPFIND or standard methods like GET
export const ALL: APIRoute = async ({ params, url, request }) => {
    if (request.method !== 'GET') {
        return new Response(null, { status: 405, headers: { Allow: 'GET' } });
    }

    const { semesterSlug } = params;

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const langId = url.searchParams.get('lang');
    if (langId === null) {
        return new Response(null, { status: 400 });
    }

    if (!isLangId(langId)) {
        return new Response(null, { status: 400 });
    }

    const subjectFilter = url.searchParams.getAll('subject');
    const classroomFilter = url.searchParams.getAll('classroom');
    const teacherFilter = url.searchParams.getAll('teacher');
    const groupFilter = url.searchParams.getAll('laboratoryGroup');
    const exportCalendarEvents = url.searchParams.get('exportCalendarEvents');

    const subjects = await Subject.fetchAllFromSemester(semester);
    const groups = await LaboratoryGroup.fetchAllFromSubjects(subjects);
    const users = await User.fetchAll();
    const classrooms = await Classroom.fetchAll();
    const exercises = await Exercise.fetchAllFromSubjects(subjects);

    const classes = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const calendarEvents = exportCalendarEvents !== null ? await CalendarEvent.fetchAllFromSemester(semester) : [];

    const laboratoryClassEvents: EventAttributes[] = classes
        .map<EventAttributes | null>(laboratoryClass => {
            const exercise = exercises.find(e => e.id === laboratoryClass.exerciseId);
            assert(exercise);

            const group = groups.find(g => g.id === laboratoryClass.laboratoryGroupId);
            assert(group);

            const classTeacher = users.find(u => u.id === laboratoryClass.teacherId) ?? null;
            const exerciseClassroom = classrooms.find(c => c.id === exercise.classroomId) ?? null;

            const subject = subjects.find(s => s.id === exercise.subjectId);
            assert(subject);

            if (subjectFilter.length > 0 && !subjectFilter.includes(exercise.subjectId)) {
                return null;
            }

            if (groupFilter.length > 0 && !groupFilter.includes(group.id)) {
                return null;
            }

            if (classroomFilter.length > 0 && !classroomFilter.includes(String(exercise.classroomId))) {
                return null;
            }

            if (
                teacherFilter.length > 0 &&
                (laboratoryClass.teacherId === null || !teacherFilter.includes(laboratoryClass.teacherId))
            ) {
                return null;
            }

            let description = '';

            if (exerciseClassroom) {
                description += `${translations[langId]['Classroom']}: ${exerciseClassroom.name}`;
            }

            if (description !== '') {
                description += '\n';
            }

            description += `${translations[langId]['Group']}: ${group.name}`;

            if (classTeacher) {
                description += `\n${translations[langId]['Teacher']}: ${classTeacher.name}`;
            }

            return {
                uid: laboratoryClass.id,
                title: `${subject.name} - ${exercise.name}`,
                description,
                ...(exerciseClassroom ? { location: exerciseClassroom.name } : {}),
                start: laboratoryClass.startDate.getTime(),
                end: laboratoryClass.endDate.getTime(),
            };
        })
        .filter(data => data !== null);

    const calendarEventIcsEvents: EventAttributes[] = calendarEvents
        .map<EventAttributes | null>(calendarEvent => {
            const user = users.find(u => u.id === calendarEvent.userId) ?? null;
            const classroom = classrooms.find(c => c.id === calendarEvent.classroomId) ?? null;

            if (
                teacherFilter.length > 0 &&
                (calendarEvent.userId === null || !teacherFilter.includes(calendarEvent.userId))
            ) {
                return null;
            }

            if (classroomFilter.length > 0 && !classroomFilter.includes(String(calendarEvent.classroomId))) {
                return null;
            }

            let description = '';

            if (classroom) {
                description += `${translations[langId]['Classroom']}: ${classroom.name}`;
            }

            if (user) {
                if (description !== '') {
                    description += '\n';
                }

                description += `${translations[langId]['Teacher']}: ${user.name}`;
            }

            return {
                uid: calendarEvent.id,
                title: calendarEvent.name,
                description,
                ...(classroom ? { location: classroom.name } : {}),
                start: calendarEvent.startDate.getTime(),
                end: calendarEvent.endDate.getTime(),
            };
        })
        .filter(data => data !== null);

    const { error: icsError, value: icsString } = createEvents([...laboratoryClassEvents, ...calendarEventIcsEvents], {
        calName: 'KTI Planner',
        productId: '-//KTI Planner//KTI Planner 0.1//PL',
    });

    if (icsError || icsString === undefined) {
        throw icsError ?? Error();
    }

    return new Response(icsString, { headers: { 'Content-Type': 'text/calendar' } });
};
