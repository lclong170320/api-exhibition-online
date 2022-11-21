import { Exhibition } from './exhibition.dto';
export type UpdateExhibition = Omit<
    Exhibition,
    'status' | 'booth_organization_template_id' | 'category_id' | 'booth_number'
> &
    Partial<Pick<Exhibition, 'status'>>;
