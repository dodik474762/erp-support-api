import { Module } from '@nestjs/common';
import { VendorCategoryController } from './vendor_category.controller';
import { VendorCategoryService } from './vendor_category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorCategory } from 'src/repository/master/vendor_category.entity';

@Module({
  controllers: [VendorCategoryController],
  providers: [VendorCategoryService],
  imports: [
    TypeOrmModule.forFeature([VendorCategory]) // Add Entity here
  ]
})
export class VendorCategoryModule {}
