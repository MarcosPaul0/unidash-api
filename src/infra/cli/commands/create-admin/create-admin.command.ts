import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { RegisterAdminUseCase } from '@/domain/application/use-cases/register-admin/register-admin';
import { z } from 'zod';
import { AskUserService } from '../../utils/ask-user/ask-user';

const createAdminBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAdminBodySchema = z.infer<typeof createAdminBodySchema>;

@Injectable()
export class CreateAdminCommand {
  constructor(
    private readonly askUserService: AskUserService,
    private readonly registerAdminUseCase: RegisterAdminUseCase,
  ) {}

  @Command({ command: 'create:admin', describe: 'creates an admin user' })
  async run(): Promise<void> {
    const [name, email, password] = await this.askUserService.askMany(
      'Nome Completo: ',
      'E-mail: ',
      'Senha: ',
    );

    const createAdminBody: CreateAdminBodySchema = {
      name,
      email,
      password,
    };

    try {
      createAdminBodySchema.parse(createAdminBody);
    } catch (err) {
      if (err instanceof z.ZodError) {
        this.askUserService.reply(
          `An error ocurred with admin input: ${err.issues[0].message}`,
        );
      } else {
        this.askUserService.reply(
          `An error ocurred while creating a new admin: ${err}`,
        );
      }

      return;
    }

    const result = await this.registerAdminUseCase.execute({
      ...createAdminBody,
    });

    if (result.isLeft()) {
      this.askUserService.reply('The user already exists');
      return;
    }

    this.askUserService.reply('The new admin was created successfully!');
  }
}
