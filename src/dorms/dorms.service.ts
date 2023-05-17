import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { In, Repository } from 'typeorm';
import { Dorm } from './dorms.entity';
import { CreateDormDto } from './dto/createDorm.dto';
import { UpdateDormDto } from './dto/updateDorm.dto';

@Injectable()
export class DormsService {
  constructor(
    @InjectRepository(Dorm)
    private dormRepository: Repository<Dorm>,
    private fileService: FilesService,
    ) {

  }

  async createDorm(dormDto: CreateDormDto, image?: Express.Multer.File) {
    const dorm = this.dormRepository.create(dormDto);

    if(!image) {
      return this.dormRepository.save(dorm)
    }

    const {fileName, fileUrl} = await this.fileService.createFile(image);
    if(fileName && fileUrl) {
      dorm.imageName = fileName;
      dorm.imageUrl = fileUrl;
    }

    return this.dormRepository.save(dorm);
  }

  async getAllDorms() {
    const dorms = await this.dormRepository.find();
    return dorms;
  }

  async getByName(name: string) {
    const dorm = await this.dormRepository.findOne({
      where: {
        name: name
      }
    });

    return dorm;
  }

  async getById(id: string) {
    const dorm = await this.dormRepository.findOne({
      where: {
        id
      }
    });
    return dorm;
  }

  async getAllDormsByName(names: string[]) {
    const dorm = await this.dormRepository.find({
      where: {
        name: In(names)
      }
    });
    return dorm;
  }

  async updateDormByName(id: string, newsDto: UpdateDormDto, image?: Express.Multer.File) {
    const dorm = await this.dormRepository.findOne({
      where: {
        id
      }
    });

    if(!dorm) {
      throw new NotFoundException('Dorm doesn`t exist')
    }

    const updatedDorm = this.dormRepository.create({...dorm, ...newsDto})

    if(!image) {
      return this.dormRepository.save(updatedDorm)
    }

    const {fileName, fileUrl} = await this.fileService.createFile(image);
    if(fileName && fileUrl) {
      updatedDorm.imageName = fileName;
      updatedDorm.imageUrl = fileUrl;
    }

    return this.dormRepository.save(updatedDorm);
  }
}
