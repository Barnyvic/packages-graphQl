import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
    const pkg = await this.packageModel.findById(id).exec();
    if (!pkg) throw new NotFoundException(`Package with ID ${id} not found`);
    return pkg;
  }

  async findByExpirationDate(expirationDate: Date): Promise<Package[]> {
    return this.packageModel.find({ expirationDate }).exec();
  }

  async update(updatePackageInput: UpdatePackageInput): Promise<Package> {
    const updatedPackage = await this.packageModel
      .findByIdAndUpdate(updatePackageInput.id, updatePackageInput, {
        new: true,
      })
      .exec();
    if (!updatedPackage)
      throw new NotFoundException(
        `Package with ID ${updatePackageInput.id} not found`,
      );
    return updatedPackage;
  }

  async remove(id: string): Promise<Package> {
    const deletedPackage = await this.packageModel.findByIdAndDelete(id).exec();
    if (!deletedPackage)
      throw new NotFoundException(`Package with ID ${id} not found`);
    return deletedPackage;
  }
}
