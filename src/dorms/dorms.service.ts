import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { In, Repository } from 'typeorm';
import { Dorm } from './dorms.entity';
import { CreateDormDto } from './dto/createDorm.dto';
import { UpdateDormDto } from './dto/updateDorm.dto';
import { MessageProviderService } from 'src/messageProvider/messageProvider.service';
import { MessageExchange, MessageRoute } from 'src/messageProvider/types';

@Injectable()
export class DormsService {
  constructor(
    @InjectRepository(Dorm)
    private dormRepository: Repository<Dorm>,
    private fileService: FilesService,
    private messageProvider: MessageProviderService
    ) {

  }

  async createDorm(dormDto: CreateDormDto, image?: Express.Multer.File) {
    const dorm = this.dormRepository.create(dormDto);

    if(!image) {
      const dormEntity = await this.dormRepository.save(dorm);

      this.sendUpdateDormMessage(dormEntity.id)

      return dormEntity
    }

    const {fileName, fileUrl} = await this.fileService.createFile(image);
    if(fileName && fileUrl) {
      dorm.imageName = fileName;
      dorm.imageUrl = fileUrl;
    }

    const dormEntity = await this.dormRepository.save(dorm);

    this.sendUpdateDormMessage(dormEntity.id)

    return dormEntity
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

  async updateDormByName(id: string, dormDto: UpdateDormDto, image?: Express.Multer.File) {
    const dorm = await this.dormRepository.findOne({
      where: {
        id
      }
    });

    if(!dorm) {
      throw new NotFoundException('Dorm doesn`t exist')
    }

    const updatedDorm = this.dormRepository.create({...dorm, ...dormDto})


    if(!image) {
      const dormEntity = await this.dormRepository.save(updatedDorm);

      this.sendUpdateDormMessage(dormEntity.id)

      return dormEntity
    }

    const {fileName, fileUrl} = await this.fileService.createFile(image);
    if(fileName && fileUrl) {
      updatedDorm.imageName = fileName;
      updatedDorm.imageUrl = fileUrl;
    }

    const dormEntity = await this.dormRepository.save(updatedDorm);

    this.sendUpdateDormMessage(dormEntity.id, true)

    return dormEntity
  }

  async deleteById(id: string) {
    const dorm = await this.dormRepository.findOne({
      where: { id }
    });

    if(!dorm) {
      throw new NotFoundException(`Dorm id: ${id} not found`)
    }

    return await this.dormRepository.remove(dorm)
  }

  private async sendUpdateDormMessage(dormId: string, update?: boolean) {
    const dorm = await this.dormRepository.findOne({
      where: {
        id: dormId
      }
    });

    if(!dorm) return;

    this.messageProvider.sendMessage(MessageExchange.DEFAULT, update ? MessageRoute.DORM_UPDATE : MessageRoute.DORM_CREATE, {
      id: dorm.id,
      name: dorm.name,
      reputationBound: dorm.reputationBound
    })
  }
}
