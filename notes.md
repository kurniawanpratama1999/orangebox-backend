# ORANGE BOX DATABASE

Nama database production -> orangebox
Nama database development -> orangebox_dev

Table

- users (id, username, password)
- tokens (id, user_id, token)
- products (id, category_id, name, price, is_recommended, is_new, description)
- category_products (id, name, description)
- profile_umkm (id, name, photo, description, ig, fb, x, whatsapp, address)
- profile_owner (id, name, photo, description)
- merchants (id, name, link)

Dir

- Controller
  contoh :
  export const UserController = {
  async index (req, res) {
  try {
  const users = await UserService.index()
  return res.send({
  success: true,
  code: 'UserIndexSuccess',
  data: users
  })
  }
  catch(error) {
  return res.500
  }
  }
  }

- Service
  contoh :
  export const UserService = {
  async index () {
  return UserRepo.index()
  },
  async create (username, password) {
  const hashPassword = await Bcrypt.hash(password, salt)
  return UserRepo.create(username, hashPassword)
  },
  }

- Repository -> langsung database
  contoh :
  export const UserRepository = {
  async index () {
  return await prisma.users.findMany()
  },
  async create (username, password) {
  return await prisma.users.create({
  username,
  password
  })
  },

}

# Middleware

- token
- refresh_token

# Validation

- Zod

# Routing

INDEX -> GET /
CREATE -> POST /
UPDATE -> PUT /:id
DELETE -> DELETE /:id
SHOW -> GET /:id
SEARCH -> GET /?q=text
