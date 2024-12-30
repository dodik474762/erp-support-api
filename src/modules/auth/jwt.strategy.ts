import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';

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

    async validate(payload: any) {
        console.log('user validate',payload);
        return { userId: payload.sub, username: payload.username, password: payload.password };

    }

}