import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { UsersModel } from 'src/model/users.model';

export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {

        super({

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            jsonWebTokenOptions: {
                // this object maps to jsonwebtoken verifier options
                ignoreNotBefore: true,
                // ...
                // maybe ignoreExpiration too?
              },

            secretOrKey: env.JWT_SECRET,

        });

    }

    async validate(payload: UsersModel) {
        console.log('user validate',payload, new Date());
        return payload;

    }

}