import { Category as CategoryDto } from '../dto/category.dto';
import { Category } from '@/components/exhibition/entities/category.entity';

export default class CategoryConverter {
    toDto(entity: Category) {
        const dto = {
            id: entity.id,
            name: entity.name ?? undefined,
        } as CategoryDto;

        return dto;
    }
}
