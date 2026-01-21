# ORANGE BOX DATABASE

Nama database production -> orangebox
Nama database development -> orangebox_dev

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

# Schema

<!-- UNTUK LOGIN -->

model users {

- id Int @id @default(autoincrement())
- name String
- username String @unique
- password String @db.LongText

- created_at DateTime @default(now())
- updated_at DateTime @default(now()) @updatedAt
- tokens tokens[]

}

model tokens {

- id String @id @default(uuid())
- user_id Int @unique
- token String @db.LongText

- created_at DateTime @default(now())
- updated_at DateTime @default(now()) @updatedAt

- user users @relation(fields: [user_id], references: [id])

}

<!-- UNTUK MENU -->

model categories {

- id Int @id @default(autoincrement())
- name String @unique
- description String @db.LongText
- products products[]

}

model products {

- id Int @id @default(autoincrement())
- category_id Int
- photo String @db.LongText
- name String @unique
- description String @db.LongText
- price Decimal

- is_favorite Boolean @default(false)
- is_new Boolean @default(false)

- created_at DateTime @default(now())
- updated_at DateTime @default(now()) @updatedAt

- category categories @relation(fields: [category_id], references: [id])

}

model umkm_name {

- name String @unique
- address String @db.LongText

}

model sosmed {

- id Int @id @default(autoincrement())
- name String @unique
- description String
- link String @db.LongText

- more_cta more_cta?

- button_location1 location[] @relation("link1")
- button_location2 location[] @relation("link2")

}

<!-- SECTION 1 -->

model hero {

- headline String @unique // Satu Tempat, Semua Rasa Favoritmu.
- subheadline String // Ngopi santai, Makan Puas . . .
- photo String @db.LongText //
- description String @db.LongText // Dari aroma kopi yang menggugah selera hingga hidangan favorit yang siap menemani waktu santai atau kerja.

}

<!-- SECTION 2 -->

model favorite_menu {

- title String @unique // Favorite Menu
- information String // (Geser untuk lihat lainnya.)
- max_show_product Int // 5

}

<!-- SECTION 3 -->

model facility_and_place {

- title String @unique // Fasilitas & Tempat
- information String // (Scroll sampai bawah)

}

model facilities_and_places {

- id Int @id @default(autoincrement()) // 1
- photo String @db.LongText // photo.webp
- name String // live music

}

<!-- SECTION 4 -->

model more_cta {

- title String @unique // Kamu juga bisa booking tempat untuk acara loh
- button String // beritahu kami
- link_id Int @unique // diambil dari sosmed

- sosmed sosmed @relation(fields: [link_id], references: [id])

}

<!-- SECTION 5 -->

model testimoni {

- title String @unique // Apa Kata Mereka?
- information String // (Geser untuk lihat lainnya)

}

model testimonies {

- id Int @id @default(autoincrement()) // 1
- photo String? @db.LongText // photo.webp
- name String // Abdul Khodir
- description String // Tempatnya nyaman banget, cocok kalau mau nugas.

}

<!-- SECTION 6 -->

model location {

- title String @unique // Lokasi kami ada di:
- photo String @db.LongText // photo.webp

- button1 String // arahkan
- link1_id Int // diambil dari sosmed

- tton2 String // hubungi kami
- nk2_id Int // diambil dari sosmed

- link1 sosmed @relation("link1",fields: [link1_id], references: [id])
- link2 sosmed @relation("link2",fields: [link2_id], references: [id])

}
