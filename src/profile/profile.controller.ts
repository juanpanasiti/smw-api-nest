import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // @Post()
  // create(@Body() createProfileDto: CreateProfileDto) {
  //   return this.profileService.create(createProfileDto);
  // }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.profileService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
