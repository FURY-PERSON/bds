import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Dorm } from './dorms.entity';
import { CreateDormDto } from './dto/createDorm.dto';
import { UpdateDormDto } from './dto/updateDorm.dto';

@Injectable()
export class DormsService {
  constructor(
    @InjectRepository(Dorm)
    private dormRepository: Repository<Dorm>,
    ) {

  }

  async createDorm(dormDto: CreateDormDto) {
    const dorm = await this.dormRepository.save(dormDto);
    return dorm;
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

  async updateDormByName(id: string, newsDto: UpdateDormDto) {
    const dorm = await this.dormRepository.findOne({
      where: {
        id
      }
    });

    if(!dorm) {
      throw new NotFoundException('Dorm doesn`t exist')
    }

    const updatedDorm = this.dormRepository.create({...dorm, ...newsDto})
    return updatedDorm
  }
}
