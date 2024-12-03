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

@Injectable()
export class PackagesService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<Package>,
  ) {}

  async create(createPackageInput: CreatePackageInput): Promise<Package> {
    const createdPackage = new this.packageModel(createPackageInput);
    return createdPackage.save();
  }

  async findAll(): Promise<Package[]> {
    return this.packageModel.find().exec();
  }

  async findOne(id: string): Promise<Package> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid package ID format');
    }

    const pkg = await this.packageModel.findById(new Types.ObjectId(id)).exec();
    if (!pkg) throw new NotFoundException(`Package with ID ${id} not found`);
    return pkg;
  }

  async findByExpirationDate(expirationDate: Date): Promise<Package[]> {
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
}
