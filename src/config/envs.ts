import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number,
    NATS_SERVERS: string[],
    JWT_SECRET: string
}

const envsSchema = joi.object<EnvVars>({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    JWT_SECRET: joi.string().required()
}).unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
    JWT_SECRET: process.env.JWT_SECRET
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT,
    NATS_SERVERS: envVars.NATS_SERVERS,
    JWT_SECRET: envVars.JWT_SECRET
}
