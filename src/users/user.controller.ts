import {
    Body,
    Controller,
    Post,
    UseGuards,
    Get,
    UploadedFile,
    UseInterceptors,
    Param,
    ParseFilePipe,
    FileTypeValidator,
    MaxFileSizeValidator,
    Res,
    HttpStatus,
    Put,
    Req,
    Request,
    UnauthorizedException,
    HttpCode
  } from '@nestjs/common';
  import * as bcrypt from 'bcrypt';
  import { AuthGuard } from '@nestjs/passport';
  import { ParseObjectIdPipe } from 'src/app/pipes/parse-objectid.pipe';
  import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
  import { User } from './user.schema';
  import { UsersService } from './user.service';
  import { AuthService } from 'src/auth/auth.service';
  import { generateFromEmail, generateUsername } from "unique-username-generator";
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) { }
  
    //Create user
    @Post('/create')
    async createUser(@Res() res, @Body() createUserDto: CreateUserDto) {
      const { ...userData }: any = createUserDto;
     const check_count = 1
     let username:any=""
      if (await this.usersService.isUserExists(createUserDto)) {
        return res.status(HttpStatus.OK).json({
          message: "User with this creadential already registered",
        });
      }
      if(await this.usersService.check_username(createUserDto)){
        username = generateFromEmail(userData.fullname.replace(" ",""),3).toLowerCase()
      }
        else{
         username = userData.fullname.replace(" ", "").toLowerCase()
        }

      const user = await this.usersService.createUser({
        ...userData,
        username: username,
      })
      return res.status(HttpStatus.OK).json({
        message: "User has been created successfully",
        user,
      });
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Put('/update/:id')
    async updatePost(
      @Req() request,
      @Res() response,
      @Param('id', ParseObjectIdPipe) id: string,
      @Body() post: UpdateUserDto
    ): Promise<User> {
      const updateUser = await this.usersService.update(id, {
        ...post,
        updated_at:new Date().toLocaleString()
      });
      return response.status(200).json(updateUser);
    }
  
  
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllUsers(@Req() req) {
      // console.log(req.user)
      // if(req.user){
      //   console.log(req.user.username)
      //   const username=req.user.username
      //   const user = await this.usersService.getUser({username} );
      //   console.log(user?user:"hello")
      // }
      return this.usersService.getUsers();
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getMe(@Param() params) {
      return this.usersService.getMe(params.id);
    }
  
    @UseGuards(AuthGuard('local'))
    @Post('changePasword')
    async changePassword(@Res() res,@Request() req,@Body() post: UpdateUserDto) {
      const isPasswordMatching = await bcrypt.compare(
        req.body.password,
        req?.user.password,
      );
      if(isPasswordMatching){
        if(req.body.newpassword!==req.body.confirmpassword){
          throw new UnauthorizedException("New Password and Confirm password not match" );
        }
        else{
          const saltOrRounds = 10;
        const hash = await bcrypt.hash(req.body.newpassword, saltOrRounds);
        console.log(hash)
         const updateUser = await this.usersService.update((req.user._id).toString(), {
        ...post,
        password:hash,
        password_change:false,
        updated_at:new Date().toLocaleString()
      });
      return res.status(HttpStatus.OK).json({
        message: "Password Change Successfully",
      });
        }
      }
      else{
        throw new UnauthorizedException("Please Enter Valid old Password");
      }
      
    
      
    }
  }