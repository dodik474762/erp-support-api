import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ValidationService } from 'src/validation/validation/validation.service';
// import { Repository, UpdateResult } from 'typeorm';
// import { z } from 'zod';
// import { User } from './user.entity';
// import { UserHasRoles } from 'src/repository/user_has_roles.entity';

@Injectable()
export class UserService {
    // constructor(
    //     private validationService: ValidationService,
    //     @InjectRepository(User)
    //     private userRepository: Repository<User>,
    //     @InjectRepository(UserHasRoles)
    //     private userRolesRepo: Repository<UserHasRoles>,
    // ) { }

    // sayHello(name: string): string {
    //     const schema = z.string().min(5).max(100);
    //     const result = this.validationService.validate(schema, name);
    //     return `Hello ${result}`;
    // }

    // async findAll(): Promise<User[]> {
    //     return this.userRepository.find();
    // }

    // async findOne(id: number): Promise<User | null> {
    //     return this.userRepository.findOneBy({ id: id });
    // }

    // async remove(id: number): Promise<void> {
    //     await this.userRepository.delete({id: id});
    // }
    
    // async save(user:User): Promise<User> {
    //     const users = await this.userRepository.save(user);
    //     return users;
    // }
    
    // async update(id:number, value:any): Promise<UpdateResult> {
    //     const result = await this.userRepository.update({id: id}, value);
    //     return result;
    // }
    
    // async getUserNormal(): Promise<User[]> {
    //     const users = await this.userRepository.query('select * from users');
    //     return users;
    // }
    
    // async getUserJoin(): Promise<User[]> {
    //     const users = await this.userRepository.createQueryBuilder("users")
    //     .select(["users.username as username", "rs.akses"])
    //     .innerJoin("roles", "rs", "rs.id = users.roles").getRawMany();
    //     return users;
    // }
    
    // async getRelasi(): Promise<UserHasRoles[]> {
    //     return this.userRolesRepo.find({
    //         relations: {
    //             dataroles: true,
    //         }
    //     });
    // }
}
