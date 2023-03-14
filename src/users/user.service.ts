import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
  ) { }

  //create user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    var domainArray = createUserDto.email.split('@')
    var domain = domainArray[domainArray.length - 1]

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hash
    });
    return createdUser.save();

  }

  //Check user exist 
  async isUserExists(createUserDto: CreateUserDto): Promise<any> {
    const { email } = createUserDto;
    const emailId = await this.userModel.findOne({ email });
    if (emailId) return true;
    else return false;
  }

  async check_username(createUserDto: CreateUserDto): Promise<any> {
    const username =createUserDto.fullname.replace(" ","");
    const userId = await this.userModel.findOne({username });
    if (userId) return true;
    else return false;
  }



  // Update User service
  async update(id: string, updateUserDto: UpdateUserDto) {
    const post = await this.userModel
      .findByIdAndUpdate(id)
      .setOptions({ new: true })
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUser(query: object): Promise<User> {
    return this.userModel.findOne(query);
  }

  async getMe(userId): Promise<User | undefined> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw 'User not found';
    }
    return user;
  }

}
