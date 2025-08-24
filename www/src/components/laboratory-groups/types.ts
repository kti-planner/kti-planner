import z from 'zod';

export interface LaboratoryGroupData {
    id: string;
    name: string;
}

export const laboratoryGroupCreateApiSchema = z.object({
    name: z.string(),
});

export type LaboratoryGroupCreateApiData = z.input<typeof laboratoryGroupCreateApiSchema>;

export const laboratoryGroupEditApiSchema = z.object({
    id: z.uuid(),
    name: z.string(),
});

export type LaboratoryGroupEditApiData = z.input<typeof laboratoryGroupEditApiSchema>;
