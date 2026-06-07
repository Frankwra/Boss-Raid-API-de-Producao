import bcrypt from "bcryptjs"
import type { IUserRepository, UserCreateInput, UserUpdateInput } from "../interfaces/iuser.repository.js"
import { signToken } from "../lib/jwt.js"

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(data: UserCreateInput) {
    const existing = await this.userRepository.findByEmail(data.email)
    if (existing) {
      throw new UserError("Email já cadastrado", 409)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    })

    const token = signToken({ userId: user.id, role: user.role })

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        role: user.role,
      },
      token,
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UserError("Email ou senha inválidos", 401)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new UserError("Email ou senha inválidos", 401)
    }

    const token = signToken({ userId: user.id, role: user.role })

    return {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        role: user.role,
      },
      token,
    }
  }

  async getProfile(id: string) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new UserError("Usuário não encontrado", 404)
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      role: user.role,
      createdAt: user.createdAt,
    }
  }

  async updateProfile(id: string, data: UserUpdateInput) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new UserError("Usuário não encontrado", 404)
    }

    const updated = await this.userRepository.update(id, data)

    return {
      id: updated.id,
      email: updated.email,
      nickname: updated.nickname,
      avatar: updated.avatar,
      xp: updated.xp,
      level: updated.level,
      role: updated.role,
    }
  }
}

export class UserError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = "UserError"
  }
}
