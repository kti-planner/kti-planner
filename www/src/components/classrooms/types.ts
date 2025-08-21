import z from 'zod';

export interface ClassroomData {
    id: string;
    name: string;
}

export const classroomCreateApiSchema = z.object({
    name: z.string().trim().nonempty(),
});

export type ClassroomCreateApiData = z.input<typeof classroomCreateApiSchema>;

export const classroomEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string().trim().nonempty().optional(),
});

export type ClassroomEditApiData = z.input<typeof classroomEditApiSchema>;
