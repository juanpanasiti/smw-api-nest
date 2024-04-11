import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, OptionsList, UpdateProfileDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { ResponseInterceptor } from 'src/common/interceptors/response/response.interceptor';

@UseInterceptors(ResponseInterceptor)
@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // @Post()
  // create(@Body() createProfileDto: CreateProfileDto) {
  //   return this.profileService.create(createProfileDto);
  // }

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() options: OptionsList) {
    return this.profileService.findAll(options);
  }

  @Get(':id')
  @Auth()
  findOne(@Query() options: OptionsList, @Param('id') id: string, @GetUser() user: User) {
    return this.profileService.findOne(id, user, options);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto, @GetUser() user: User) {
    return this.profileService.update(id, updateProfileDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
