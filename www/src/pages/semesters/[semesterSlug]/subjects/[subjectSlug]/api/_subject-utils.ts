import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';

export async function getSubjectFromParams(params: Record<string, string | undefined>): Promise<Subject | null> {
    const { semesterSlug, subjectSlug } = params;

    if (semesterSlug === undefined || subjectSlug === undefined) {
        return null;
    }

    const semester = await Semester.fetchBySlug(semesterSlug);

    if (!semester) {
        return null;
    }

    return await Subject.fetchBySlug(semester, subjectSlug);
}
