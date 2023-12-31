import { Category as CategoryDto } from '@/components/exhibition/dto/category.dto';
import { Category } from '@/components/exhibition/entities/category.entity';

export default class CategoryConverter {
    toDto(entity: Category) {
        const dto = {
            id: entity.id,
            name: entity.name,
        } as CategoryDto;

        return dto;
    }
}
