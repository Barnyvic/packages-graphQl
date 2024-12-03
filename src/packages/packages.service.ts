import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Package } from './schema/package.schema';
import { CreatePackageInput } from './dto/create-package.dto';
import { UpdatePackageInput } from './dto/update-package.input';
import { SearchPackageArgs } from './dto/search-package.args';
import { PaginationArgs } from './dto/pagination.args';

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<Package>,
  ) {}

  async create(createPackageInput: CreatePackageInput): Promise<Package> {
    const createdPackage = new this.packageModel(createPackageInput);
    return createdPackage.save();
  }

  async findAll(paginationArgs?: PaginationArgs): Promise<Package[]> {
    return this.packageModel
      .find()
      .sort({ name: 1 })
      .skip(paginationArgs?.skip || 0)
      .limit(paginationArgs?.take || 10)
      .exec();
  }

  async findOne(id: string): Promise<Package> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid package ID format');
    }

    const pkg = await this.packageModel.findById(new Types.ObjectId(id)).exec();
    if (!pkg) throw new NotFoundException(`Package with ID ${id} not found`);
    return pkg;
  }

  async findByExpirationDate(
    expirationDate: Date,
    paginationArgs?: PaginationArgs,
  ): Promise<Package[]> {
    const startOfDay = new Date(expirationDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(expirationDate);
    endOfDay.setHours(23, 59, 59, 999);

    return this.packageModel
      .find({
        expirationDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .skip(paginationArgs?.skip || 0)
      .limit(paginationArgs?.take || 10)
      .exec();
  }

  async update(updatePackageInput: UpdatePackageInput): Promise<Package> {
    const { id, ...updateData } = updatePackageInput;

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid package ID format');
    }

    const updatedPackage = await this.packageModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateData, {
        new: true,
      })
      .exec();
    if (!updatedPackage)
      throw new NotFoundException(`Package with ID ${id} not found`);
    return updatedPackage;
  }

  async remove(id: string): Promise<Package> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid package ID format');
    }

    const deletedPackage = await this.packageModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    if (!deletedPackage)
      throw new NotFoundException(`Package with ID ${id} not found`);
    return deletedPackage;
  }

  async search(searchArgs: SearchPackageArgs): Promise<Package[]> {
    const { searchTerm, fields = ['name', 'description'] } = searchArgs;

    if (!searchTerm) {
      return this.findAll();
    }

    const searchQuery = {
      $or: fields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    };

    return this.packageModel.find(searchQuery).sort({ name: 1 }).exec();
  }

  async findByPriceRange(min: number, max: number): Promise<Package[]> {
    return this.packageModel
      .find({
        price: { $gte: min, $lte: max },
      })
      .sort({ price: 1 })
      .exec();
  }
}
