import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { createEvents, type EventAttributes } from 'ics';
import { CalendarEvent } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';

// Calendar applications use WebCal HTTP methods like PROPFIND or standar methods like GET
export const ALL: APIRoute = async ({ params, url }) => {
    const { semesterSlug } = params;

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const subjectFilter = url.searchParams.getAll('subject');
    const classroomFilter = url.searchParams.getAll('classroom');
    const teacherFilter = url.searchParams.getAll('teacher');

    const subjects = await Subject.fetchAllFromSemester(semester);
    const groups = await LaboratoryGroup.fetchAllFromSubjects(subjects);
    const users = await User.fetchAll();
    const classrooms = await Classroom.fetchAll();
    const exercises = await Exercise.fetchAllFromSubjects(subjects);

    const classes = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);

    const laboratoryClassEvents: EventAttributes[] = classes
        .map<EventAttributes | null>(laboratoryClass => {
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

            const subject = subjects.find(s => s.id === exercise.subjectId);
            assert(subject);

            if (subjectFilter.length > 0 && !subjectFilter.includes(exercise.subjectId)) {
                return null;
            }

            if (classroomFilter.length > 0 && !classroomFilter.includes(exercise.classroomId)) {
                return null;
            }

            if (teacherFilter.length > 0 && !teacherFilter.includes(laboratoryClass.teacherId)) {
                return null;
            }

            return {
                uid: laboratoryClass.id,
                title: `${subject.name} - ${exercise.name}`,
                description: `Grupa: ${group.name}\nProwadzący: ${classTeacher.name}\nSala: ${exerciseClassroom.name}`,
                location: exerciseClassroom.name,
                organizer: { name: classTeacher.name },
                attendees: [{ name: group.name }],
                categories: ['Laboratory Class'],
                calName: 'KTI Planner',
                start: laboratoryClass.startDate.getTime(),
                end: laboratoryClass.endDate.getTime(),
            };
        })
        .filter(data => data !== null);

    const calendarEventIcsEvents: EventAttributes[] = calendarEvents
        .map<EventAttributes | null>(calendarEvent => {
            const user = users.find(u => u.id === calendarEvent.userId);
            assert(user);

            const classroom = classrooms.find(c => c.id === calendarEvent.classroomId);
            assert(classroom);

            if (teacherFilter.length > 0 && !teacherFilter.includes(calendarEvent.userId)) {
                return null;
            }

            if (classroomFilter.length > 0 && !classroomFilter.includes(calendarEvent.classroomId)) {
                return null;
            }

            return {
                uid: calendarEvent.id,
                title: calendarEvent.name,
                description: `Prowadzący: ${user.name}\nSala: ${classroom.name}`,
                location: classroom.name,
                organizer: { name: user.name },
                categories: ['Other Event'],
                calName: 'KTI Planner',
                start: calendarEvent.startDate.getTime(),
                end: calendarEvent.endDate.getTime(),
            };
        })
        .filter(data => data !== null);

    const { error: icsError, value: icsString } = createEvents([...laboratoryClassEvents, ...calendarEventIcsEvents], {
        calName: 'KTI Planner',
    });

    if (icsError || icsString === undefined) {
        throw icsError ?? Error();
    }

    return new Response(icsString, { headers: { 'Content-Type': 'text/calendar' } });
};
