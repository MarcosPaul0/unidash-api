import { Injectable, OnModuleDestroy } from '@nestjs/common'
import * as readline from 'readline'
import * as util from 'util'

@Injectable()
export class AskUserService implements OnModuleDestroy {
  private readonly io = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  async ask(question: string): Promise<string> {
    const answers = await this.askMany(question)
    return answers[0]
  }

  async askMany(...questions: string[]): Promise<string[]> {
    const ioQuestion = util.promisify(this.io.question).bind(this.io)

    const answers: string[] = []

    for (const question of questions) {
      const answer = await ioQuestion(question)
      answers.push(answer)
    }

    return answers
  }

  reply(message: string): void {
    this.io.write(message)
    this.io.write('\n')
  }

  logError(error: string): void {
    const redColorCode = 31
    const errorMessage = `Error: ${error}`

    this.io.write(`\x1b[${redColorCode}m${errorMessage}\x1b[0m`)
    this.io.write('\n')
  }

  onModuleDestroy(): void {
    this.io.close()
  }
}
